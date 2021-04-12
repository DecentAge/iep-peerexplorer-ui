# build environment
FROM node:10 AS builder
WORKDIR /app
RUN npm install -g bower@1.8.8
RUN npm install -g gulp@4.0.2
RUN npm link gulp --force
COPY ["package*.json", "gulpfile.js", ".jshintrc", "default.conf.template", "bower.json", "./"]
RUN npm install

COPY /app /app/app 
RUN npm run build

# production environment
FROM nginx:1.18
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]