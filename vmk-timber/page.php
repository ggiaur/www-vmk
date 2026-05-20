<?php

declare(strict_types=1);

use Timber\Timber;

$context = vmk_timber_build_page_context();

Timber::render('templates/page.twig', $context);
