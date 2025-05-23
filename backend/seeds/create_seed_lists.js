/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('lists').del();

  await knex.raw(`ALTER SEQUENCE lists_id_seq RESTART WITH 1`)

  await knex('lists').insert([
    {
      user_id: 1,
      name: 'Pelis del 2023',
      created_at: new Date(),
    },
    {
      user_id: 1,
      name: 'Star Wars',
      created_at: new Date(),
    },
    {
      user_id: 1,
      name: 'Marvel',
      created_at: new Date(),
    },
    {
      user_id: 2,
      name: 'Terror',
      created_at: new Date(),
    },
    {
      user_id: 2,
      name: 'Comèdia',
      created_at: new Date(),
    },
    {
      user_id: 2,
      name: 'Animació',
      created_at: new Date(),
    },
    {
      user_id: 3,
      name: 'Romàntiques',
      created_at: new Date(),
    },
    {
      user_id: 3,
      name: 'Ciència-ficció',
      created_at: new Date(),
    },
    {
      user_id: 3,
      name: 'Aventura',
      created_at: new Date(),
    },
    {
      user_id: 4,
      name: 'Clàssiques',
      created_at: new Date(),
    },
    {
      user_id: 4,
      name: 'Estrangeres',
      created_at: new Date(),
    },
    {
      user_id: 4,
      name: 'Drama',
      created_at: new Date(),
    }
  ]);
};
