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

# --- Runtime stage ---
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
