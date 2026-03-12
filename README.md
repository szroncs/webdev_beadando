# WebDev II.

A Webfejlesztés 1 féléves beadandóm alapján készítettem, ezért csak az új részekre koncentráltam, mert a többi része (struktúra, a CSS, az alapvető HTML-oldalak) már megvolt, és nem akartam újra feltalálni a melegvizet. 

### 1. MVC minta
A `server.js` a Model-View-Controller (MVC) mintát követi (ez alapján: https://www.youtube.com/watch?v=Cgvopu9zg8Y):
*   **Controllers:** A `src/controllers/apiController.js` kezeli az API logikát.
*   **Routes:** A `src/routes/apiRoutes.js` és a `server.js` kezeli a routingot.
*   **Services:** `src/services/dataService.js` kezeli a JSON fájlok olvasását/írását.

### 2. Contact form
Kiegészítettem a űrlapot. Amikor elküldjük, az adatok a `data/contact_submissions.json` fájlba kerülnek kiírásra. 

### 3. Planner
A szerkeszthető adattábla követelményének teljesítése érdekében létrehoztam a tervezőt. Kicsit erőltetett egy webdev agency esetében, de nem akartam újra írni az egész oldalt.

### 4. Adminisztrációs oldal
Létrehoztam egy semennyire sem biztonságos (sem auth, sem token) adminisztrációs panelt a `/secureadminpage` címen. Csak azért biztonságs mert sehonnan nem mutat rá hivatkozás, tehát be kell írni az URL-t.

Self note:
```bash
npm install
node server.js
```
