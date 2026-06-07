# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# MODE kan være: production, test, development
ARG MODE=production
ENV MODE=$MODE

# Vite loader .env.$MODE automatisk
RUN npm run build -- --mode $MODE

# --- Production stage ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/build .

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
