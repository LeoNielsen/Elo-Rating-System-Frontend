FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copy everything INCLUDING public/
COPY . .

# Build
RUN npm run build


FROM node:18
WORKDIR /app

RUN npm install -g serve

# Copy build output
COPY --from=build /app/build .

EXPOSE 3000

CMD ["serve", ".", "-l", "3000"]