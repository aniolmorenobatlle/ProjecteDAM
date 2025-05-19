/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('genres', table => {
    table.increments('id').primary();
    table.string('name');
    table.timestamp('created_at');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('genres');
};
