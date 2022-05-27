# STEP 1: Build
FROM node:8-alpine as builder

RUN mkdir /ng-app

WORKDIR /ng-app

COPY package.json ./

RUN yarn

COPY . .

RUN yarn run publish-pro

# STEP 2: Setup
FROM nginx:1.17.3-alpine

COPY --from=builder /ng-app/_nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;"]
