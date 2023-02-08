FROM node:16.13.2-alpine AS builder
WORKDIR '/app'
COPY . .
ARG configuration
ENV env_config $config
RUN npm install @angular/cli -g
RUN npm install --force && \
  npm run $env_config
FROM nginx:alpine
COPY --from=builder /app/dist/* /usr/share/nginx/html/
#COPY --from=builder /app/src/assets/ssl/* /etc/ssl/
COPY /nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

#FROM node:16.13.2-alpine
#WORKDIR '/app'
#COPY package.json .
#RUN npm install --legacy-peer-deps
#COPY . .
#EXPOSE 4200
#CMD ["npm", "start"]
