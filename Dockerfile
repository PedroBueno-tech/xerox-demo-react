FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm run vuild
COPY . .
EXPOSE 4200
CMD npm run startProd