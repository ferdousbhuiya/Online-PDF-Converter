FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    qpdf \
    libreoffice \
    fonts-dejavu \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server ./server

ENV PORT=8787
EXPOSE 8787

CMD ["node", "server/index.mjs"]
