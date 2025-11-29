# frontend/Dockerfile

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npm run build
RUN npm run build
# EXPOSE 5173
# CMD [ "npm", "run", "dev" ]

# Serve with nginx 
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
