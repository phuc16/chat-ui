FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=builder /app/build . 

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]