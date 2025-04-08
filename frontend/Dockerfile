FROM node:18

# Instalar expo
RUN npm install -g expo-cli

# Expo Go
RUN npm install -g @expo/ngrok

# Directori
WORKDIR /app

# Fitxers dependecies
COPY package.json package-lock.json ./

# Installar dependecies
RUN npm install

# Copiar fitxers
COPY . .

# Ports
EXPOSE 19000 19001

# Executar app
CMD ["npm", "start", "--lan"]
