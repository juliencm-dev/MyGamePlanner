FROM node:10-slim as builder
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm install -g @zeit/ncc
RUN ncc build server.js -o dist

FROM node:10-slim
WORKDIR /app
COPY --from=builder /app/dist/index.js .
CMD ["node", "index.js"]
