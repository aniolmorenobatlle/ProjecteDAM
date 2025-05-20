#!/bin/bash

echo "Running backend insert scripts..."

docker compose exec backend node backend/config/inserts-genres.js
docker compose exec backend node backend/config/inserts-movies.js
docker compose exec backend node backend/config/inserts-cast.js
docker compose exec backend node backend/config/inserts-movies-trending.js

echo "Setup completed!"
