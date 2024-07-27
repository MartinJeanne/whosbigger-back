FROM node:20-alpine
WORKDIR /usr/src/linkstart-bot

# dependencies installation
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Environnement variables
COPY .env .

# SSL self signed certificate
COPY sslcert sslcert/

# Code
COPY src src

# Run the bot
CMD ["npm", "start"]
