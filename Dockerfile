FROM node:20.16.0
 
WORKDIR /app
 
COPY package.json .
 
RUN yarn install
 
COPY . .
 
RUN yarn build
 
EXPOSE 4200
 
CMD [ "yarn", "dev" ]