# Fly.io Deployment Guide

This document covers the Fly.io deployment setup for the ChatGPT MCP server.

## Overview

| | |
|-|-|
| **App Name** | `chatgpt-helloworld-mcp` |
| **Live URL** | https://chatgpt-helloworld-mcp.fly.dev |
| **MCP Endpoint** | https://chatgpt-helloworld-mcp.fly.dev/mcp |
| **Region** | Stockholm (arn) |
| **Auto-deploy** | On push to `master` via GitHub Actions |

---

## Initial Setup (Already Done)

These steps were performed to set up the deployment:

```bash
# 1. Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# 2. Add to PATH (or restart shell)
export PATH="$HOME/.fly/bin:$PATH"

# 3. Login
fly auth login

# 4. Initialize app (creates fly.toml)
fly launch --no-deploy --name chatgpt-helloworld-mcp

# 5. Deploy
fly deploy
```

---

## Project Files

### Dockerfile

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8000
ENV PORT=8000
ENV NODE_ENV=production
CMD ["node", "dist/server/index.js"]
```

### fly.toml

Key settings for MCP/SSE servers:

```toml
[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = 'off'      # Keep running for SSE
  auto_start_machines = true
  min_machines_running = 1         # Always have one instance

[[http_service.checks]]
  interval = "15s"
  timeout = "5s"
  path = "/health"

[[vm]]
  memory_mb = 256
```

### GitHub Actions (.github/workflows/fly-deploy.yml)

Auto-deploys on push to `master`:

```yaml
on:
  push:
    branches:
      - master
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

## Development Workflow

### Local Development

```bash
# Run locally
npm run build
npm start

# Server runs at http://localhost:8000
# Use ngrok for ChatGPT testing: ngrok http 8000
```

### Deploy to Fly.io

**Option 1: Auto-deploy (recommended)**

```bash
git add .
git commit -m "Your changes"
git push
# GitHub Actions deploys automatically
```

**Option 2: Manual deploy**

```bash
npm run build
fly deploy
```

### Watch Deployment Progress

```bash
# In terminal
fly logs

# Or in browser
# https://fly.io/apps/chatgpt-helloworld-mcp/monitoring
```

---

## Operations Commands

### Status & Monitoring

```bash
# App status
fly status

# Live logs
fly logs

# Live logs (follow)
fly logs -f

# App info
fly info

# Check health
curl https://chatgpt-helloworld-mcp.fly.dev/health
```

### Scaling

```bash
# Check current scale
fly scale show

# Scale to 2 instances (for redundancy)
fly scale count 2

# Scale back to 1
fly scale count 1

# Change VM size
fly scale vm shared-cpu-1x --memory 512
```

### SSH & Debugging

```bash
# SSH into running container
fly ssh console

# Run one-off command
fly ssh console -C "node --version"

# Check processes
fly ssh console -C "ps aux"
```

### Secrets & Environment

```bash
# List secrets
fly secrets list

# Set a secret
fly secrets set MY_SECRET=value

# Unset a secret
fly secrets unset MY_SECRET

# Set multiple
fly secrets set KEY1=val1 KEY2=val2
```

### Deployment Management

```bash
# List recent deployments
fly releases

# Rollback to previous version
fly deploy --image registry.fly.io/chatgpt-helloworld-mcp:previous-tag

# Restart app
fly apps restart chatgpt-helloworld-mcp
```

### Domains & Certificates

```bash
# List certificates
fly certs list

# Add custom domain
fly certs create yourdomain.com

# Check certificate status
fly certs show yourdomain.com
```

---

## Troubleshooting

### App Not Responding

```bash
# Check status
fly status

# Check logs for errors
fly logs

# Restart
fly apps restart chatgpt-helloworld-mcp
```

### Health Check Failing

```bash
# Test health endpoint directly
curl -v https://chatgpt-helloworld-mcp.fly.dev/health

# Check if app is listening on correct port
fly ssh console -C "netstat -tlnp"
```

### Deployment Failed

```bash
# Check GitHub Actions logs
# https://github.com/MTV-development/chatgpt-helloworld-app/actions

# Or deploy manually with verbose output
fly deploy --verbose
```

### Out of Memory

```bash
# Increase memory
fly scale vm shared-cpu-1x --memory 512

# Check current usage
fly ssh console -C "free -m"
```

---

## Cost Management

### Current Setup

| Resource | Spec | Est. Cost |
|----------|------|-----------|
| VM | shared-cpu-1x, 256MB | ~$2/mo |
| Always-on | 1 instance | Included |
| Bandwidth | 100GB free | $0 |

### Free Tier Limits

- 3 shared-cpu-1x VMs with 256MB
- 160GB outbound bandwidth
- Unlimited inbound

### Reduce Costs

```bash
# Scale to zero when not needed (breaks SSE!)
fly scale count 0

# Use smaller VM
fly scale vm shared-cpu-1x --memory 256
```

### Monitor Usage

```bash
fly billing
```

Or visit: https://fly.io/dashboard/personal/billing

---

## Useful Links

- **Dashboard**: https://fly.io/apps/chatgpt-helloworld-mcp
- **Monitoring**: https://fly.io/apps/chatgpt-helloworld-mcp/monitoring
- **GitHub Actions**: https://github.com/MTV-development/chatgpt-helloworld-app/actions
- **Fly.io Docs**: https://fly.io/docs/

---

## Quick Reference

```bash
# Most common commands
fly status          # Check app status
fly logs -f         # Follow logs
fly deploy          # Manual deploy
fly ssh console     # SSH into container
fly apps restart    # Restart app
fly scale show      # Check scaling
```
