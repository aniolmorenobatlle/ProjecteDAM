const express = require('express');
const { json } = require('express');
const cors = require('cors'); // Importar CORS
const movieRoutes = require('./routes/movieRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const listRoutes = require('./routes/listRoutes.js');

const app = express();

const PORT = 3000;

// Configurar CORS abans de les rutes
app.use(cors()); // Això permetrà totes les peticions des de qualsevol origen

app.use(json());

// Registra les rutes
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});
