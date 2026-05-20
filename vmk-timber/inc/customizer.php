<?php

declare(strict_types=1);

add_action('customize_register', 'vmk_timber_customize_register');

function vmk_timber_customize_register(WP_Customize_Manager $wp_customize): void
{
    $wp_customize->add_section(
        'vmk_timber_home_hero',
        [
            'title' => __('VMK Hero', 'vmk-timber'),
            'priority' => 30,
        ]
    );

    vmk_timber_add_customizer_text($wp_customize, 'vmk_hero_eyebrow', 'vmk_timber_home_hero', 'Eyebrow', 'Vorosmarty Mihaly Konyvtar');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_hero_title', 'vmk_timber_home_hero', 'Hero cim', 'Kozossegi ter, olvasas, programok es helyismeret egy oldalon.');
    vmk_timber_add_customizer_textarea($wp_customize, 'vmk_hero_text', 'vmk_timber_home_hero', 'Hero leiras', 'Egy modern konyvtari kezdolap Timber alapon, amely kiemeli a keresest, az aktualis szolgaltatasokat, a hireket es a kozossegi esemenyeket.');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_primary_cta_label', 'vmk_timber_home_hero', 'Elso gomb felirat', 'Kereses a katalogusban');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_primary_cta_url', 'vmk_timber_home_hero', 'Elso gomb link', '#kereses');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_secondary_cta_label', 'vmk_timber_home_hero', 'Masodik gomb felirat', 'Programok megnyitasa');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_secondary_cta_url', 'vmk_timber_home_hero', 'Masodik gomb link', '#programok');

    $wp_customize->add_section(
        'vmk_timber_contact',
        [
            'title' => __('VMK Kapcsolat', 'vmk-timber'),
            'priority' => 31,
        ]
    );

    vmk_timber_add_customizer_text($wp_customize, 'vmk_contact_address', 'vmk_timber_contact', 'Cim', '8000 Szekesfehervar, Bartok Bela ter 1.');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_contact_phone', 'vmk_timber_contact', 'Telefonszam', '+36 22 000 000');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_contact_email', 'vmk_timber_contact', 'Email', 'info@vmk.hu');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_contact_hours', 'vmk_timber_contact', 'Fejlec nyitvatartas', 'Ma nyitva: 09:00 - 19:00');
    vmk_timber_add_customizer_text($wp_customize, 'vmk_contact_catalog_url', 'vmk_timber_contact', 'Katalogus link', '#kereses');

    $wp_customize->add_section(
        'vmk_timber_info_panels',
        [
            'title' => __('VMK Informacios blokkok', 'vmk-timber'),
            'priority' => 32,
        ]
    );

    vmk_timber_add_customizer_textarea($wp_customize, 'vmk_search_meta', 'vmk_timber_info_panels', 'Kereso infok', "Nyitva ma: 09:00 - 19:00\nBeiratkozas online is elerheto\nWifi es szamitogephasznalat a kozponti konyvtarban");
    vmk_timber_add_customizer_textarea($wp_customize, 'vmk_hours_items', 'vmk_timber_info_panels', 'Nyitvatartas sorok', "Kozponti konyvtar|H-P 09:00 - 19:00\nGyermekkonyvtar|H-P 10:00 - 18:00\nOlvasoterem|H-Szo 09:00 - 20:00\nHelyismeret|H-P 09:00 - 17:00");
    vmk_timber_add_customizer_textarea($wp_customize, 'vmk_resources_items', 'vmk_timber_info_panels', 'Digitalis forrasok', "e-konyvek\nhangoskonyvek\nvideos tartalmak\nzenei gyujtemeny\nfolyoiratok");
}

function vmk_timber_add_customizer_text(
    WP_Customize_Manager $wp_customize,
    string $setting,
    string $section,
    string $label,
    string $default
): void {
    $wp_customize->add_setting(
        $setting,
        [
            'default' => $default,
            'sanitize_callback' => 'sanitize_text_field',
        ]
    );

    $wp_customize->add_control(
        $setting,
        [
            'label' => __($label, 'vmk-timber'),
            'section' => $section,
            'type' => 'text',
        ]
    );
}

function vmk_timber_add_customizer_textarea(
    WP_Customize_Manager $wp_customize,
    string $setting,
    string $section,
    string $label,
    string $default
): void {
    $wp_customize->add_setting(
        $setting,
        [
            'default' => $default,
            'sanitize_callback' => 'sanitize_textarea_field',
        ]
    );

    $wp_customize->add_control(
        $setting,
        [
            'label' => __($label, 'vmk-timber'),
            'section' => $section,
            'type' => 'textarea',
        ]
    );
}
