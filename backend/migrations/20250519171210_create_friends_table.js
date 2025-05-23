/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('friends', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('friend_id').notNullable();
    table.boolean('is_friend').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('friend_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('friends');
};
