FROM node:12-alpine3.10

WORKDIR /run/app

RUN npm config set registry http://registry.npm.taobao.org/

COPY . /run/app/

RUN apk add --no-cache make gcc g++ python && \
  npm install && npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python

RUN npm run build

ENV NODE_ENV production

CMD [ "node", "dist/main.js" ]
