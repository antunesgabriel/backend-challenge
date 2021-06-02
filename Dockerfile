FROM node:lts As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "start:dev"]
EXPOSE 3000

FROM node:lts As testing

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "test:watch"]
EXPOSE 3000

FROM node:lts as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
EXPOSE 3000
