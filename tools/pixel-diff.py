#!/usr/bin/env python3
"""Teljes oldalas képpont-diff a valós vmk.hu és a helyi klón között.

Nem kézzel kiválasztott tulajdonságokat néz, hanem MINDEN képpontot
összehasonlít, és megmutatja, hol térnek el. Kimenet: hőtérkép,
egymás-melletti kép, és sávonkénti (100px) eltérés-statisztika.
"""
import sys
from PIL import Image, ImageChops, ImageDraw

# Egy képpontot akkor tekintünk eltérőnek, ha az RGB-távolság ennél nagyobb.
#
# 0 = NINCS TOLERANCIA. Ez szándékos.
#
# Korábban itt 30 állt, azzal az indoklással, hogy "a böngészők közti
# anti-aliasing eltérés nem hiba". Ez az indoklás HAMIS VOLT: a
# pixel-diff.mjs UGYANAZT az egyetlen Chromium-példányt, ugyanazt az
# operációs rendszert és ugyanazt a viewportot használja MINDKÉT
# oldalhoz (real.png és local.png). Azonos renderelő motornál nincs
# legitim böngészők-közti anti-aliasing különbség - ha a szöveg
# másképp renderelődik, annak VALÓS oka van (más betűtípus, méret,
# vastagság, szín vagy szubpixel-pozíció), tehát VALÓDI eltérés.
#
# Mérve, mennyit rejtett el a régi küszöb ugyanazon a felvételpáron:
#   küszöb  0 -> 67.3% eltérő képpont  (a valóság)
#   küszöb 30 -> 50.8% eltérő képpont  (amit jelentettem)
# = 16.5 százalékpontnyi valódi eltérés eltüntetve egy önigazoló
# számmal. A küszöböt csak akkor szabad 0 fölé emelni, ha az adott
# értékhez MÉRT bizonyíték tartozik, nem feltételezés.
PIXEL_THRESHOLD = 0
BAND_HEIGHT = 100


def load(path):
    return Image.open(path).convert('RGB')


def main():
    real_path, local_path, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    real = load(real_path)
    local = load(local_path)

    w = min(real.width, local.width)
    h = min(real.height, local.height)

    real_c = real.crop((0, 0, w, h))
    local_c = local.crop((0, 0, w, h))

    # Képpontonkénti abszolút különbség -> szürkeárnyalatos intenzitás
    diff = ImageChops.difference(real_c, local_c).convert('L')
    diff_data = diff.load()

    # Hőtérkép: piros ott, ahol eltérés van; a valós oldal halvány
    # szürkeárnyalatos képe alatta, hogy lásd MI van azon a helyen.
    base = real_c.convert('L').convert('RGB')
    base = Image.blend(base, Image.new('RGB', (w, h), (255, 255, 255)), 0.6)
    heat = base.copy()
    heat_px = heat.load()

    total_diff = 0
    band_stats = []
    band_count = (h + BAND_HEIGHT - 1) // BAND_HEIGHT
    band_diff = [0] * band_count

    for y in range(h):
        band = y // BAND_HEIGHT
        for x in range(w):
            d = diff_data[x, y]
            if d > PIXEL_THRESHOLD:
                total_diff += 1
                band_diff[band] += 1
                heat_px[x, y] = (255, 40, 40)

    total_px = w * h
    pct = total_diff / total_px * 100

    heat.save(f'{out_dir}/diff-heatmap.png')

    # Egymás mellett: valós | helyi | hőtérkép
    sbs = Image.new('RGB', (w * 3 + 40, h), (255, 255, 255))
    sbs.paste(real_c, (0, 0))
    sbs.paste(local_c, (w + 20, 0))
    sbs.paste(heat, (w * 2 + 40, 0))
    d = ImageDraw.Draw(sbs)
    d.rectangle([w, 0, w + 20, h], fill=(200, 200, 200))
    d.rectangle([w * 2 + 20, 0, w * 2 + 40, h], fill=(200, 200, 200))
    sbs.save(f'{out_dir}/side-by-side.png')

    print(f'\nÖSSZ ELTÉRÉS: {pct:.1f}%  ({total_diff:,} / {total_px:,} képpont)')
    print(f'Összehasonlított terület: {w}x{h}px')
    if PIXEL_THRESHOLD == 0:
        print('(Küszöb 0 = nincs tolerancia. Ugyanaz a Chromium-példány renderelte')
        print(' mindkét oldalt, ezért MINDEN eltérés valódi eltérés.)\n')
    else:
        print(f'(FIGYELEM: {PIXEL_THRESHOLD}/255 tolerancia aktív - ez elrejt valódi')
        print(' eltéréseket. Csak MÉRT bizonyíték alapján szabad 0 fölé állítani.)\n')

    print('SÁVONKÉNTI BONTÁS (hol a legrosszabb):')
    print(f'{"y-tartomány":>16} | {"eltérés":>8} | grafikon')
    print('-' * 70)
    ranked = sorted(range(band_count), key=lambda b: -band_diff[b])
    worst = set(ranked[:10])
    for b in range(band_count):
        y0 = b * BAND_HEIGHT
        y1 = min((b + 1) * BAND_HEIGHT, h)
        band_px = (y1 - y0) * w
        bpct = band_diff[b] / band_px * 100 if band_px else 0
        bar = '#' * int(bpct / 2)
        mark = '  <-- LEGROSSZABBAK' if b in worst and bpct > 5 else ''
        print(f'{y0:>7}-{y1:<8} | {bpct:>7.1f}% | {bar}{mark}')

    print('\nA 10 legeltérőbb sáv (ide nézz először):')
    for b in ranked[:10]:
        y0 = b * BAND_HEIGHT
        y1 = min((b + 1) * BAND_HEIGHT, h)
        band_px = (y1 - y0) * w
        bpct = band_diff[b] / band_px * 100 if band_px else 0
        if bpct > 1:
            print(f'  y={y0}-{y1}px: {bpct:.1f}% eltérés')


if __name__ == '__main__':
    main()
