FROM node:18

# Instal·lem Expo CLI globalment
RUN npm install -g expo-cli

# Instal·lem @expo/ngrok globalment per evitar el mode no interactiu
RUN npm install -g @expo/ngrok

# Treballem dins del directori /app
WORKDIR /app

# Copiem els fitxers de dependències
COPY package.json package-lock.json ./

# Instal·lem les dependències del projecte
RUN npm install --legacy-peer-deps

# Copiem els fitxers del projecte
COPY . .

# Exposem el port per a l'Expo
EXPOSE 19000 19001

# Executem el servidor d'Expo
CMD ["npm", "start", "--lan"]
