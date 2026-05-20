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
$featured_lead = $featured_posts[0] ?? null;
$featured_aside = array_slice($featured_posts, 1, 3);
$news_posts = Timber::get_posts(
    [
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => 3,
    ],
    PostQuery::class
);

if (count($news_posts) > 0) {
    $context['home']['news']['items'] = $news_posts;
}

if ($featured_lead !== null) {
    $context['home']['featured']['lead'] = $featured_lead;
}

if (count($featured_aside) > 0) {
    $context['home']['featured']['aside'] = $featured_aside;
}

Timber::render('templates/front-page.twig', $context);
