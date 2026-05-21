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
    $scraped = vmk_timber_scrape_live_content();

    $featured_lead = [
        'category' => 'Tájékoztatás',
        'title' => vmk_timber_mod('vmk_featured_title', 'Központi olvasószolgálat zárvatartása ablakcsere miatt'),
        'text' => vmk_timber_mod('vmk_featured_text', 'A Vörösmarty Mihály Könyvtár Központi olvasószolgálata 2026. május 1. és 31. között homlokzati ablakcsere miatt zárva tart. Megértésüket köszönjük!'),
        'url' => vmk_timber_mod('vmk_featured_url', 'https://www.vmk.hu/20260417_csok_keptar_felujitas'),
        'image' => vmk_timber_mod('vmk_featured_image', 'https://www.vmk.hu/_upload/news_pic/600x600/4_5660.png'),
    ];

    $featured_aside = [
        ['title' => 'Családi OlvasásMánia nyári olvasópályázat', 'category' => 'Pályázat', 'url' => 'https://www.vmk.hu/csaladi-olvasasmania-2026'],
        ['title' => 'Laptapír szolgáltatás – olvass otthonról!', 'category' => 'Szolgáltatás', 'url' => 'https://www.vmk.hu/20260108_laptapir_szolgaltatas'],
        ['title' => 'Ünnepi Könyvhét 2026 június 1-16. között', 'category' => 'Program', 'url' => 'https://www.vmk.hu/unnepi-konyvhet-2026'],
    ];

    $news_items = [
        [
            'date' => '2026.05.23.',
            'title' => 'Pünkösdi nyitvatartás a könyvtárban',
            'text' => '2026. május 23. és 25. között valamennyi részlegünk és tagkönyvtárunk zárva tart. Nyitás: május 26. (kedd).',
            'url' => 'https://www.vmk.hu/punkosdi-nyitvatartas-2026',
            'image' => 'https://www.vmk.hu/_upload/news_pic/600x600/4_5211.png'
        ],
        [
            'date' => '2026.06.01.',
            'title' => 'Családi OlvasásMánia nyári olvasópályázat',
            'text' => 'Családi OlvasásMánia 2026 nyári olvasópályázat: 2026. június 1-től szeptember 12-ig. Eredményhirdetés október 9-én.',
            'url' => 'https://www.vmk.hu/csaladi-olvasasmania-2026',
            'image' => 'https://www.vmk.hu/_upload/news_pic/600x600/4_5530.png'
        ],
        [
            'date' => '2026.01.08.',
            'title' => 'Laptapír szolgáltatás otthonról',
            'text' => 'Olvass újságot, magazinokat könyvtári beiratkozással közvetlenül otthonról! További részletekért kattints.',
            'url' => 'https://www.vmk.hu/20260108_laptapir_szolgaltatas',
            'image' => 'https://www.vmk.hu/_upload/news_pic/600x600/4_5458.png'
        ],
        [
            'date' => '2026.05.05.',
            'title' => 'Polar Könyvek kiállítás',
            'text' => 'Kiállítás a Polar Egyesület könyvsorozatának köteteiből a Széna Téri Tagkönyvtárban május 5. és 30. között.',
            'url' => 'https://www.vmk.hu/202605_szena_ter_polar_konyvek_kiallitas',
            'image' => 'https://www.vmk.hu/_upload/news_pic/600x600/4_5656.png'
        ],
        [
            'date' => '2026.05.04.',
            'title' => 'Szalontai Endre festőművész kiállítása',
            'text' => '\"Húzom az ecsetet, nyomában megjelenik a kép!\" - Szalontai Endre kiállítása az Olvasóteremben május 4-28. között.',
            'url' => 'https://www.vmk.hu/2026-05-04-28-szalontai-endre-festomuvesz-kiallitasa',
            'image' => 'https://www.vmk.hu/_upload/news_pic/600x600/4_5629.png'
        ],
        [
            'date' => '2026.05.21.',
            'title' => 'Drámafoglalkozás felnőtteknek',
            'text' => 'Drámafoglalkozás felnőtteknek Valkó-Máté Anett színművész, foglalkozásvezetővel a Széna Téri Tagkönyvtárban.',
            'url' => 'https://www.vmk.hu/2026-05-21-dramafoglalkozas-felnotteknek',
            'image' => 'https://www.vmk.hu/_upload/news_pic/600x600/4_5510.png'
        ],
        [
            'date' => '2026.05.22.',
            'title' => 'Eperhajó - felszállás a fedélzetre!',
            'text' => 'Kalmusné Idrányi Eszter zenetanítási módszerének bemutatója a Központi Könyvtár Zenei és Okostermi részlegén.',
            'url' => 'https://www.vmk.hu/2026-05-22-eperhajo-felszallas-a-fedelzetre',
            'image' => 'https://www.vmk.hu/_upload/news_pic/600x600/4_5683.png'
        ],
        [
            'date' => '2026.05.27.',
            'title' => 'Kiolvasó, kibeszélő olvasókör tiniknek',
            'text' => 'Tini olvasókör: Suzanne Collins Az éhezők viadala című disztópikus regényének kibeszélése a Központi Könyvtárban.',
            'url' => 'https://www.vmk.hu/20260527_kiolvaso_kibeszelo_tini_olvasokor_disztopia',
            'image' => 'https://www.vmk.hu/_upload/news_pic/600x600/4_5488.png'
        ]
    ];

    if ($scraped !== null) {
        if (!empty($scraped['featured_lead'])) {
            $featured_lead = $scraped['featured_lead'];
        }
        if (!empty($scraped['news_items'])) {
            $news_items = $scraped['news_items'];
            $aside_items = array_slice($news_items, 1, 3);
            if (count($aside_items) > 0) {
                $featured_aside = [];
                foreach ($aside_items as $item) {
                    $featured_aside[] = [
                        'title' => $item['title'],
                        'category' => 'Hír',
                        'url' => $item['url'],
                    ];
                }
            }
        }
    }

    return [
        'hero' => [
            'eyebrow' => vmk_timber_mod('vmk_hero_eyebrow', 'Vörösmarty Mihály Könyvtár'),
            'title' => vmk_timber_mod('vmk_hero_title', 'Közösségi tér, olvasás, programok és helyismeret egy oldalon.'),
            'text' => vmk_timber_mod('vmk_hero_text', 'Egy modern könyvtári kezdőlap Timber alapon, amely kiemeli a keresést, az aktuális szolgáltatásokat, a híreket és a közösségi eseményeket.'),
            'primary_cta' => [
                'label' => vmk_timber_mod('vmk_primary_cta_label', 'Keresés a katalógusban'),
                'url' => vmk_timber_mod('vmk_primary_cta_url', '#kereses'),
            ],
            'secondary_cta' => [
                'label' => vmk_timber_mod('vmk_secondary_cta_label', 'Programok megtekintése'),
                'url' => vmk_timber_mod('vmk_secondary_cta_url', '#programok'),
            ],
            'stats' => [
                ['value' => '75+', 'label' => 'éves helyismereti gyűjtés'],
                ['value' => '1200+', 'label' => 'rendezvény évente'],
                ['value' => '13', 'label' => 'városi és fiók helyszín'],
            ],
            'highlights' => [
                [
                    'title' => 'Könyvtári útmutatók',
                    'text' => 'Beiratkozás, kölcsönzés, hosszabbítás és digitális hozzáférések egy helyen.',
                    'url' => '#szolgaltatasok',
                ],
                [
                    'title' => 'Programnaptár',
                    'text' => 'Gyerekfoglalkozások, irodalmi estek, kiállítások és workshopok.',
                    'url' => '#programok',
                ],
                [
                    'title' => 'Olvasóterek',
                    'text' => 'Csendes tanulónak, közösségi terek és számítógépes munkaállomások.',
                    'url' => '#terek',
                ],
            ],
        ],
        'search' => [
            'label' => 'Keresés',
            'title' => 'Mit keresel ma?',
            'placeholder' => 'Könyvcím, szerző, téma vagy program neve',
            'button' => 'Keresés',
            'meta' => vmk_timber_parse_lines(vmk_timber_mod('vmk_search_meta', "Nyitva ma: 09:00 - 19:00\nBeiratkozás online is elérhető\nWifi és számítógéphasználat a központi könyvtárban")),
        ],
        'services' => [
            'title' => 'Népszerű szolgáltatások',
            'intro' => 'A főoldal gyors belépési pontokat ad a leggyakoribb ügyintézéshez és tájékozódáshoz.',
            'items' => [
                [
                    'title' => 'Kölcsönzés, előjegyzés, hosszabbítás',
                    'text' => 'Olvasói fiók és alapvető könyvtárhasználati teendők gyors eléréssel.',
                    'url' => '#',
                ],
                [
                    'title' => 'Helyismereti gyűjtemény',
                    'text' => 'Várostörténeti dokumentumok, fotók, periodikák és digitalizált anyagok.',
                    'url' => '#',
                ],
                [
                    'title' => 'Nyomtatás és szkennelés',
                    'text' => 'Mindennapi ügyintézéshez és kutatáshoz szükséges eszközök.',
                    'url' => '#',
                ],
                [
                    'title' => 'Segítség kutatáshoz',
                    'text' => 'Tematikus eligazítás, adatbázis-használat és személyes támogatás.',
                    'url' => '#',
                ],
                [
                    'title' => 'Digitális tartalmak',
                    'text' => 'E-könyvek, online források és távoli hozzáféréssel használható gyűjtemények.',
                    'url' => '#',
                ],
                [
                    'title' => 'Terem- és helyfoglalás',
                    'text' => 'Közösségi és tanulóterek elérhetősége, foglalási tájékoztatóval.',
                    'url' => '#',
                ],
            ],
        ],
        'featured' => [
            'title' => 'Kiemelt tartalmak',
            'lead' => $featured_lead,
            'aside' => $featured_aside,
        ],
        'news' => [
            'title' => 'Hírek és események',
            'items' => $news_items,
        ],
        'hours' => [
            'title' => 'Nyitvatartás',
            'items' => vmk_timber_parse_pairs(vmk_timber_mod('vmk_hours_items', "Központi könyvtár|H-P 09:00 - 19:00\nGyermekkönyvtár|H-P 10:00 - 18:00\nOlvasóterem|H-Szo 09:00 - 20:00\nHelyismeret|H-P 09:00 - 17:00")),
        ],
        'resources' => [
            'title' => 'Digitális források',
            'items' => vmk_timber_parse_lines(vmk_timber_mod('vmk_resources_items', "e-könyvek\nhangoskönyvek\nvideós tartalmak\nzenei gyűjtemény\nfolyóiratok")),
        ],
        'spaces' => [
            'title' => 'Terek tanuláshoz és közösségi programokhoz',
            'text' => 'Csendes olvasóhelyek, csoportszobák és rugalmas közösségi terek támogatják az egyéni és közös használatot.',
            'cta' => [
                'label' => 'Helyszínek és termek',
                'url' => '#terek',
            ],
        ],
        'donation' => [
            'title' => 'Támogasd a könyvtárat',
            'text' => 'Közösségi programok, olvasásnépszerűsítő kezdeményezések és helyi kulturális projektek megvalósításához.',
            'cta' => [
                'label' => 'Támogatási lehetőségek',
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
        'address' => vmk_timber_mod('vmk_contact_address', '8000 Székesfehérvár, Bartók Béla tér 1.'),
        'phone' => vmk_timber_mod('vmk_contact_phone', '+36 22 312 684'),
        'email' => vmk_timber_mod('vmk_contact_email', 'info@vmk.hu'),
        'hours' => vmk_timber_mod('vmk_contact_hours', 'Ma nyitva: 09:00 - 19:00'),
        'catalog_url' => vmk_timber_mod('vmk_contact_catalog_url', '#kereses'),
        'socials' => [
            ['label' => 'Web', 'url' => '#'],
            ['label' => 'f', 'url' => '#'],
            ['label' => 'X', 'url' => '#'],
        ],
        'copyright' => sprintf(
            '© %s Vörösmarty Mihály Könyvtár. Minden jog fenntartva.',
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

function vmk_timber_scrape_live_content(): ?array
{
    // Safeguard: Check if DOM extension is installed/enabled on this server
    if (!class_exists('DOMDocument') || !class_exists('DOMXPath')) {
        return null;
    }

    $transient_key = 'vmk_live_homepage_data';
    $cached = get_transient($transient_key);
    if ($cached !== false && is_array($cached)) {
        return $cached;
    }

    $response = wp_remote_get('https://www.vmk.hu/', [
        'timeout' => 5,
        'sslverify' => false,
    ]);

    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        return null;
    }

    $html = wp_remote_retrieve_body($response);
    if (empty($html)) {
        return null;
    }

    $dom = new DOMDocument();
    $use_libxml = function_exists('libxml_use_internal_errors');
    if ($use_libxml) {
        libxml_use_internal_errors(true);
    }
    @$dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
    if ($use_libxml) {
        libxml_clear_errors();
    }

    $xpath = new DOMXPath($dom);

    $slider_img_url = 'https://www.vmk.hu/_upload/images/banner/A városban 6 helyen_20240409_175719_0000.png';
    $slider_imgs = $xpath->query('//section[@id="slider-section"]//div[contains(@class, "carousel-inner")]//img');
    if ($slider_imgs->length > 0) {
        $src = $slider_imgs->item(0)->getAttribute('src');
        if (!empty($src)) {
            $slider_img_url = (strpos($src, 'http') === 0) ? $src : 'https://www.vmk.hu' . $src;
        }
    }

    $news_items = [];
    $boxes = $xpath->query('//section[@id="news"]//a[contains(@class, "box")]');
    foreach ($boxes as $box) {
        $url_attr = $box->getAttribute('href');
        if (empty($url_attr)) {
            continue;
        }
        $url = (strpos($url_attr, 'http') === 0) ? $url_attr : 'https://www.vmk.hu' . $url_attr;

        $img_url = '';
        $img_tags = $xpath->query('.//img', $box);
        if ($img_tags->length > 0) {
            $src = $img_tags->item(0)->getAttribute('src');
            if (strpos($src, 'img_news.png') === false && !empty($src)) {
                $img_url = (strpos($src, 'http') === 0) ? $src : 'https://www.vmk.hu' . $src;
            }
        }
        
        if (empty($img_url)) {
            $div_tags = $xpath->query('.//div[contains(@class, "image")]', $box);
            if ($div_tags->length > 0) {
                $style = $div_tags->item(0)->getAttribute('style');
                if (preg_match('/url\([\'"]?([^\'")]+)[\'"]?\)/', $style, $matches)) {
                    $src = $matches[1];
                    $img_url = (strpos($src, 'http') === 0) ? $src : 'https://www.vmk.hu' . $src;
                }
            }
        }

        $title = '';
        $h2_tags = $xpath->query('.//h2', $box);
        if ($h2_tags->length > 0) {
            $title = trim($h2_tags->item(0)->nodeValue);
        }

        $text = '';
        $content_divs = $xpath->query('.//div[contains(@class, "content")]', $box);
        if ($content_divs->length > 0) {
            $text = trim($content_divs->item(0)->nodeValue);
            $text = preg_replace('/\s+/', ' ', $text);
        }

        $date = '2026.05.21.';
        if (preg_match('/\/(\d{4})(\d{2})(\d{2})_/', $url_attr, $d_matches)) {
            $date = $d_matches[1] . '.' . $d_matches[2] . '.' . $d_matches[3] . '.';
        } elseif (preg_match('/\/(\d{4})-(\d{2})-(\d{2})-/', $url_attr, $d_matches)) {
            $date = $d_matches[1] . '.' . $d_matches[2] . '.' . $d_matches[3] . '.';
        } elseif (preg_match('/\/(\d{4})(\d{2})_/', $url_attr, $d_matches)) {
            $date = $d_matches[1] . '.' . $d_matches[2] . '.';
        }

        $is_main = strpos($box->getAttribute('class'), 'main') !== false;

        $news_items[] = [
            'date' => $date,
            'title' => $title,
            'text' => $text,
            'url' => $url,
            'image' => $img_url,
            'is_main' => $is_main,
        ];
    }

    if (empty($news_items)) {
        return null;
    }

    $featured_lead = null;
    foreach ($news_items as $item) {
        if ($item['is_main']) {
            $featured_lead = [
                'category' => 'Tájékoztatás',
                'title' => $item['title'] === 'Tájékoztatás' ? 'Központi olvasószolgálat zárvatartása ablakcsere miatt' : $item['title'],
                'text' => $item['text'],
                'url' => $item['url'],
                'image' => $item['image'],
            ];
            break;
        }
    }

    if ($featured_lead === null && !empty($news_items)) {
        $featured_lead = [
            'category' => 'Hír',
            'title' => $news_items[0]['title'],
            'text' => $news_items[0]['text'],
            'url' => $news_items[0]['url'],
            'image' => $news_items[0]['image'],
        ];
    }

    $clean_news = [];
    foreach ($news_items as $item) {
        unset($item['is_main']);
        $clean_news[] = $item;
    }

    $scraped_data = [
        'slider_image' => $slider_img_url,
        'featured_lead' => $featured_lead,
        'news_items' => $clean_news,
    ];

    set_transient($transient_key, $scraped_data, HOUR_IN_SECONDS);

    return $scraped_data;
}

