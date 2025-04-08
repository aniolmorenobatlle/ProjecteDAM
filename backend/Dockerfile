FROM node:18

# Postgres
RUN apt-get update && apt-get install -y postgresql-client

# Directory
WORKDIR /app

# Dependecies
COPY ./backend/package.json ./backend/package-lock.json /app/

# Instalar dependecies
RUN npm install

# Copiar l'app al contenidor
COPY ./backend /app/

# Port 3000 per back
EXPOSE 3000

# Executar app
CMD ["npm", "start"]
