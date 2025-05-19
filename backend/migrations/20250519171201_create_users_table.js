/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users', table => {
    table.string('email').primary();
    table.string('name').notNullable();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.string('avatar');
    table.binary('avatar_binary');
    table.text('avatar_mime_type');
    table.text('poster');
    table.boolean('is_admin').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('users');
};
