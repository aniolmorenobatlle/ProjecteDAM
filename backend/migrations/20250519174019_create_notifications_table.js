/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('notifications', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('friend_id').notNullable();
    table.integer('movie_id').unsigned();
    table.boolean('is_friend').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users');
    table.foreign('friend_id').references('id').inTable('users');
    table.foreign('movie_id').references('id').inTable('movies').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('notifications');
};
