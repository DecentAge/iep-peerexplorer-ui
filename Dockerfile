# build environment
FROM node:10 AS builder
# ENV NODE_ENV=production
WORKDIR /app
# workaround until the libary get get executed locally

RUN npm install -g bower@1.8.8
RUN npm install -g gulp@3.9.1
RUN npm link gulp --force
COPY ["package*.json", "gulpfile.js", ".jshintrc", "nginx.conf", "bower.json", "./"]
RUN npm install

COPY /app /app/app 
RUN npm run build

# production environment
FROM nginx:1.18
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]