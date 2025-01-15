#  Created Base Image for all stages
FROM node:20-alpine As base
RUN apk add --no-cache libc6-compat

# Install dependencies only when needed
FROM base AS deps
WORKDIR /opt/app
COPY package.json ./
RUN npm install 

FROM base AS builder
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN npm run build

FROM base AS devDeps
WORKDIR /opt/app
COPY package.json ./
RUN npm install --omit=dev

# Production image, copy all the files and run next
FROM base AS runner
USER node
WORKDIR /usr/src/app
# COPY --chown=node:node --from=builder /opt/app/.env ./
COPY --chown=node:node --from=builder /opt/app/next.config.mjs ./
COPY --chown=node:node --from=builder /opt/app/.next ./.next
COPY --chown=node:node --from=devDeps /opt/app/node_modules ./node_modules
CMD ["node_modules/.bin/next", "start"]