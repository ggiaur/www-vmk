<?php

declare(strict_types=1);

use Timber\PostQuery;
use Timber\Timber;

$context = Timber::context();
$context['posts'] = Timber::get_posts([], PostQuery::class);
$context['pagination'] = $context['posts']->pagination();

Timber::render('templates/archive.twig', $context);
