# build environment
FROM node:10 AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y zip
RUN npm install -g gulp@4.0.2
RUN npm link gulp --force
COPY ["package*.json", "gulpfile.js", ".jshintrc", "default.conf.template", "30-nginx-iep-startup-script.sh","release-version.txt", "./"]
RUN npm install

COPY ["bower.json", "./"]
RUN npm run bower install
COPY /app /app/app

RUN npm run-script update-version --release_version=$(cat release-version.txt) 
RUN npm run build
RUN mkdir -p /app/build
RUN zip -r /app/build/iep-peerexplorer-ui.zip ./dist
#RUN package_file=$(npm pack) && mkdir /build && cp $package_file /build

# production environment
FROM nginx:1.18
ENV NGINX_PATH=/
ENV NGINX_PORT=80
COPY --from=builder /app/build /build
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/app/env.config.js.template /etc/nginx/templates/env.config.js.template
COPY --from=builder /app/30-nginx-iep-startup-script.sh /docker-entrypoint.d/30-nginx-iep-startup-script.sh
RUN chmod ugo+x /docker-entrypoint.d/30-nginx-iep-startup-script.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]