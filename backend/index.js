const express = require('express');
const { json } = require('express');
const movieRoutes = require('./routes/movieRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const listRoutes = require('./routes/listRoutes.js');

const app = express();

const PORT = 3000;

app.use(json());

// Registra les rutes
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});
