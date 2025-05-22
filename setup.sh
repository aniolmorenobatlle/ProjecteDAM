#!/bin/bash

set -e  # Atura el script si alguna comanda falla

echo "Starting docker containers..."
docker compose up -d --build

echo "Running database migrations..."
docker compose exec backend npx knex migrate:latest

echo "Seeding data from TMDB API..."
docker compose exec backend node backend/config/inserts-genres.js
docker compose exec backend node backend/config/inserts-movies.js
docker compose exec backend node backend/config/inserts-cast.js
docker compose exec backend node backend/config/inserts-movies-trending.js
docker compose exec backend node backend/config/inserts-streaming.js

echo "Seeding user-related data..."
docker compose exec backend npx knex seed:run --specific=create_seed_users.js
docker compose exec backend npx knex seed:run --specific=create_seed_friends.js
docker compose exec backend npx knex seed:run --specific=create_seed_lists.js
docker compose exec backend npx knex seed:run --specific=create_seed_shared_lists.js
docker compose exec backend npx knex seed:run --specific=create_seed_movie_list.js
docker compose exec backend npx knex seed:run --specific=create_seed_comments.js
docker compose exec backend npx knex seed:run --specific=create_seed_to_watch.js

echo "Setup completed successfully!"
echo "You can now execute the containers with the command:"
echo "docker compose up -d"
