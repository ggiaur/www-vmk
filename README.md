# Vörösmarty Mihály Könyvtár (VMK) - WordPress + Timber Docker Környezet

Ez a Docker konfiguráció egy kész, helyi fejlesztői környezetet biztosít a könyvtár egyedi WordPress témájához (`vmk-timber`).

A csomag tartalmaz:
1. **Webszervert (Apache + PHP 8.x + WordPress)** - futás közben közvetlenül becsatolva a helyi témamappát.
2. **MariaDB 10.11 Adatbázist** - beépített adatperzisztenciával (az adatok nem vesznek el leállításkor).

---

## 🚀 Gyorsindítás

### 1. Előfeltételek
Győződj meg róla, hogy a gépeden fut a [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 2. Környezet elindítása
Nyiss meg egy terminált a projekt gyökérkönyvtárában, és futtasd az alábbi parancsot:

```bash
docker compose up -d
```

Ez a parancs letölti a szükséges képfájlokat, majd elindítja a konténereket a háttérben.

### 3. WordPress Telepítés és Első Belépés
1. Nyisd meg a böngésződben a **[http://localhost:12080](http://localhost:12080)** címet.
2. Válaszd ki a nyelvet (pl. Magyar), majd add meg az oldal nevét és hozz létre egy adminisztrátori fiókot (pl. felhasználónév: `admin`, jelszó: `adminjelszo`).
3. Kattintson a WordPress telepítése gombra, majd lépj be a frissen létrehozott admin fiókkal.

---

## 🔌 Timber Plugin Telepítése (Kötelező lépés!)

Mivel a téma Twig sablonokat használ, működéséhez elengedhetetlen a **Timber** plugin aktiválása:

1. A WordPress adminisztrációs felületén navigálj a **Plugins (Bővítmények) > Add New Plugin (Új hozzáadása)** menüpontra.
2. Keress rá a **Timber** szóra.
3. Keresd meg a **Timber** bővítményt (szerző: *Jared Novack + Upstatement*).
4. Kattints az **Install Now (Telepítés most)** gombra, majd a telepítés végeztével az **Activate (Aktiválás)** gombra.

---

## 🎨 A Téma Aktiválása

1. Navigálj a **Appearance (Megjelenés) > Themes (Témák)** menüpontra.
2. Meg fogod találni a listában a **vmk-timber** témát.
3. Kattints az **Activate (Aktiválás)** gombra.

Kész! Ha most megnyitod a **[http://localhost:12080](http://localhost:12080)** címet, a téma prémium dizájnja fog fogadni az interaktív funkciókkal (kettős kereső, dinamikus nyitvatartás, digitális adatbázis szűrők).

---

## 🛑 Környezet Leállítása és Kezelése

Ha befejezted a fejlesztést, az alábbi parancsokkal kezelheted a konténereket:

* **Leállítás (adatok megőrzésével)**:
  ```bash
  docker compose down
  ```
* **Állapot ellenőrzése**:
  ```bash
  docker compose ps
  ```
* **Naplófájlok (Logok) megtekintése**:
  ```bash
  docker compose logs -f
  ```

---

## 📁 Technikai Részletek ( docker-compose.yml )

Az adatbázis hozzáférések a következők (ha külső SQL klienssel szeretnél csatlakozni a konténerhez):
* **Adatbázis név**: `wordpress`
* **Felhasználónév**: `wordpress`
* **Jelszó**: `wordpresspassword`
* **Root jelszó**: `rootpassword`
