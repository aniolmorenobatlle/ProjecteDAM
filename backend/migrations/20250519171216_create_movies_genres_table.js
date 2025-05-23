/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('movies_genres', table => {
    table.integer('movie_id').unsigned();
    table.integer('genre_id').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('movie_id').references('id').inTable('movies').onDelete('CASCADE');
    table.foreign('genre_id').references('id').inTable('genres');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('movies_genres');
};
