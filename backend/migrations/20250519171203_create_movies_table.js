/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('movies', table => {
    table.increments('id').primary();
    table.string('title');
    table.date('release_year');
    table.string('poster');
    table.string('cover');
    table.text('synopsis');
    table.decimal('vote_average', 3, 1);
    table.boolean('is_trending').defaultTo(false);
    table.integer('director_id').unsigned().references('id').inTable('directors');
    table.integer('id_api').unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('movies');
};
