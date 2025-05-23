# Projecte Final DAM

Aquest projecte és el projecte final del cicle formatiu de Desenvolupament d'Aplicacions Multiplataforma (DAM).

Conté dues parts principals:

- **App d'escriptori**: Desenvolupada amb **React**, **Vite**, **Electron** i estilitzada amb **Tailwind CSS**.
- **App mòbil**: Frontend fet amb **React Native** amb **Expo**.
- **Backend**: Desenvolupat amb **Node.js** i **Express**, utilitzant **Knex.js** per a la gestió de migracions i seeders.
- **Base de dades**: PostgreSQL.

---

## Estructura del projecte

- `/desktop`: Codi font de l'aplicació d'escriptori (React + Vite + Electron + Tailwind).
- `/frontend`: Codi font de l'aplicació mòbil (React Native amb Expo).
- `/backend`: Backend amb Node.js, Express i Knex.

---

## Tecnologies utilitzades

- **React**: Llibreria per a la creació de la UI a l'escriptori.
- **Vite**: Bundler i dev server per al projecte d'escriptori.
- **Electron**: Per empaquetar l'app d'escriptori i accedir a funcions natives.
- **Tailwind CSS**: Framework CSS utilitzat per estilitzar l'app d'escriptori.
- **React Native**: Framework per al desenvolupament de l'aplicació mòbil.
- **Node.js + Express**: Backend API REST.
- **Knex.js**: ORM per gestionar migracions i dades a la base de dades.
- **PostgreSQL**: Base de dades relacional.

---

## Instal·lació i execució

### Backend

1. Instalar dependències:

```
cd backend
npm install
```

2. Configurar la connexió a la base de dades en el fitxer `.env`.

```
cp .env.example .env
```

3. Executar arxiu de configuració de la base de dades:

```
setup_database.sh
```

4. Iniciar contenidor:

```
docker compose up
```

### App d'escriptori

1. Instal·lar dependències i executar:

```
cd desktop
npm install
npm run dev
```

### App mòbil

1. Instal·lar dependències i executar:

```
cd frontend
npm install
npx expo start
```

---

## Característiques principals

- Interfície d'escriptori amb React + Electron que interactua amb el backend.
- Aplicació mòbil amb React Native que consumeix les APIs del backend.
- Gestió centralitzada de dades amb PostgreSQL.
- Migracions i seeders per controlar l'estructura i dades inicials de la base de dades.
- Estilització moderna amb Tailwind CSS a l'app d'escriptori.

---

## Contacte

Per qualsevol dubte o consulta, podeu contactar amb mi a:

- Correu: [aniolmoreno@gmail.com](mailto:aniolmoreno@gmail.com)
- GitHub: [github.com/aniolmorenobatlle](https://github.com/aniolmorenobatlle)
- Web: [aniolmorenobatlle.com](https://aniolmorenobatlle.com)
