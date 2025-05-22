/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('comments').del();
  await knex('comments').insert([
    {
      user_id: 1,
      movie_id: 133,
      comment: 'Una de les millors pel·lícules de la historia',
    },
    {
      user_id: 2,
      movie_id: 133,
      comment: 'No m\'ha agradat gens',
    },
    {
      user_id: 3,
      movie_id: 133,
      comment: 'Molt bona, la recomano',
    },
    {
      user_id: 4,
      movie_id: 133,
      comment: 'No la recomano',
    },
    {
      user_id: 1,
      movie_id: 159,
      comment: 'Una de les millors pel·lícules de la saga',
    },
    {
      user_id: 2,
      movie_id: 159,
      comment: 'No m\'ha agradat gens',
    },
    {
      user_id: 3,
      movie_id: 159,
      comment: 'Molt bona, la recomano',
    },
    {
      user_id: 4,
      movie_id: 159,
      comment: 'No la recomano',
    },
    {
      user_id: 1,
      movie_id: 139,
      comment: 'Una de les millors pel·lícules de la saga',
    },
    {
      user_id: 2,
      movie_id: 139,
      comment: 'No m\'ha agradat gens',
    },
    {
      user_id: 3,
      movie_id: 139,
      comment: 'Molt bona, la recomano',
    },
    {
      user_id: 4,
      movie_id: 139,
      comment: 'No la recomano',
    },
  ]);
};
