# --- Build stage ---
FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# --- Production stage ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
