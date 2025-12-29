FROM oven/bun:1

WORKDIR /app

COPY bun.lock package.json tsconfig.json app.json ./
COPY backend ./backend
COPY app ./app
COPY constants ./constants

RUN bun install --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "backend/server.ts"]
