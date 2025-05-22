/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('lists').del();
  await knex('lists').insert([
    {
      user_id: 1,
      name: 'Pelis del 2023',
    },
    {
      user_id: 1,
      name: 'Star Wars',
    },
    {
      user_id: 1,
      name: 'Marvel',
    },
    {
      user_id: 2,
      name: 'Terror',
    },
    {
      user_id: 2,
      name: 'Comèdia',
    },
    {
      user_id: 2,
      name: 'Animació',
    },
    {
      user_id: 3,
      name: 'Romàntiques',
    },
    {
      user_id: 3,
      name: 'Ciència-ficció',
    },
    {
      user_id: 3,
      name: 'Aventura',
    },
    {
      user_id: 4,
      name: 'Clàssiques',
    },
    {
      user_id: 4,
      name: 'Estrangeres',
    },
    {
      user_id: 4,
      name: 'Drama',
    }
  ]);
};
