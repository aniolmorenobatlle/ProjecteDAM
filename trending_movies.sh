#!/bin/bash

# Ruta als arxius .js dins del contenidor
SCRIPT_PATH="config"

# Executar el script per les pel·lícules trending dins del contenidor
echo "Executant insert-movies-trending.js dins del contenidor..."
docker compose exec backend node "$SCRIPT_PATH/inserts-movies-trending.js"

# Comprovar si la primera execució va ser exitosa
if [ $? -eq 0 ]; then
    echo "insert-movies-trending.js ha estat executat correctament dins del contenidor."
else
    echo "Error en l'execució de insert-movies-trending.js"
    exit 1
fi

# Executar el script per afegir els actors/trending dins del contenidor
echo "Executant inserts-cast-trending.js dins del contenidor..."
docker compose exec backend node "$SCRIPT_PATH/inserts-cast-trending.js"

# Comprovar si la segona execució va ser exitosa
if [ $? -eq 0 ]; then
    echo "inserts-cast-trending.js ha estat executat correctament dins del contenidor."
else
    echo "Error en l'execució de inserts-cast-trending.js"
    exit 1
fi

echo "Tots els scripts s'han executat correctament dins del contenidor."
