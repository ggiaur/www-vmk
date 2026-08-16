# GEMINI CLONE PARITY CANARY AUDIT — www-vmk

Branch: `agent/gemini-final-audit`  
Primary implementation branch under audit: `agent/visual-clone-oracle`  
Mode: **CLONE PARITY RECOVERY — independent audit**

## 1. WORKTREE ISOLATION — HARD RULE

**1 agent = 1 branch = 1 worktree.**

Gemini nem használhatja aktív szerkesztésre a shared `/srv/projects/www-vmk` working tree-t, és nem válthatja Claude branchét.

Ajánlott:

```text
/srv/projects/www-vmk-gemini        -> agent/gemini-final-audit  # report/helper work
/srv/projects/www-vmk-gemini-target -> detached origin/agent/visual-clone-oracle  # read/run only
```

A target worktree legyen read-only audit cél: fetcheld a jelenlegi primary HEAD-et, ne módosítsd Claude branchét. Ne kérj felhasználói segítséget worktree/branch kezeléshez.

## 2. CÉL

A korábbi `MISSING=0`, `BROKEN=0`, FIRST-HOP/Depth-2/Full-site `VERIFIED` állítások **nem érvényes clone-parity evidence-ek**.

Feladatod: Claude Oracle implementációjától függetlenül bizonyítsd a jelenlegi referencia (`https://www.vmk.hu`) és a current primary clone közti tényleges eltéréseket.

Kifejezetten keresd azokat a route-okat, amelyeket a régi rendszer `CLONED`/covered állapotúnak nevezett, de valójában hiányosak.

## 3. KÖTELEZŐ MINTA — >=20 ROUTE

- `/`;
- >=5 aktuális news/event detail;
- >=5 static/institutional oldal;
- >=3 branch/department oldal;
- `/gallery` + >=3 konkrét gallery/detail/archive route;
- `/wishbasket`;
- >=1 PDF/document-heavy oldal.

## 4. MINDEN ROUTE-NÁL ELLENŐRIZD

1. **URL** — status/final URL/redirect; detail→generic lista nem parity.
2. **TEXT** — meaningful `main` text sorrendben; missing headings/paragraphs/lists/dates/contacts/location/meta.
3. **MEDIA** — konkrét tartalmi képek/galériaelemek/background images; identitás, broken state; ne csak count.
4. **LINKS/DOCS** — anchor+target+típus: internal/external/mailto/tel/PDF/download; target health.
5. **STRUCTURE** — headings/list/table/form/gallery/card/document blokkok.
6. **FUNCTION** — ahol releváns, tényleges funkcióparitás; HTTP 200 nem PASS.
7. **VISUAL** — desktop 1440 + mobile 390, obvious layout/media/component eltérések.

## 5. OUTPUT

A `docs/GEMINI_FINAL_AUDIT.md` fájlt cseréld le **GEMINI CLONE PARITY CANARY REPORT** riporttal.

Kötelező:

- `RESULT: FINDINGS`, kivéve ha minden vizsgált route valóban minden alkalmazható dimenzióban egyezik;
- route-onként `URL/TEXT/MEDIA/LINKS/STRUCTURE/FUNCTION/VISUAL` státusz;
- konkrét missing image, wrong/broken link/PDF, missing text blokk és visual eltérés;
- false-positive count: a korábban jónak hitt route-ok közül mennyi bukott;
- page-family/root-cause grouping;
- reproducible commands/evidence paths;
- nem futtatott ellenőrzésre nincs PASS állítás.

A primary branchet ne javítsd. Diagnostic helper kód csak a Gemini branchre mehet.

## 6. EXECUTION CADENCE — START NOW

- **AZONNAL kezdd az auditot.**
- Legfeljebb **30 percen belül** pusholj első technikai checkpointot: legalább **5 ténylegesen összehasonlított route** eredményét a reportba vagy reprodukálható helper outputot. Puszta státusz/prose commit nem elég.
- Utána minden kb. **30–45 perc aktív munka** után pusholj új evidence checkpointot, amíg >=20 route kész nincs.
- Ne várj Claude Oracle v2-jére; az auditnak szándékosan függetlennek kell lennie.
- Ha egy technikai blocker miatt egy dimenzió nem mérhető, rögzítsd pontosan és folytasd a többi dimenziót/route-ot.
- Ne kérj a felhasználótól közvetítést.

## 7. BEFEJEZÉS

Amikor >=20 route teljes auditja kész, commit + push. ChatGPT/Claude közvetlenül GitHubról fogyasztja az eredményt.