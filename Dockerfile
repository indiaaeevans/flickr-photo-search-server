FROM node:10-alpine as node

ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

CMD node ./bin/www