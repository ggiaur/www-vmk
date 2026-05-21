<?php

declare(strict_types=1);

use Timber\Timber;
use Timber\PostQuery;

if (! class_exists(Timber::class)) {
    wp_die(
        esc_html__('A VMK Timber téma futtatásához aktív Timber plugin szükséges.', 'vmk-timber'),
        esc_html__('Hiányzó plugin', 'vmk-timber')
    );
}

$context = Timber::context();
$context['page'] = Timber::get_post();
$context['home'] = vmk_timber_get_homepage_content();

// Helper function to check if posts are real custom content or just default WP hello-world installations
$is_real_post = static function ($post): bool {
    if (!$post) {
        return false;
    }
    $title_str = '';
    if (is_object($post)) {
        if (method_exists($post, 'title')) {
            $title_str = $post->title();
        } elseif (isset($post->post_title)) {
            $title_str = $post->post_title;
        } elseif (isset($post->title)) {
            $title_str = $post->title;
        }
    }
    $title = strtolower(trim((string)$title_str));
    return $title !== '' 
        && $title !== 'hello world!' 
        && $title !== 'hello world' 
        && $title !== 'üdvözöljük a wordpress-ben!' 
        && $title !== 'üdvözöljük a wordpress-ben'
        && $title !== 'próba bejegyzés'
        && $title !== 'próbabejegyzés';
};

$featured_posts_query = Timber::get_posts(
    [
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => 4,
        'ignore_sticky_posts' => false,
    ],
    PostQuery::class
);
$featured_posts = array_values(iterator_to_array($featured_posts_query));

$has_real_featured = false;
foreach ($featured_posts as $p) {
    if ($is_real_post($p)) {
        $has_real_featured = true;
        break;
    }
}

if ($has_real_featured) {
    $featured_lead = $featured_posts[0] ?? null;
    $featured_aside = array_slice($featured_posts, 1, 3);
    
    if ($featured_lead !== null) {
        $context['home']['featured']['lead'] = $featured_lead;
    }
    if (count($featured_aside) > 0) {
        $context['home']['featured']['aside'] = $featured_aside;
    }
}

$news_posts = Timber::get_posts(
    [
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => 3,
    ],
    PostQuery::class
);

$has_real_news = false;
foreach ($news_posts as $p) {
    if ($is_real_post($p)) {
        $has_real_news = true;
        break;
    }
}

if ($has_real_news) {
    $context['home']['news']['items'] = $news_posts;
}

Timber::render('templates/front-page.twig', $context);
