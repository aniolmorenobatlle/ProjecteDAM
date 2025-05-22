const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  const hashedPassword = await bcrypt.hash('Aniol1234.', 10);

  await knex('users').del();
  await knex('users').insert([
    {
      email: 'aniolmoreno@gmail.com',
      name: 'Aniol Moreno',
      username: 'amoreno',
      password: hashedPassword,
      avatar: 'https://ui-avatars.com/api/?length=1&name=Aniol&size=128&bold=true&background=ffccbc',
      poster: 'https://res.cloudinary.com/dwe0on2fw/image/upload/recommendme-cover/toyStory.jpg',
      is_admin: true
    },
    {
      email: 'joan.passarius@gmail.com',
      name: 'Joan Passarrius',
      username: 'joanpassarius',
      password: hashedPassword,
      avatar: 'https://ui-avatars.com/api/?length=1&name=Joan&size=128&bold=true&background=954df6',
      poster: 'https://res.cloudinary.com/dwe0on2fw/image/upload/recommendme-cover/lotr.jpg',
    },
    {
      email: 'joan.estrada@gmail.com',
      name: 'Joan Estrada',
      username: 'joanestrada',
      password: hashedPassword,
      avatar: 'https://ui-avatars.com/api/?length=1&name=Joan&size=128&bold=true&background=fce4ec',
      poster: 'https://res.cloudinary.com/dwe0on2fw/image/upload/recommendme-cover/theBatman.jpg',
    },
    {
      email: 'laia.marti@gmail.com',
      name: 'Laia Martí',
      username: 'laiamarti',
      password: hashedPassword,
      avatar: 'https://ui-avatars.com/api/?length=1&name=Laia&size=128&bold=true&background=fce4ec',
      poster: 'https://res.cloudinary.com/dwe0on2fw/image/upload/recommendme-cover/topGun.jpg',
    },
  ]);
};
