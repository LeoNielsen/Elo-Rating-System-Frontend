# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve med Nginx
FROM nginx:alpine
COPY .docker/nginx.conf /etc/nginx/nginx.conf
# Copy SSL certificates
COPY ./certs/server.crt /etc/ssl/certs/server.crt
COPY ./certs/server.key /etc/ssl/private/server.key
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

