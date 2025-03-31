# frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve using a simple static file server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]