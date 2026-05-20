<?php

declare(strict_types=1);

use Timber\Timber;

$context = Timber::context();

Timber::render('templates/404.twig', $context);
