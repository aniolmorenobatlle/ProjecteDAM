/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('to_watch', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('movie_id').unsigned().notNullable();
    table.boolean('likes');
    table.boolean('watched');
    table.boolean('watchlist');
    table.boolean('favorite').defaultTo(false);
    table.decimal('rating', 2, 1);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('movie_id').references('id_api').inTable('movies').onDelete('CASCADE');
    table.unique(['user_id', 'movie_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('to_watch');
};
