FROM oven/bun:1

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./
COPY backend ./backend

RUN bun install --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "backend/server.ts"]
