FROM node:18

# Estableix el directori de treball al contenidor
WORKDIR /app

# Copia els fitxers de dependències al directori de treball
COPY ./backend/package.json ./backend/package-lock.json /app/

# Instal·la les dependències
RUN npm install

# Copia tot el codi de l'aplicació al contenidor
COPY ./backend /app/

# Exposa el port 3000
EXPOSE 3000

# Inicia l'aplicació
CMD ["npm", "start"]
