/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('shared_lists', table => {
    table.increments('id').primary();
    table.integer('list_id').unsigned();
    table.string('user_email');
    table.string('friend_email');
    table.timestamp('created_at');

    table.foreign('list_id').references('id').inTable('lists').onDelete('CASCADE');
    table.foreign('user_email').references('email').inTable('users').onDelete('CASCADE');
    table.foreign('friend_email').references('email').inTable('users').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('shared_lists');
};
