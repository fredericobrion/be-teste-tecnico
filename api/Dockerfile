FROM node:20.6.0-alpine

WORKDIR /app

COPY package.json .

COPY .env .

RUN npm install

COPY . .

CMD ["node", "ace", "serve", "--watch"]