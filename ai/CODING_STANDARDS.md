# Coding Standards & Guidelines

## 1. Code Quality & Philosophy
* Ne használj felesleges könyvtárakat.
* Kerüld a duplikációt (DRY - Don't Repeat Yourself).
* Minden komponens legyen újrahasználható és tisztán szeparált.
* Kommentelj csak akkor, ha a miértet kell elmagyarázni, ne a nyilvánvaló kódot.

## 2. TypeScript Rules
* Szigorú TypeScript használat (`strict: true`).
* `any` típus szigorúan tilos (`no-explicit-any`). Használj generics-et vagy explicit típusokat/interfészeket.

## 3. Next.js & React Best Practices
* Alapértelmezés szerint **React Server Components (RSC)** használata.
* `use client` direktíva kizárólag ott, ahol interaktivitás (state, effect, event listener) szükséges.
* Szigorú elnevezési konvenciók: PascalCase komponensekhez, camelCase függvényekhez és változókhoz, kebab-case fájlnevekhez.
