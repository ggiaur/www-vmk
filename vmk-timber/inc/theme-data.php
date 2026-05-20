<?php

declare(strict_types=1);

function vmk_timber_mod(string $key, string $default = ''): string
{
    $value = get_theme_mod($key, $default);

    return is_string($value) ? $value : $default;
}

function vmk_timber_parse_lines(string $value): array
{
    $lines = preg_split('/\r\n|\r|\n/', trim($value)) ?: [];

    return array_values(
        array_filter(
            array_map(
                static fn(string $line): string => trim($line),
                $lines
            ),
            static fn(string $line): bool => $line !== ''
        )
    );
}

function vmk_timber_parse_pairs(string $value): array
{
    $items = [];

    foreach (vmk_timber_parse_lines($value) as $line) {
        $parts = array_map('trim', explode('|', $line, 2));

        if (count($parts) === 2 && $parts[0] !== '' && $parts[1] !== '') {
            $items[] = [
                'label' => $parts[0],
                'value' => $parts[1],
            ];
        }
    }

    return $items;
}

function vmk_timber_get_homepage_content(): array
{
    return [
        'hero' => [
            'eyebrow' => vmk_timber_mod('vmk_hero_eyebrow', 'Vorosmarty Mihaly Konyvtar'),
            'title' => vmk_timber_mod('vmk_hero_title', 'Kozossegi ter, olvasas, programok es helyismeret egy oldalon.'),
            'text' => vmk_timber_mod('vmk_hero_text', 'Egy modern konyvtari kezdolap Timber alapon, amely kiemeli a keresest, az aktualis szolgaltatasokat, a hireket es a kozossegi esemenyeket.'),
            'primary_cta' => [
                'label' => vmk_timber_mod('vmk_primary_cta_label', 'Kereses a katalogusban'),
                'url' => vmk_timber_mod('vmk_primary_cta_url', '#kereses'),
            ],
            'secondary_cta' => [
                'label' => vmk_timber_mod('vmk_secondary_cta_label', 'Programok megnyitasa'),
                'url' => vmk_timber_mod('vmk_secondary_cta_url', '#programok'),
            ],
            'stats' => [
                ['value' => '75+', 'label' => 'eves helyismereti gyujtes'],
                ['value' => '1200+', 'label' => 'rendezveny evente'],
                ['value' => '13', 'label' => 'varosi es fiok helyszin'],
            ],
            'highlights' => [
                [
                    'title' => 'Konyvtari utmutatok',
                    'text' => 'Beiratkozas, kolcsonzes, hosszabbitas es digitalis hozzaferesek egy helyen.',
                    'url' => '#szolgaltatasok',
                ],
                [
                    'title' => 'Programnaptar',
                    'text' => 'Gyerekfoglalkozasok, irodalmi estek, kiallitasok es workshopok.',
                    'url' => '#programok',
                ],
                [
                    'title' => 'Olvasoterek',
                    'text' => 'Csendes tanulozonak, kozossegi terek es szamitogepes munkaallomasok.',
                    'url' => '#terek',
                ],
            ],
        ],
        'search' => [
            'label' => 'Kereses',
            'title' => 'Mit keresel ma?',
            'placeholder' => 'Konyvcim, szerzo, tema vagy program neve',
            'button' => 'Kereses',
            'meta' => vmk_timber_parse_lines(vmk_timber_mod('vmk_search_meta', "Nyitva ma: 09:00 - 19:00\nBeiratkozas online is elerheto\nWifi es szamitogephasznalat a kozponti konyvtarban")),
        ],
        'services' => [
            'title' => 'Nepszeru szolgaltatasok',
            'intro' => 'A fooldal gyors belepesi pontokat ad a leggyakoribb ugyintezeshez es tajekozodashoz.',
            'items' => [
                [
                    'title' => 'Kolcsonzes, elojegyzes, hosszabbitas',
                    'text' => 'Olvasoi fiok es alapveto konyvtarhasznalati teendok gyors eleressel.',
                    'url' => '#',
                ],
                [
                    'title' => 'Helyismereti gyujtemeny',
                    'text' => 'Varostorteneti dokumentumok, fotok, periodikak es digitalizalt anyagok.',
                    'url' => '#',
                ],
                [
                    'title' => 'Nyomtatas es szkenneles',
                    'text' => 'Mindennapi ugyintezeshez es kutatashoz szukseges eszkozok.',
                    'url' => '#',
                ],
                [
                    'title' => 'Segitseg kutatashoz',
                    'text' => 'Tematikus eligazitas, adatbazis-hasznalat es szemelyes tamogatas.',
                    'url' => '#',
                ],
                [
                    'title' => 'Digitalis tartalmak',
                    'text' => 'E-konyvek, online forrasok es tavoli hozzaferessel hasznalhato gyujtemenyek.',
                    'url' => '#',
                ],
                [
                    'title' => 'Terem- es helyfoglalas',
                    'text' => 'Kozossegi es tanuloterek elerhetosege, foglalasi tajekoztatoval.',
                    'url' => '#',
                ],
            ],
        ],
        'featured' => [
            'title' => 'Kiemelt tartalmak',
            'lead' => [
                'category' => 'Ujdonsag',
                'title' => 'Tavaszi olvasasnepszerusito sorozat a konyvtar tereiben',
                'text' => 'Interaktiv ajanlok, tematikus polcok es kozossegi programok kapcsoljak ossze az olvasokat a varosi konyvtar kulonbozo tereiben.',
                'url' => '#',
            ],
            'aside' => [
                ['title' => 'Helyismereti adatbazis frissitesek', 'category' => 'Adatbazis', 'url' => '#'],
                ['title' => 'Uj gyerekfoglalkozasok a hetvegekre', 'category' => 'Program', 'url' => '#'],
                ['title' => 'Olvasotermi nyitvatartas a vizsgaidoszakban', 'category' => 'Tajekoztato', 'url' => '#'],
            ],
        ],
        'news' => [
            'title' => 'Hirek es esemenyek',
            'items' => [
                [
                    'date' => '2026.03.25.',
                    'title' => 'Irodalmi beszelgetes kortars szerzokkel',
                    'text' => 'Beszelgetes es felolvasas a kozponti konyvtar rendezvenytermeben.',
                    'url' => '#',
                ],
                [
                    'date' => '2026.03.21.',
                    'title' => 'Digitalis tudasnap kozepiskolasoknak',
                    'text' => 'Keresesi technikak, hiteles forrasok es konyvtari adatbazisok gyakorlati bemutatoja.',
                    'url' => '#',
                ],
                [
                    'date' => '2026.03.18.',
                    'title' => 'Megujult helyismereti valogatas',
                    'text' => 'Varostorteneti anyagok uj ajanlofellettel es konnyebb bongeszhetoseggel.',
                    'url' => '#',
                ],
            ],
        ],
        'hours' => [
            'title' => 'Nyitvatartas',
            'items' => vmk_timber_parse_pairs(vmk_timber_mod('vmk_hours_items', "Kozponti konyvtar|H-P 09:00 - 19:00\nGyermekkonyvtar|H-P 10:00 - 18:00\nOlvasoterem|H-Szo 09:00 - 20:00\nHelyismeret|H-P 09:00 - 17:00")),
        ],
        'resources' => [
            'title' => 'Digitalis forrasok',
            'items' => vmk_timber_parse_lines(vmk_timber_mod('vmk_resources_items', "e-konyvek\nhangoskonyvek\nvideos tartalmak\nzenei gyujtemeny\nfolyoiratok")),
        ],
        'spaces' => [
            'title' => 'Terek tanulashoz es kozossegi programokhoz',
            'text' => 'Csendes olvasohelyek, csoportszobak es rugalmas kozossegi terek tamogatjak az egyeni es kozos hasznalatot.',
            'cta' => [
                'label' => 'Helyszinek es termek',
                'url' => '#terek',
            ],
        ],
        'donation' => [
            'title' => 'Tamogasd a konyvtarat',
            'text' => 'Kozossegi programok, olvasasnepszerusito kezdemenyezesek es helyi kulturalis projektek megvalositasahoz.',
            'cta' => [
                'label' => 'Tamogatasi lehetosegek',
                'url' => '#',
            ],
        ],
    ];
}

