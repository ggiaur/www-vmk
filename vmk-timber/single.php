<?php

declare(strict_types=1);

use Timber\PostQuery;
use Timber\Timber;

$context = vmk_timber_build_page_context();
$context['related_posts'] = Timber::get_posts(
    [
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => 3,
        'post__not_in' => [$context['post']->ID],
    ],
    PostQuery::class
);

Timber::render('templates/single.twig', $context);
