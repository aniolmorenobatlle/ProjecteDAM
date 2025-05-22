/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('to_watch').del();
  await knex('to_watch').insert([
    {
      user_id: 1,
      movie_id: 133,
      likes: true,
      watched: true,
      watchlist: false,
      favorite: true,
      rating: 5
    },
    {
      user_id: 1,
      movie_id: 159,
      likes: true,
      watched: true,
      watchlist: false,
      favorite: true,
      rating: 4
    },
    {
      user_id: 1,
      movie_id: 139,
      likes: false,
      watched: false,
      watchlist: true,
      favorite: false,
    },
    {
      user_id: 2,
      movie_id: 133,
      likes: false,
      watched: false,
      watchlist: true,
      favorite: false,
    },
    {
      user_id: 2,
      movie_id: 159,
      likes: true,
      watched: true,
      watchlist: false,
      favorite: true,
      rating: 5
    },
    {
      user_id: 2,
      movie_id: 139,
      likes: true,
      watched: true,
      watchlist: false,
      favorite: true,
      rating: 4,
    }
  ]);
};
