# --- Build stage ---
FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


# --- Production stage ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy Vite build output
COPY --from=build /app/dist .

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add optimized static server config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
