/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('movies_streaming', table => {
    table.integer('movie_id').unsigned();
    table.integer('streaming_id').unsigned();
    table.integer('display_priority');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.primary(['movie_id', 'streaming_id']);

    table.foreign('movie_id').references('id_api').inTable('movies').onDelete('CASCADE');
    table.foreign('streaming_id').references('id_api').inTable('streaming');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('movies_streaming');
};
