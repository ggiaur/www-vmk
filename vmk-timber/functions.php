<?php

declare(strict_types=1);

use Timber\Menu;
use Timber\Post;
use Timber\Site;
use Timber\Timber;

require_once __DIR__ . '/inc/theme-data.php';
require_once __DIR__ . '/inc/customizer.php';

if (! class_exists(Timber::class)) {
    add_action('after_setup_theme', static function (): void {
        add_theme_support('title-tag');
    });

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>';
        echo esc_html__('A VMK Timber téma használatához a Timber plugint aktiválni kell.', 'vmk-timber');
        echo '</p></div>';
    });

    return;
}

class VmkTimberSite extends Site
{
    public function __construct()
    {
        add_action('after_setup_theme', [$this, 'theme_supports']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_filter('timber/context', [$this, 'add_to_context']);
        add_filter('timber/twig', [$this, 'extend_twig']);

        parent::__construct();
    }

    public function theme_supports(): void
    {
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('custom-logo');
        add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
        add_theme_support('menus');
        add_theme_support('responsive-embeds');

        register_nav_menus(
            [
                'primary' => __('Fejléc menü', 'vmk-timber'),
                'footer_about' => __('Lábléc - Rólunk', 'vmk-timber'),
                'footer_services' => __('Lábléc - Szolgáltatások', 'vmk-timber'),
                'footer_support' => __('Lábléc - Kapcsolatok', 'vmk-timber'),
            ]
        );
    }

    public function enqueue_assets(): void
    {
        wp_enqueue_style(
            'vmk-timber-fonts',
            'https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap',
            [],
            null
        );

        wp_enqueue_style(
            'vmk-timber-main',
            get_template_directory_uri() . '/assets/css/main.css',
            ['vmk-timber-fonts'],
            filemtime(get_template_directory() . '/assets/css/main.css')
        );

        wp_enqueue_script(
            'vmk-timber-main',
            get_template_directory_uri() . '/assets/js/main.js',
            [],
            filemtime(get_template_directory() . '/assets/js/main.js'),
            true
        );
    }

    public function add_to_context(array $context): array
    {
        $context['site'] = $this;
        $context['body_class'] = implode(' ', get_body_class());
        $context['menus'] = [
            'primary' => has_nav_menu('primary') ? new Menu('primary') : vmk_timber_get_primary_menu_fallback(),
            'footer_about' => has_nav_menu('footer_about') ? new Menu('footer_about') : vmk_timber_get_footer_about_fallback(),
            'footer_services' => has_nav_menu('footer_services') ? new Menu('footer_services') : vmk_timber_get_footer_services_fallback(),
            'footer_support' => has_nav_menu('footer_support') ? new Menu('footer_support') : vmk_timber_get_footer_support_fallback(),
        ];
        $context['footer'] = vmk_timber_get_footer_content();
        $context['branding'] = [
            'title' => get_bloginfo('name') ?: 'Vörösmarty Mihály Könyvtár',
            'tagline' => get_bloginfo('description') ?: 'Közösségi könyvtári tér',
        ];
        $context['theme'] = [
            'archive_title' => vmk_timber_get_archive_title(),
            'archive_intro' => vmk_timber_get_archive_intro(),
        ];

        // Tagkonyvtarak CPT query / fallback
        $tagkonyvtar_posts = Timber::get_posts([
            'post_type' => 'tagkonyvtar',
            'posts_per_page' => -1,
        ]);
        $context['tagkonyvtarak'] = count($tagkonyvtar_posts) > 0 ? $tagkonyvtar_posts : vmk_timber_get_tagkonyvtar_fallback();

        // Programok CPT query / fallback
        $program_posts = Timber::get_posts([
            'post_type' => 'program',
            'posts_per_page' => 3,
        ]);
        $context['programok'] = count($program_posts) > 0 ? $program_posts : vmk_timber_get_program_fallback();

        // Adatbazisok CPT query / fallback
        $adatbazis_posts = Timber::get_posts([
            'post_type' => 'adatbazis',
            'posts_per_page' => -1,
        ]);
        $context['adatbazisok'] = count($adatbazis_posts) > 0 ? $adatbazis_posts : vmk_timber_get_adatbazis_fallback();

        return $context;
    }

    public function extend_twig(\Twig\Environment $twig): \Twig\Environment
    {
        return $twig;
    }
}

// CPT Registration
function vmk_timber_register_cpts(): void
{
    // Tagkonyvtar CPT
    register_post_type('tagkonyvtar', [
        'labels' => [
            'name' => 'Tagkönyvtárak',
            'singular_name' => 'Tagkönyvtár',
            'add_new' => 'Új Hozzáadása',
            'add_new_item' => 'Új Tagkönyvtár hozzáadása',
            'edit_item' => 'Tagkönyvtár szerkesztése',
            'all_items' => 'Minden Tagkönyvtár',
        ],
        'public' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'tagkonyvtarak'],
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-admin-home',
        'show_in_rest' => true,
    ]);

    // Program CPT
    register_post_type('program', [
        'labels' => [
            'name' => 'Programok',
            'singular_name' => 'Program',
            'add_new' => 'Új Hozzáadása',
            'add_new_item' => 'Új Program hozzáadása',
            'edit_item' => 'Program szerkesztése',
            'all_items' => 'Minden Program',
        ],
        'public' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'programok'],
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-calendar-alt',
        'show_in_rest' => true,
    ]);

    // Adatbazis CPT
    register_post_type('adatbazis', [
        'labels' => [
            'name' => 'Adatbázisok',
            'singular_name' => 'Adatbázis',
            'add_new' => 'Új Hozzáadása',
            'add_new_item' => 'Új Adatbázis hozzáadása',
            'edit_item' => 'Adatbázis szerkesztése',
            'all_items' => 'Minden Adatbázis',
        ],
        'public' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'adatbazisok'],
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-database',
        'show_in_rest' => true,
    ]);
}
add_action('init', 'vmk_timber_register_cpts');

new VmkTimberSite();


function vmk_timber_get_archive_title(): string
{
    if (is_search()) {
        return sprintf('Keresési találatok: %s', get_search_query());
    }

    if (is_home()) {
        return 'Könyvtári hírek';
    }

    if (is_archive()) {
        return wp_strip_all_tags(get_the_archive_title());
    }

    if (is_404()) {
        return 'Az oldal nem található';
    }

    return get_the_title() ?: get_bloginfo('name');
}

function vmk_timber_get_archive_intro(): string
{
    if (is_search()) {
        return 'Találatok a teljes oldalon, cikkekben és nyilvános tartalmak között.';
    }

    if (is_home()) {
        return 'Friss hírek, programajánlók és tájékoztatók a könyvtár mindennapjaiból.';
    }

    if (is_archive()) {
        $description = trim((string) get_the_archive_description());

        return $description !== '' ? wp_strip_all_tags($description) : 'Válogatott tartalmak az aktuális archívum nézethez.';
    }

    if (is_404()) {
        return 'Lehet, hogy az oldal átköltözött, átneveződött vagy már nem érhető el.';
    }

    return get_bloginfo('description');
}

function vmk_timber_build_page_context(?Post $post = null): array
{
    $context = Timber::context();
    $context['post'] = $post ?? Timber::get_post();

    return $context;
}