function vmk_timber_get_primary_menu_fallback(): array
{
    return [
        ['title' => 'Kezdőlap', 'link' => '#top'],
        ['title' => 'Oldalak', 'link' => '#szolgaltatasok'],
        ['title' => 'Rólunk', 'link' => '#kapcsolat'],
        ['title' => 'Események', 'link' => '#programok'],
        ['title' => 'Hírek', 'link' => '#hirek'],
        ['title' => 'Terek és termek', 'link' => '#terek'],
        ['title' => 'Kiadványok', 'link' => '#forrasok'],
    ];
}

function vmk_timber_get_footer_about_fallback(): array
{
    return [
        ['title' => 'Küldetésünk', 'link' => '#'],
        ['title' => 'Történetünk', 'link' => '#'],
        ['title' => 'Beszámolók', 'link' => '#'],
    ];
}

function vmk_timber_get_footer_services_fallback(): array
{
    return [
        ['title' => 'Beiratkozás', 'link' => '#'],
        ['title' => 'Katalógus', 'link' => '#'],
        ['title' => 'Programok', 'link' => '#'],
    ];
}

function vmk_timber_get_footer_support_fallback(): array
{
    return [
        ['title' => 'Elérhetőségek', 'link' => '#kapcsolat'],
        ['title' => 'Adatvédelem', 'link' => '#'],
        ['title' => 'Akadálymentesség', 'link' => '#'],
    ];
}

