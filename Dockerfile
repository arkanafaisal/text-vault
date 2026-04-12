FROM node:20 AS frontend-build
WORKDIR /frontend

COPY frontend2/package*.json ./
RUN npm install

COPY frontend2 .
RUN npm run build


FROM node:20
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend .

COPY --from=frontend-build /frontend/dist ./dist

CMD ["node", "server.js"]