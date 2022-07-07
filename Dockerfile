# Stage 1 - the build process
FROM node as build-deps
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - the production environment
FROM node
WORKDIR /app
COPY --from=build-deps /app/build .
RUN npm install -g serve
EXPOSE 3000
#CMD [ "npm", "start" ]
CMD serve -s build


