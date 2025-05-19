// backend/db.js (o backend/db/knex.js si vols més organització)
const knex = require('knex');
const knexConfig = require('../knexfile'); // això importa l'objecte de configuració

const db = knex(knexConfig); // aquí és on inicialitzes knex com a funció

module.exports = db;
