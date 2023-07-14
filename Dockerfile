# build environment
FROM node:12-alpine AS builder

WORKDIR /app
#RUN apk add --no-cache bash
#RUN apt-get update && apt-get install -y zip
RUN apk add --no-cache git
RUN apk add --no-cache zip
RUN npm install -g gulp@4.0.2
RUN npm link gulp --force
COPY ["package*.json", "gulpfile.js", ".jshintrc", "default.conf.template", "30-nginx-iep-startup-script.sh","release-version.txt", "./"]
RUN npm install

COPY ["bower.json", "./"]
RUN npm run bower install --allow-root
COPY /app /app/app

RUN npm run-script update-version --release_version=$(cat release-version.txt) 
RUN npm run build
RUN mkdir -p /app/build
RUN zip -r /app/build/iep-peerexplorer-ui.zip ./dist
#RUN package_file=$(npm pack) && mkdir /build && cp $package_file /build

# production environment
FROM nginx:1.20-alpine
ENV NGINX_PATH=/
ENV NGINX_PORT=80
COPY --from=builder /app/build /build
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/app/env.config.js.template /etc/nginx/templates/env.config.js.template
COPY --from=builder /app/30-nginx-iep-startup-script.sh /docker-entrypoint.d/30-nginx-iep-startup-script.sh
RUN chmod 775 /docker-entrypoint.d/30-nginx-iep-startup-script.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]