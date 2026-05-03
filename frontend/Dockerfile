FROM node:20-alpine AS build
WORKDIR /app
COPY livestock/package*.json ./
RUN npm ci
COPY livestock/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
