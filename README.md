# WebDev II.

A Webfejlesztés 1 féléves beadandóm alapján készítettem. Később a projekt átesett egy refaktoráláson, melynek során a régi statikus HTML oldalakat backend által generált Pug sablonokra cseréltem, ezzel elhagyva a kliensoldali template-töltögetést.

### 1. MVC minta
A projekt a Model-View-Controller (MVC) mintát követi:
*   **Controllers:** A `src/controllers/apiController.js` kezeli az API logikát.
*   **Views:** A `src/views/` tartalmazza a `.pug` sablonokat (layout és partial rendszerekkel), amiket a szerver renderel HTML-é.
*   **Routes:** A `src/routes/apiRoutes.js` és a `server.js` kezeli az oldal rendereléseket és az API routingot.
*   **Services:** A `src/services/dataService.js` kezeli a JSON adatok olvasását/írását.

### 2. Contact form
Kiegészítettem az űrlapot. Amikor elküldjük, az adatok a `data/contact_submissions.json` fájlba kerülnek kiírásra. 

### 3. Planner
A szerkeszthető adattábla követelményének teljesítése érdekében létrehoztam a tervezőt. Kicsit erőltetett egy webdev agency esetében, de nem akartam újra írni az egész oldalt.

### 4. Adminisztrációs oldal
Létrehoztam egy semennyire sem biztonságos (sem auth, sem token) adminisztrációs oldalt a `/secureadminpage` címen. Csak azért biztonságos, mert sehonnan nem mutat rá hivatkozás, tehát be kell írni az URL-t.

> Repo linkje: https://github.com/szroncs/webdev_beadando