FROM node:18

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

RUN npm install

# Copy all files including .env
COPY . .

EXPOSE 3000  

CMD ["npm", "start"]