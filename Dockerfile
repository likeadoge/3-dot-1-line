FROM node:latest
COPY . /app/
WORKDIR /app
RUN yarn install && yarn build 
EXPOSE 3000
CMD ["npm","run","serve"]