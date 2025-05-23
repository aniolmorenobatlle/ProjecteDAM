/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('movie_list').del()
  await knex('movie_list').insert([
    {
      list_id: 1,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 1,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 1,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 2,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 2,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 2,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 3,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 3,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 3,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 4,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 4,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 4,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 5,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 5,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 5,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 6,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 6,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 6,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 7,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 7,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 7,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 8,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 8,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 8,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 9,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 9,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 9,
      movie_id: 155,
      created_at: new Date(),
    },
    {
      list_id: 10,
      movie_id: 278,
      created_at: new Date(),
    },
    {
      list_id: 10,
      movie_id: 11,
      created_at: new Date(),
    },
    {
      list_id: 10,
      movie_id: 155,
      created_at: new Date(),
    }
  ]);
};
