FROM node:16-alpine3.11 as angular
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build --prod

### STAGE 2:
FROM nginx:alpine
ADD ./config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=angular /app/dist/bibliochat /var/www/app/
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
