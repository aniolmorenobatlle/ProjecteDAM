/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('comments', table => {
    table.increments('id').primary();
    table.string('user_email').notNullable();
    table.integer('movie_id').unsigned().notNullable();
    table.text('comment');
    table.timestamp('created_at');

    table.foreign('user_email').references('email').inTable('users').onDelete('CASCADE');
    table.foreign('movie_id').references('id_api').inTable('movies').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('comments');
};
