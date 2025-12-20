# ---- Base image ----

FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (better caching)

COPY package\*.json ./
RUN npm ci

# Copy source

COPY . .

# Expose app port

EXPOSE 3000

# Default command (overridden by compose if needed)

CMD ["npm", "start"]
