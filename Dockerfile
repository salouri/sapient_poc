# Build Stage 1
# This build created a staging docker image
FROM node:16-alpine AS devBuild
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./pm2.config.cjs .
RUN npm run build


# Build Stage 2
# This build takes the production build from staging build
FROM node:16-alpine as prodBuild
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./pm2.config.cjs .
RUN npm ci --only=production
COPY --from=devBuild /usr/src/app/dist ./dist
EXPOSE 3000
# CMD npm start
CMD ["npm", "start"]