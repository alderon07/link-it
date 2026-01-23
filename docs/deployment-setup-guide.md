# Deployment Setup Guide

This guide covers all external configuration required to enable the CI/CD pipeline for Link-It.

## Prerequisites

- GitHub repository with admin access
- Convex project created
- Clerk application configured
- Production server with SSH access
- (Optional) Custom domain with DNS access

---

## 1. GitHub Repository Configuration

### 1.1 Repository Secrets

Navigate to **Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Convex Dashboard → Settings |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public API key | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret API key | Clerk Dashboard → API Keys |
| `CONVEX_DEPLOY_KEY` | Convex CI/CD deployment key | See [Convex Setup](#21-generate-deploy-key) |
| `PROD_HOST` | Production server hostname or IP | Your server (e.g., `192.168.1.100`) |
| `PROD_USER` | SSH username for deployment | Your server (e.g., `ubuntu`, `deploy`) |
| `PROD_SSH_KEY` | SSH private key for deployment | See [SSH Key Setup](#31-generate-ssh-key) |
| `PROD_URL` | Production URL for health checks | Your domain (e.g., `https://link-it.example.com`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key (optional) | PostHog Dashboard → Project Settings |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL (optional) | Usually `https://us.posthog.com` |
| `CODECOV_TOKEN` | Codecov upload token (optional) | Codecov.io → Repository Settings |

### 1.2 Branch Protection Rules

Navigate to **Settings → Branches → Add rule**

Configure protection for the `main` branch:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - Required checks:
    - `validate` (Lint & Type Check)
    - `test` (Unit Tests)
    - `build` (Build Check)
- [x] Require branches to be up to date before merging
- [x] Require conversation resolution before merging

### 1.3 Production Environment (Optional)

Navigate to **Settings → Environments → New environment**

Create an environment named `production`:

- Add required reviewers for manual deployment approval
- Add wait timer before deployment starts
- Restrict deployment to `main` branch only

---

## 2. Convex Configuration

### 2.1 Generate Deploy Key

Run this command locally (requires Convex CLI authentication):

```bash
npx convex deploy-key create production
```

Copy the generated key and add it as `CONVEX_DEPLOY_KEY` in GitHub Secrets.

### 2.2 Verify Project Configuration

1. Open [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Go to **Settings** and note the deployment URL
4. Ensure the URL matches your `NEXT_PUBLIC_CONVEX_URL` secret

### 2.3 Environment Variables

Ensure your Convex project has the required environment variables set in the dashboard:

- `CLERK_WEBHOOK_SECRET` - For webhook signature verification

---

## 3. Production Server Setup

### 3.1 Generate SSH Key

On your local machine, generate a dedicated deployment key:

```bash
# Generate ED25519 key for deployment
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/link_it_deploy

# Display private key (add to PROD_SSH_KEY secret)
cat ~/.ssh/link_it_deploy

# Display public key (add to server)
cat ~/.ssh/link_it_deploy.pub
```

**Important:** The private key includes the `-----BEGIN` and `-----END` lines. Copy the entire content.

### 3.2 Server Prerequisites

SSH into your production server and install required software:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
exit
```

### 3.3 Configure SSH Access

Add the deployment public key to your server:

```bash
# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add the public key
echo "ssh-ed25519 AAAA... github-actions-deploy" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3.4 Create Application Directory

```bash
# Create directory for the application
sudo mkdir -p /opt/link-it
sudo chown $USER:$USER /opt/link-it
cd /opt/link-it
```

### 3.5 Configure Docker Compose

Create the docker-compose.yml file:

```bash
cat > /opt/link-it/docker-compose.yml << 'EOF'
services:
  app:
    image: ghcr.io/YOUR_GITHUB_USERNAME/link-it:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    env_file:
      - .env
    restart: unless-stopped
    read_only: true
    security_opt:
      - no-new-privileges:true
    tmpfs:
      - /tmp
EOF
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username or organization.

### 3.6 Create Environment File

Create the runtime environment file:

```bash
cat > /opt/link-it/.env << 'EOF'
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key
EOF

# Secure the file
chmod 600 /opt/link-it/.env
```

### 3.7 Authenticate with GitHub Container Registry

Generate a GitHub Personal Access Token:

1. Go to GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name: `link-it-docker-pull`
4. Expiration: Set as appropriate
5. Scopes: Select `read:packages`
6. Click **Generate token** and copy it

Authenticate on the server:

```bash
# Login to GitHub Container Registry
echo "ghp_your_token_here" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

---

## 4. Clerk Configuration

### 4.1 Webhook Endpoint

Configure Clerk to send user events to your application:

1. Open [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Webhooks**
3. Click **Add Endpoint**
4. Enter URL: `https://your-domain.com/api/webhooks/clerk`
5. Select events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Click **Create**
7. Copy the **Signing Secret** for webhook verification

Add the signing secret to your Convex environment variables in the Convex dashboard.

### 4.2 JWT Template for Convex

Configure JWT authentication for Convex:

1. In Clerk Dashboard, go to **JWT Templates**
2. Click **New template**
3. Select **Convex** from the template list
4. Name the template `convex`
5. Click **Create**

Ensure your Convex auth configuration matches the JWT template claims.

---

## 5. Optional: Codecov Setup

Enable code coverage reporting:

1. Go to [codecov.io](https://codecov.io)
2. Sign in with GitHub
3. Click **Add new repository**
4. Select your repository
5. Go to repository **Settings**
6. Copy the **Repository Upload Token**
7. Add as `CODECOV_TOKEN` secret in GitHub

---

## 6. Optional: Custom Domain with SSL

### 6.1 DNS Configuration

Point your domain to the production server:

```
Type: A
Name: @ (or subdomain)
Value: YOUR_SERVER_IP
TTL: 300
```

### 6.2 SSL Certificate with Let's Encrypt

Install certbot and obtain a certificate:

```bash
# Install certbot
sudo apt install certbot -y

# Obtain certificate (stop any service using port 80 first)
sudo certbot certonly --standalone -d your-domain.com

# Certificates will be saved to:
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem
```

### 6.3 Nginx Reverse Proxy (Recommended)

Install and configure nginx:

```bash
# Install nginx
sudo apt install nginx -y

# Create configuration
sudo cat > /etc/nginx/sites-available/link-it << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/link-it /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.4 Auto-Renewal for SSL

Set up automatic certificate renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically adds a cron job for renewal
# Verify with:
sudo systemctl status certbot.timer
```

---

## 7. Verification Checklist

Use this checklist to verify your setup is complete:

### GitHub Repository
- [ ] `NEXT_PUBLIC_CONVEX_URL` secret added
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` secret added
- [ ] `CLERK_SECRET_KEY` secret added
- [ ] `CONVEX_DEPLOY_KEY` secret added
- [ ] `PROD_HOST` secret added
- [ ] `PROD_USER` secret added
- [ ] `PROD_SSH_KEY` secret added
- [ ] `PROD_URL` secret added
- [ ] Branch protection enabled for `main`

### Convex
- [ ] Deploy key created with `npx convex deploy-key create production`
- [ ] Project exists in Convex dashboard
- [ ] Environment variables configured

### Production Server
- [ ] Docker installed and running
- [ ] SSH deployment key added to `authorized_keys`
- [ ] `/opt/link-it` directory created with correct ownership
- [ ] `docker-compose.yml` configured
- [ ] `.env` file created with `CLERK_SECRET_KEY`
- [ ] Authenticated with `ghcr.io`

### Clerk
- [ ] Webhook endpoint configured
- [ ] Signing secret added to Convex environment
- [ ] JWT template for Convex created

### Optional
- [ ] Codecov token added (for coverage reporting)
- [ ] SSL certificate obtained
- [ ] Nginx configured as reverse proxy

---

## 8. Testing the Pipeline

After completing the setup, verify everything works:

### 8.1 Test CI Pipeline

1. Create a feature branch:
   ```bash
   git checkout -b test/verify-ci
   ```

2. Make a small change (e.g., update a comment)

3. Push and create a PR:
   ```bash
   git push -u origin test/verify-ci
   ```

4. Open a Pull Request to `main`

5. Verify all checks pass:
   - `validate` - Lint & Type Check
   - `test` - Unit Tests
   - `build` - Build Check

### 8.2 Test Deployment Pipeline

1. Merge the PR to `main`

2. Go to **Actions** tab and watch the deployment workflow

3. Verify each step completes:
   - Run Tests
   - Deploy Convex
   - Build Docker Image
   - Deploy to Production
   - Verify Deployment

4. Check the health endpoint:
   ```bash
   curl https://your-domain.com/api/v1/health
   ```

   Expected response:
   ```json
   {"status":"healthy","timestamp":"...","version":"..."}
   ```

---

## 9. Troubleshooting

### SSH Connection Failed

```
Error: ssh: connect to host xxx.xxx.xxx.xxx port 22: Connection timed out
```

**Solutions:**
- Verify the `PROD_HOST` secret is correct
- Check server firewall allows port 22
- Verify SSH service is running: `sudo systemctl status sshd`

### Docker Pull Failed

```
Error: denied: installation not allowed to access repository
```

**Solutions:**
- Verify `docker login ghcr.io` succeeded on the server
- Check the PAT has `read:packages` scope
- Ensure the image name matches your repository

### Convex Deploy Failed

```
Error: Invalid deploy key
```

**Solutions:**
- Regenerate deploy key: `npx convex deploy-key create production`
- Update `CONVEX_DEPLOY_KEY` secret in GitHub
- Verify you're logged into the correct Convex account

### Health Check Failed

```
Health check failed after 6 attempts
```

**Solutions:**
- SSH to server and check container logs: `docker compose logs`
- Verify the container is running: `docker compose ps`
- Check environment variables are set correctly
- Ensure port 3000 is accessible

### Build Failed with Missing Secrets

```
Error: NEXT_PUBLIC_CONVEX_URL is not defined
```

**Solutions:**
- Verify all required secrets are added in GitHub
- Check secret names match exactly (case-sensitive)
- For forks, secrets must be added to the fork repository

---

## Related Documentation

- [Testing & CI/CD Guide](./testing-ci-cd-guide.md) - Testing infrastructure details
- [Docker Deployment Guide](./docker-deployment-guide.md) - Container configuration
- [Architecture Index](./architecture/index.md) - Project overview