function vmk_timber_get_footer_content(): array
{
    return [
        'address' => vmk_timber_mod('vmk_contact_address', '8000 Szekesfehervar, Bartok Bela ter 1.'),
        'phone' => vmk_timber_mod('vmk_contact_phone', '+36 22 000 000'),
        'email' => vmk_timber_mod('vmk_contact_email', 'info@vmk.hu'),
        'hours' => vmk_timber_mod('vmk_contact_hours', 'Ma nyitva: 09:00 - 19:00'),
        'catalog_url' => vmk_timber_mod('vmk_contact_catalog_url', '#kereses'),
        'socials' => [
            ['label' => 'Web', 'url' => '#'],
            ['label' => 'f', 'url' => '#'],
            ['label' => 'X', 'url' => '#'],
        ],
        'copyright' => sprintf(
            '© %s Vorosmarty Mihaly Konyvtar. Minden jog fenntartva.',
            gmdate('Y')
        ),
    ];
}

function vmk_timber_get_tagkonyvtar_fallback(): array
{
    return [
        [
            'title' => 'Központi Könyvtár',
            'address' => '8000 Székesfehérvár, Bartók Béla tér 1.',
            'phone' => '+36 22 312 684',
            'email' => 'kozponti@vmk.hu',
            'hours' => [
                'Hétfő' => '09:00 - 19:00',
                'Kedd' => '09:00 - 19:00',
                'Szerda' => '09:00 - 19:00',
                'Csütörtök' => '09:00 - 19:00',
                'Péntek' => '09:00 - 19:00',
                'Szombat' => '09:00 - 16:00',
                'Vasárnap' => 'Zárva',
            ],
            'hours_raw' => 'Mon:09:00-19:00,Tue:09:00-19:00,Wed:09:00-19:00,Thu:09:00-19:00,Fri:09:00-19:00,Sat:09:00-16:00,Sun:closed',
            'map_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2726.6853683070444!2d18.411623912199042!3d47.19237667103233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741fc45f2f53d71%3A0xe53f545a909af610!2zVsO2csO2c21hcnR5IE1paMOhbHkgS8bnl2dMOhcg!5e0!3m2!1shu!2shu!4v1716208000000!5m2!1shu!2shu',
            'url' => '#',
            'services' => ['Kölcsönzés', 'Olvasóterem', 'Wifi', 'Fénymásolás', 'Számítógép használat', 'Helyismereti kutatás'],
        ],
        [
            'title' => 'Budai Úti Tagkönyvtár',
            'address' => '8000 Székesfehérvár, Budai út 44-46.',
            'phone' => '+36 22 329 110',
            'email' => 'budai@vmk.hu',
            'hours' => [
                'Hétfő' => '10:00 - 18:00',
                'Kedd' => '10:00 - 18:00',
                'Szerda' => '10:00 - 18:00',
                'Csütörtök' => '10:00 - 18:00',
                'Péntek' => '10:00 - 18:00',
                'Szombat' => 'Zárva',
                'Vasárnap' => 'Zárva',
            ],
            'hours_raw' => 'Mon:10:00-18:00,Tue:10:00-18:00,Wed:10:00-18:00,Thu:10:00-18:00,Fri:10:00-18:00,Sat:closed,Sun:closed',
            'map_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2726.837861962366!2d18.428511776961448!3d47.18938167915998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741fc3658fbb2a7%3A0xe0a174c360a77519!2zVsO2csO2c21hcnR5IE1paMOhbHkgS8bnl2dMOhciBCdWRhaSDDunRpIFRhZ2vDtm55dnRhcg!5e0!3m2!1shu!2shu!4v1716208100000!5m2!1shu!2shu',
            'url' => '#',
            'services' => ['Kölcsönzés', 'Wifi', 'Fénymásolás', 'Gyereksarok'],
        ],
        [
            'title' => 'Széna Téri Tagkönyvtár',
            'address' => '8000 Székesfehérvár, Széna tér 16.',
            'phone' => '+36 22 312 905',
            'email' => 'szena@vmk.hu',
            'hours' => [
                'Hétfő' => '10:00 - 18:00',
                'Kedd' => '10:00 - 18:00',
                'Szerda' => '10:00 - 18:00',
                'Csütörtök' => '10:00 - 18:00',
                'Péntek' => '10:00 - 18:00',
                'Szombat' => '09:00 - 13:00',
                'Vasárnap' => 'Zárva',
            ],
            'hours_raw' => 'Mon:10:00-18:00,Tue:10:00-18:00,Wed:10:00-18:00,Thu:10:00-18:00,Fri:10:00-18:00,Sat:09:00-13:00,Sun:closed',
            'map_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2726.6853683070444!2d18.411623912199042!3d47.19237667103233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741fc45f2f53d71%3A0xe53f545a909af610!2zVsO2csO2c21hcnR5IE1paMOhbHkgS8bnl2dMOhcg!5e0!3m2!1shu!2shu!4v1716208000000!5m2!1shu!2shu',
            'url' => '#',
            'services' => ['Kölcsönzés', 'Wifi', 'Fénymásolás', 'Helyismeret', 'Rendezvények'],
        ],
    ];
}

