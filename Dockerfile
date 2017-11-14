FROM node:boron
WORKDIR /usr/src/app
COPY package.json .
CMD [ "apt-get", "install", "lm-sensors" ]
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]