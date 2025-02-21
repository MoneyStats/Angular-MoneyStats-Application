# Costruzione dell'app Angular
FROM node:22-alpine AS builder
WORKDIR '/app'

# Copia i file
COPY . .
ARG config

# Rendi eseguibile lo script se necessario
RUN chmod +x rename.sh

# Usa lo script di rinomina solo se serve
RUN ./rename.sh $config

# Installa dipendenze e builda il progetto
RUN npm install @angular/cli -g
RUN npm install --force && \
  npm run $config

# Usa nginx come server
FROM nginx:alpine
COPY --from=builder /app/dist/* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Avvia il server
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

#FROM node:19.2.0-alpine AS builder
#WORKDIR '/app'
#COPY . .
#ARG config
#
## Usa lo script per rinominare il file solo se la configurazione è impostata su "stg"
#RUN ./rename.sh $config
#
#RUN npm install @angular/cli -g
#RUN npm install --force && \
#  npm run $config
#
#FROM nginx:alpine
#COPY --from=builder /app/dist/* /usr/share/nginx/html/
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

#FROM node:19.2.0-alpine AS builder
#WORKDIR '/app'
#COPY . .
#ARG config
#RUN npm install @angular/cli -g
#RUN npm install --force && \
#  npm run $config
#FROM nginx:alpine
#COPY --from=builder /app/dist/* /usr/share/nginx/html/
##COPY --from=builder /app/src/assets/ssl/* /etc/ssl/
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

#FROM node:16.13.2-alpine
#WORKDIR '/app'
#COPY package.json .
#RUN npm install --legacy-peer-deps
#COPY . .
#EXPOSE 4200
#CMD ["npm", "start"]
