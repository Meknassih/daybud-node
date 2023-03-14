FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --loglevel error
COPY . .
RUN chmod -R 777 /app
EXPOSE 8000
CMD [ "npm", "start" ]