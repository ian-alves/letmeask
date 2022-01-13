# syntax=docker/dockerfile:1
FROM node:12-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /
COPY . .
RUN yarn install --production
RUN yarn start