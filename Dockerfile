FROM node:14-alpine
# Create app directory
WORKDIR /app
COPY . .
RUN npm cache clean --f
RUN npm install
# Bundle app source
COPY . /app
EXPOSE 3001 30010
CMD [ "npm", "run", "server" ]