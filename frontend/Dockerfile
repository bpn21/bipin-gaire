FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock* ./

RUN if [ -f yarn.lock ]; then yarn install; else npm install; fi

COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host"]
