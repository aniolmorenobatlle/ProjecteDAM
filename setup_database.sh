#!/bin/bash

# Step 1: Copy the tables.sql file into the PostgreSQL container
echo "Copying tables.sql into PostgreSQL container..."
docker cp database/tables.sql postgres_container:/tables.sql

# Step 2: Execute bash shell in the PostgreSQL container
echo "Entering PostgreSQL container..."
docker exec -it postgres_container bash -c "
  echo 'Running tables.sql to setup the database...'
  psql -U aniol -d movies -f /tables.sql
  exit
"

# Step 3: Insert genres, movies, and cast via backend scripts
echo "Running backend insert scripts..."

docker compose exec backend node backend/config/inserts-genres.js
docker compose exec backend node backend/config/inserts-movies.js
docker compose exec backend node backend/config/inserts-cast.js

echo "Setup completed!"
