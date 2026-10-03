# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm install --ignore-scripts
COPY shared shared
COPY backend backend
COPY frontend frontend
COPY scripts scripts
COPY tests tests
# VITE_SITE_URL is baked into the client bundle (public value, not a secret)
ARG VITE_SITE_URL=
ENV VITE_SITE_URL=$VITE_SITE_URL
RUN npm run build

FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY backend/package.json backend/package.json
RUN npm install --omit=dev --ignore-scripts
COPY --from=build /app/shared shared
COPY --from=build /app/backend backend
COPY --from=build /app/frontend/dist frontend/dist
COPY --from=build /app/frontend/public frontend/public
RUN mkdir -p backend/uploads && chown -R node:node /app
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "backend/src/server.js"]
