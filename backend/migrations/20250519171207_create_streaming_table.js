/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('streaming', table => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.string('logo');
    table.integer('id_api').unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('streaming');
};
