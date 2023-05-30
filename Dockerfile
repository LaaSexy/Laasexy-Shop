FROM node:18-alpine

WORKDIR /usr/app

COPY . /usr/app

RUN npm install

RUN npm run build

EXPOSE 3035

CMD ["npm", "start"]
