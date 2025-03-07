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
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]

