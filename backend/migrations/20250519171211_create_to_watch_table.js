/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('to_watch', table => {
    table.increments('id').primary();
    table.string('user_email').notNullable();
    table.integer('movie_id').unsigned().notNullable();
    table.boolean('likes');
    table.boolean('watched');
    table.boolean('watchlist');
    table.boolean('favorite').defaultTo(false);
    table.decimal('rating', 2, 1);
    table.timestamp('created_at');

    table.foreign('user_email').references('email').inTable('users').onDelete('CASCADE');
    table.foreign('movie_id').references('id_api').inTable('movies').onDelete('CASCADE');
    table.unique(['user_email', 'movie_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('to_watch');
};
