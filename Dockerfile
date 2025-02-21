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
