/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('movies_actors', table => {
    table.integer('movie_id').unsigned();
    table.integer('actor_id').unsigned();
    table.integer('order');
    table.timestamp('created_at');
    table.primary(['movie_id', 'actor_id']);

    table.foreign('movie_id').references('id_api').inTable('movies').onDelete('CASCADE');
    table.foreign('actor_id').references('id').inTable('actors');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('movies_actors');
};
