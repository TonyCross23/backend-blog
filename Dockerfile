FROM node:18

ADD package.json /tmp/package.json

ADD pnpm-lock.yaml /tmp/pnpm-lock.yaml

RUN npm install -g pnpm

RUN rm -rf build

RUN cd /tmp && pnpm install

ADD ./ /src

RUN rm -rf src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /src

RUN pnpm build

CMD [ "node", "build/src/app.js" ]
