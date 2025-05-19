/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('friends', table => {
    table.increments('id').primary();
    table.string('user_email').notNullable();
    table.string('friend_email').notNullable();
    table.boolean('is_friend').defaultTo(false);
    table.timestamp('created_at');

    table.foreign('user_email').references('email').inTable('users').onDelete('CASCADE');
    table.foreign('friend_email').references('email').inTable('users').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('friends');
};
