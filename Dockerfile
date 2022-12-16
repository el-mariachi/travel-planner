FROM node:14.19.3-alpine

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . .

RUN npm run build:server

RUN npm run build

ENV PORT=3000

EXPOSE ${PORT}

CMD [ "node", "src/server/server.js" ]
