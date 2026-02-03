FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Usar un servidor estático simple para servir la carpeta dist
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
