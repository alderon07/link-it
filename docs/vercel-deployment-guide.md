# Vercel Deployment Guide (Cheapest Option)

This guide covers deploying Link-It to Vercel, which offers a **free tier** perfect for Next.js applications.

## Why Vercel?

- ✅ **100% Free** for personal/small projects
- ✅ **Optimized for Next.js** - zero configuration needed
- ✅ **Automatic SSL** certificates
- ✅ **Global CDN** for fast performance
- ✅ **Automatic deployments** from Git
- ✅ **Preview deployments** for every PR
- ✅ **100GB bandwidth/month** (usually more than enough)

## Prerequisites

- GitHub account (or GitLab/Bitbucket)
- Convex project created
- Clerk application configured
- (Optional) PostHog account

## Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? link-it (or your choice)
# - Directory? ./
# - Override settings? No
```

## Step 3: Configure Environment Variables

In the Vercel dashboard, go to your project → **Settings → Environment Variables**

Add the following variables:

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Convex Dashboard → Settings |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public API key | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret API key | Clerk Dashboard → API Keys |

### Optional Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key | PostHog Dashboard → Project Settings |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL | Usually `https://us.posthog.com` |

**Important:** 
- Add these for **Production**, **Preview**, and **Development** environments
- After adding variables, **redeploy** your project

## Step 4: Configure Clerk for Vercel

### 4.1 Update Clerk Allowed Origins

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Settings → Domains**
3. Add your Vercel domain: `your-app.vercel.app`
4. If using custom domain, add that too

### 4.2 Update Webhook Endpoint

1. In Clerk Dashboard, go to **Webhooks**
2. Update or create webhook endpoint:
   - URL: `https://your-app.vercel.app/api/webhooks/clerk`
   - Or: `https://your-custom-domain.com/api/webhooks/clerk`
3. Select events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the **Signing Secret** and add to Convex environment variables

## Step 5: Configure Convex

### 5.1 Update Convex Environment Variables

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Ensure `CLERK_WEBHOOK_SECRET` is set (from Clerk webhook)

### 5.2 Update Convex Allowed Origins (if needed)

Convex typically doesn't require CORS configuration, but verify in your Convex dashboard if you encounter CORS issues.

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Go to your project → **Settings → Domains**
2. Add your domain (e.g., `link-it.example.com`)
3. Vercel will provide DNS records to add

### 6.2 Update DNS

Add the DNS records provided by Vercel to your domain registrar:

- **A Record** or **CNAME** pointing to Vercel
- Vercel automatically handles SSL certificates

### 6.3 Update Clerk

Add your custom domain to Clerk's allowed origins (see Step 4.1)

## Step 7: Verify Deployment

1. Visit your Vercel deployment URL: `https://your-app.vercel.app`
2. Test the health endpoint: `https://your-app.vercel.app/api/v1/health`
3. Test authentication flow
4. Test creating/editing links

## Step 8: Configure Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches and PRs

You can configure this in **Settings → Git**.

## Step 9: Update GitHub Actions (Optional)

If you want to keep your existing CI/CD but skip Docker deployment:

Update `.github/workflows/deploy.yml` to skip the Docker build/deploy steps when deploying to Vercel:

```yaml
# Vercel handles deployment automatically, so you can:
# 1. Keep only the test job
# 2. Or remove the deploy workflow entirely
```

## Cost Breakdown

| Service | Cost |
|---------|------|
| **Vercel** | $0/month (free tier) |
| **Convex** | $0/month (free tier) |
| **Clerk** | $0/month (free tier) |
| **PostHog** | $0/month (free tier) |
| **Total** | **$0/month** |

### When You Might Need to Upgrade

- **Vercel Pro** ($20/month): If you exceed 100GB bandwidth or need team features
- **Convex Pro** ($25/month): If you exceed free tier limits (usually very generous)
- **Clerk Pro** ($25/month): If you need advanced features

For most personal/small projects, the free tiers are sufficient.

## Troubleshooting

### Build Fails with Missing Environment Variables

**Solution:** Ensure all `NEXT_PUBLIC_*` variables are set in Vercel dashboard and redeploy.

### Authentication Not Working

**Solution:** 
- Verify Clerk allowed origins include your Vercel domain
- Check that `CLERK_SECRET_KEY` is set correctly
- Ensure webhook endpoint URL is correct

### Convex Connection Errors

**Solution:**
- Verify `NEXT_PUBLIC_CONVEX_URL` is correct
- Check Convex dashboard for any errors
- Ensure Convex functions are deployed

### API Routes Not Working

**Solution:**
- Vercel fully supports Next.js API routes
- Check Vercel function logs in dashboard
- Verify environment variables are set

## Migration from Docker/VPS

If you're currently using Docker/VPS deployment:

1. **Keep your Docker setup** as a backup
2. **Deploy to Vercel** using this guide
3. **Test thoroughly** on Vercel
4. **Update DNS** to point to Vercel
5. **Shut down VPS** once confirmed working

## Database & Caching Costs

### Convex Database (Free Tier)

Your app uses **Convex** for the database, which has a generous free tier:

**Free Tier Includes:**
- ✅ 1,000,000 function calls/month
- ✅ 0.5 GB database storage
- ✅ 1 GB database bandwidth/month
- ✅ Real-time WebSocket connections (unlimited)

**For most apps, this is sufficient.** You'll only need to upgrade if you have:
- Millions of page views per month
- Hundreds of thousands of users

**Cost: $0/month** (free tier is usually enough)

### Caching Options

**Built-in Caching (Free):**
- Convex queries are automatically cached
- Next.js static pages are cached
- Vercel edge network caches assets

**External Cache (Optional):**
- **Upstash Redis**: Free tier (500K commands/month, 256MB storage)
- **Vercel KV**: Free tier (30K reads/day, 256MB storage)
- **Cost: $0/month** for small-medium apps

**When to Add External Cache:**
- Public pages getting 1000+ views/day
- Slow page load times (> 2 seconds)
- Exceeding 500K Convex function calls/month

See [Cost Analysis: Database & Caching](./cost-analysis-database-caching.md) for detailed information.

## Next Steps

- Set up monitoring (Vercel Analytics is free)
- Configure preview deployments for PRs
- Set up custom domain
- Enable Vercel Analytics for performance insights
- Monitor Convex usage in dashboard

## Related Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Cost Analysis: Database & Caching](./cost-analysis-database-caching.md) - Detailed cost breakdown
- [Deployment Setup Guide](./deployment-setup-guide.md) - Original VPS deployment guide
