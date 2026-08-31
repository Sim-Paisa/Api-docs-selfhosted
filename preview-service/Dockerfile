# Preview service — one Docusaurus dev server per draft branch.
#
# Build:  docker build -t simpaisa-docs-preview .
# Run:    docker run -d --name docs-preview -p 4000:4000 \
#           -e PREVIEW_REPO_URL=https://<token>@github.com/<org>/<repo>.git \
#           -e PREVIEW_PUBLIC_ORIGIN=http://docs-preview.internal:4000 \
#           -v docs-preview-cache:/app/.cache \
#           simpaisa-docs-preview
#
# Sized for one small internal VM behind the VPN. Not for public exposure —
# it runs development servers, which are not hardened for the open internet.
FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.mjs ./

# Git needs an identity before it will create worktrees in some configurations.
RUN git config --global user.email "preview@simpaisa.local" \
  && git config --global user.name "Docs Preview Service" \
  && git config --global --add safe.directory '*'

ENV PORT=4000 \
    PREVIEW_REPO_DIR=/app/.cache/repo \
    PREVIEW_WORK_DIR=/app/.cache/worktrees \
    PREVIEW_SHARED_MODULES=/app/.cache/node_modules \
    PREVIEW_BRANCH_PREFIX=draft/ \
    PREVIEW_IDLE_MINUTES=45 \
    PREVIEW_POLL_SECONDS=3

EXPOSE 4000

# Warm the shared node_modules on first boot so branch spin-up skips `npm ci`.
# Subsequent starts reuse the mounted volume.
CMD ["node", "server.mjs"]