function vmk_timber_get_program_fallback(): array
{
    return [
        [
            'title' => 'Tavaszi Könyvszalon és Író-Olvasó Találkozó',
            'excerpt' => 'Találkozzon kedvenc kortárs magyar íróival a Központi Könyvtár felújított előadótermében.',
            'date' => '2026-05-24',
            'time' => '17:00',
            'location' => 'Központi Könyvtár',
            'price' => 'Ingyenes',
            'url' => '#',
        ],
        [
            'title' => 'Ringató - Zenei nevelés kisgyermekeknek',
            'excerpt' => 'Közös éneklés, játék és zenei élmények a legkisebbeknek és szüleiknek a Budai Úti Tagkönyvtárban.',
            'date' => '2026-05-28',
            'time' => '10:00',
            'location' => 'Budai Úti Tagkönyvtár',
            'price' => 'Ingyenes',
            'url' => '#',
        ],
        [
            'title' => 'Helytörténeti Előadássorozat: Székesfehérvár a török korban',
            'excerpt' => 'Ismerje meg a város történetét levéltári források, korabeli térképek és rajzok segítségével.',
            'date' => '2026-06-03',
            'time' => '18:00',
            'location' => 'Központi Könyvtár - Olvasóterem',
            'price' => 'Ingyenes',
            'url' => '#',
        ],
    ];
}

function vmk_timber_get_adatbazis_fallback(): array
{
    return [
        [
            'title' => 'Arcanum Digitális Tudománytár (ADT)',
            'excerpt' => 'A legjelentősebb magyar nyelvű folyóiratok, napilapok, enciklopédiák és könyvek teljes szövegű adatbázisa.',
            'access_type' => 'Csak a könyvtárból',
            'access_class' => 'library-only',
            'url' => 'https://adt.arcanum.com/hu/',
            'tags' => ['Sajtó', 'Történelem', 'Helyismeret'],
        ],
        [
            'title' => 'Szaktárs Adatbázisportál',
            'excerpt' => 'Magyar tudományos és szakkönyvkiadók (Akadémiai, Gondolat, L\'Harmattan, Osiris) műveinek gyűjtőportálja.',
            'access_type' => 'Otthonról is elérhető',
            'access_class' => 'remote',
            'url' => 'https://www.szaktars.hu/',
            'tags' => ['Tudomány', 'E-könyv', 'Kutatás'],
        ],
        [
            'title' => 'L\'Harmattan Digitális Adatbázis',
            'excerpt' => 'Több mint 1500 humán- és társadalomtudományi szakmunka érhető el teljes szöveggel az online adatbázisban.',
            'access_type' => 'Otthonról is elérhető',
            'access_class' => 'remote',
            'url' => 'https://szaktars.hu/lharmattan/',
            'tags' => ['Társadalomtudomány', 'E-könyv'],
        ],
        [
            'title' => 'EISZ Nemzeti Adatbázisok',
            'excerpt' => 'Elektronikus Információszolgáltatás Nemzeti Program keretében elérhető nemzetközi tudományos adatbázisok (SpringerLink, ScienceDirect).',
            'access_type' => 'Csak a könyvtárból',
            'access_class' => 'library-only',
            'url' => 'https://eisz.mtak.hu/',
            'tags' => ['Nemzetközi', 'Tudomány', 'Folyóiratok'],
        ],
    ];
}

