FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git && \
    git clone --depth 1 https://github.com/jimchen2/vercel-bedrock . && \
    npm ci --production && \
    npm run build && \
    rm -rf .git

EXPOSE 3000

CMD ["npm", "start"]