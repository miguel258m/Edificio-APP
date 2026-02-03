FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Usar un servidor estático simple para servir la carpeta dist
RUN npm install -g serve

# Railway asigna un puerto dinámico a través de la variable PORT
# EXPOSE 3000 <-- Esto no es necesario ya que Railway lo maneja

CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
