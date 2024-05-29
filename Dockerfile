FROM node:18.17.1 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm set registry https://registry.npmjs.org/
RUN npm install

COPY . .

RUN npm run build
FROM node:18.17.1

WORKDIR /usr/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm install --production

EXPOSE 8001

CMD ["npm", "run", "start:prod"]
