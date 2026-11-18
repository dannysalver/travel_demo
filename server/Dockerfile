FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "node migrate.js && node seed.js && node index.js"]
