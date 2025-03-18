FROM node:18

# Instal·lar psql
RUN apt-get update && apt-get install -y postgresql-client

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container first to install dependencies
COPY ./backend/package.json ./backend/package-lock.json /app/

# Install application dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the container
COPY ./backend /app/

# Expose port 3000 for the backend
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
