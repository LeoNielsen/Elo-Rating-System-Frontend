# Build stage
FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app INCLUDING public/
COPY . .

# Make sure public/ is included (silent-check-sso.html lives here)
COPY public ./public

RUN npm run build


# Serve stage
FROM node:18
WORKDIR /app

RUN npm install -g serve

# Copy build output
COPY --from=build /app/build .

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]
