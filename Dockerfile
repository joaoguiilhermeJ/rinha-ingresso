FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

USER node

EXPOSE 8080

CMD ["node", "src/server.js"]