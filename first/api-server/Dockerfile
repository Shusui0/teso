# api-server/Dockerfile
FROM node:18-alpine

# set working dir
WORKDIR /usr/src/app

# copy package files first to leverage Docker cache
COPY package.json package-lock.json* ./

# install deps
RUN npm ci --only=production

# copy source
COPY . .

# expose port used by the API
EXPOSE 3000

# start command
CMD ["node", "src/index.js"]
