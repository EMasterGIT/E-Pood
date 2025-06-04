# 🛒 Rimi E-pood – Täislahendus

See projekt on täislahenduslik e-pood, mis võimaldab kasutajatel registreeruda, sisse logida, sirvida tooteid, lisada neid ostukorvi, teha tellimusi ning administraatoritel hallata kogu süsteemi. Süsteem on loodud **Node.js + Express + PostgreSQL (Sequelize ORM)** backendiga ja **React + Bootstrap** frontendiga.

## 📦 Funktsionaalsus

### 👤 Autentimine ja rollid
- Kasutaja saab registreeruda ja sisse logida
- JWT-põhine autentimine
- Kasutaja rollid: `admin`, `user`
- Kasutaja saab ainult oma tellimusi vaadata, admin saab tellimusi näha ja hallata

### 🛍️ Pood (Tooted)
- Kõik kasutajad saavad tooteid vaadata ja filtreerida
- Administraator saab tooteid lisada, muuta ja kustutada

### 🛒 Ostukorv
- Kasutaja saab tooteid ostukorvi lisada, koguseid muuta ja eemaldada
- Ostukorvi sisu salvestatakse serveris
- Kasutaja saab teha tellimuse otse ostukorvist

### 📦 Tellimused
- Kasutaja saab oma tellimusi vaadata
- Tellimuse määratakse teenindaja ja kuller automaatselt
- Admin saab muuta tellimuse olekut (nt "Ootel", "Töös", "Välja saadetud" jne)

### 📁 Swagger API dokumentatsioon
- Saadaval aadressil: `http://localhost:3001/api/docs`

---

## ⚙️ Tehnoloogia

### Backend
- Node.js + Express
- PostgreSQL andmebaas (Sequelize ORM)
- JWT autentimine
- Swagger dokumentatsioon

### Frontend
- React (Vite)
- React Router
- Bootstrap 5
- Axios HTTP päringuteks

---

## 🚀 Kuidas käivitada projekt?

## Installimine

1. Kloonige projekt oma masinasse:

   ```bash
   git clone https-link https://github.com/EMasterGIT/RimiEpood.git
2. Liikuge projekti kausta:
   ```bash
   cd RimiEpood
3. Installige vajalikud sõltuvused:
   ```bash
   npm install
4. Täitke .env fail, mis sisaldab järgmisi keskkonnamuutujaid:
   ```bash
   DB_HOST=host
   DB_USER=teie-kasutajanimi
   DB_PASSWORD=teie-parool
   DB_NAME=db_rimi
   JWT_SECRET=supersecret
   DIALECT=postgres
 
5. Andmebaasi migreerimiseks:
    ```bash
   npx sequelize-cli db:migrate
    
   npx sequelize-cli db:seed:all 

6. Käivitamiseks server:
   ```bash
   npm start

6. Käivitamiseks frontend:
   ```bash
   cd frontend
   npm start

