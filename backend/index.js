// server.js
const express = require('express');
const { json } = require('express');
const movieRoutes = require('./routes/movieRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();

const PORT = 3000;

app.use(json());

// Registra les rutes
app.use(movieRoutes); // Rutes de pelis
app.use('/api/users', userRoutes); // Ruta per a usuaris

app.listen(PORT, () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});
