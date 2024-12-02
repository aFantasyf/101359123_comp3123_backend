FROM node:18
WORKDIR /src
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
CMD ["node", "src/index.js"]