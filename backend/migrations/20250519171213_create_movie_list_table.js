/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('movie_list', table => {
    table.increments('id').primary();
    table.integer('list_id').unsigned();
    table.integer('movie_id').unsigned();
    table.timestamp('created_at');

    table.foreign('list_id').references('id').inTable('lists').onDelete('CASCADE');
    table.foreign('movie_id').references('id_api').inTable('movies').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('movie_list');
};
