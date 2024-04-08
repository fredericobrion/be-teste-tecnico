FROM node:20.6.0-alpine

WORKDIR /app

COPY package.json .

COPY .env .

RUN npm install

COPY . .

CMD ["npm", "start" ]