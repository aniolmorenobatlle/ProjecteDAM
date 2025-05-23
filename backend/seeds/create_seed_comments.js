/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('comments').del();
  await knex('comments').insert([
    {
      user_id: 1,
      movie_id: 278,
      comment: 'Una de les millors pel·lícules de la historia',
      created_at: new Date(),
    },
    {
      user_id: 2,
      movie_id: 278,
      comment: 'No m\'ha agradat gens',
      created_at: new Date(),
    },
    {
      user_id: 3,
      movie_id: 278,
      comment: 'Molt bona, la recomano',
      created_at: new Date(),
    },
    {
      user_id: 4,
      movie_id: 278,
      comment: 'No la recomano',
      created_at: new Date(),
    },
    {
      user_id: 1,
      movie_id: 11,
      comment: 'Una de les millors pel·lícules de la saga',
      created_at: new Date(),
    },
    {
      user_id: 2,
      movie_id: 11,
      comment: 'No m\'ha agradat gens',
      created_at: new Date(),
    },
    {
      user_id: 3,
      movie_id: 11,
      comment: 'Molt bona, la recomano',
      created_at: new Date(),
    },
    {
      user_id: 4,
      movie_id: 11,
      comment: 'No la recomano',
      created_at: new Date(),
    },
    {
      user_id: 1,
      movie_id: 155,
      comment: 'Una de les millors pel·lícules de la saga',
      created_at: new Date(),
    },
    {
      user_id: 2,
      movie_id: 155,
      comment: 'No m\'ha agradat gens',
      created_at: new Date(),
    },
    {
      user_id: 3,
      movie_id: 155,
      comment: 'Molt bona, la recomano',
      created_at: new Date(),
    },
    {
      user_id: 4,
      movie_id: 155,
      comment: 'No la recomano',
      created_at: new Date(),
    },
  ]);
};
