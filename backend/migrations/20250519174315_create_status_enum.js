/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
        CREATE TYPE status_enum AS ENUM ('pending', 'accepted', 'rejected');
      END IF;
    END
    $$;
  `);
};

exports.down = async function (knex) {
  await knex.raw(`DROP TYPE IF EXISTS status_enum;`);
};

