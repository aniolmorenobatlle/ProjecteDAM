/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('lists', table => {
    table.increments('id').primary();
    table.string('user_email');
    table.string('name');
    table.timestamp('created_at');

    table.foreign('user_email').references('email').inTable('users').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('lists');
};
