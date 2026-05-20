# VMK Timber theme

Ez a mappa egy uj, Timber-kompatibilis WordPress temat tartalmaz, amely az `uj.vmk.hu` fooldali strukturajat es hangulatat veszi alapul.

## Telepites

1. Masold a `vmk-timber` mappat a `wp-content/themes/` ala.
2. Aktivd a Timber plugint.
3. Aktivd a `VMK Timber` temat a WordPress adminban.
4. Allits be egy statikus kezdolapot, ha ezt a layoutot szeretned fooldalnak.

## Mit tartalmaz

- teljes front page layoutot Twig alapon,
- altalanos oldal sablont,
- bejegyzes sablont,
- archivum es bloglista sablont,
- keresesi nezetet,
- 404 oldalt,
- kozos post card es pagination partialokat,
- theme.json alapokat a blokkeditorhoz,
- testreszabhato hero- es kapcsolatblokkokat a Customizerben,
- dinamikusabb fejlec top bart es kepes post kartyakat.

## Fontos fajlok

- `functions.php`: tema bootstrap, asset betoltes, Timber context.
- `inc/theme-data.php`: a kezdeti, fooldali fallback tartalom.
- `inc/customizer.php`: testreszabhato tema-beallitasok.
- `templates/front-page.twig`: a fooldali felulet.
- `templates/archive.twig`: archivum, blog es keresesi nezet.
- `templates/page.twig`: altalanos oldalak.
- `templates/single.twig`: egyedi bejegyzes nezet.
- `assets/css/main.css`: a teljes egyedi stilus.
- `theme.json`: editor beallitasok, szinek, tipografia.

## Kovetkezo lepesek

- A hardcoded tombok atkotese ACF mezokre vagy opcios oldalra.
- A szolgaltatas- es kiemelt blokkok teljes atkotese valos WP tartalmakra.
- A menuk es logok beallitasa a WordPress adminbol.
