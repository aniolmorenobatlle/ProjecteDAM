/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('comments', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('movie_id').unsigned().notNullable();
    table.text('comment');
    table.timestamp('created_at');

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('movie_id').references('id_api').inTable('movies').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('comments');
};
