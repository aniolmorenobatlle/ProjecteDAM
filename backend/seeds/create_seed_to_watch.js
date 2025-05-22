/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('to_watch').del();
  await knex('to_watch').insert([
    {
      user_id: 1,
      movie_id: 278,
      likes: true,
      watched: true,
      watchlist: false,
      favorite: true,
      rating: 5,
      created_at: new Date(),
    },
    {
      user_id: 1,
      movie_id: 11,
      likes: true,
      watched: true,
      watchlist: false,
      favorite: true,
      rating: 4,
      created_at: new Date(),
    },
    {
      user_id: 1,
      movie_id: 155,
      likes: false,
      watched: false,
      watchlist: true,
      favorite: false,
      created_at: new Date(),
    },
    {
      user_id: 2,
      movie_id: 278,
      likes: false,
      watched: false,
      watchlist: true,
      favorite: false,
      created_at: new Date(),
    },
    {
      user_id: 2,
      movie_id: 11,
      likes: true,
      watched: true,
      watchlist: false,
      favorite: true,
      rating: 5,
      created_at: new Date(),
    },
    {
      user_id: 2,
      movie_id: 155,
      likes: true,
      watched: true,
      watchlist: false,
      favorite: true,
      rating: 4,
      created_at: new Date(),
    }
  ]);
};
