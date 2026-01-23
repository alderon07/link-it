# Cost Analysis: Database & Caching

This document breaks down the costs for your database (Convex) and caching options, helping you choose the most cost-effective setup.

## Current Setup Costs

### Database: Convex (Free Tier)

**Free Tier Includes:**
- ✅ **1,000,000 function calls/month** (queries + mutations)
- ✅ **85,000 Chef tokens/month** (AI features, if used)
- ✅ **0.5 GB database storage** (total)
- ✅ **1 GB database bandwidth/month**
- ✅ **1 GB file storage** (total)
- ✅ **1 GB file bandwidth/month**
- ✅ **20 GB-hours action compute/month**
- ✅ **Real-time WebSocket connections** (unlimited)
- ✅ **Up to 6 developers** per project

**When You Need to Upgrade:**
- **Starter Plan**: Pay-as-you-go for overage usage
- **Pro Plan**: $25/month (includes more resources)

**For a "link in bio" app, the free tier is usually sufficient** unless you have:
- Millions of page views per month
- Hundreds of thousands of users
- Very large file uploads

**Estimated Usage for Small-Medium App:**
- 10,000 users = ~100K-500K function calls/month ✅ (within free tier)
- 100,000 page views/month = ~1 GB bandwidth ✅ (within free tier)
- Average user data = ~50KB = 500MB total ✅ (within free tier)

---

## Caching Options & Costs

### Option 1: No External Cache (Recommended for Start)

**Cost: $0/month**

**What You Get:**
- Convex has built-in query caching (automatic)
- Next.js has built-in caching (automatic)
- Vercel has edge caching (automatic)

**When This Works:**
- ✅ Small to medium traffic (< 100K page views/month)
- ✅ Most queries are user-specific (not shared)
- ✅ Public pages are relatively static

**Your Current Setup:**
- Convex queries are automatically cached and only re-run when dependencies change
- Next.js static pages are cached at build time
- Vercel edge network caches static assets

**Recommendation:** Start here. Add caching only if you see performance issues or exceed free tiers.

---

### Option 2: Upstash Redis (Cheapest External Cache)

**Free Tier:**
- ✅ **$0/month** (no credit card required)
- ✅ **256MB data storage**
- ✅ **500,000 commands/month**
- ✅ **10GB monthly bandwidth**
- ✅ **Up to 10,000 commands/second**
- ✅ **TLS encryption, global replication, REST API**

**Paid Plans (if you exceed free tier):**
- **Pay-as-You-Go**: $0.20 per 100K commands
- **Fixed Plans**: Starting at $10/month (250MB, 50GB bandwidth)

**Best For:**
- Caching public identity pages
- Session storage
- Rate limiting
- Temporary data (analytics, views)

**Estimated Usage:**
- 100K page views/month = ~100K-200K cache commands ✅ (within free tier)
- Public pages cached for 5-15 minutes = ~50MB storage ✅ (within free tier)

**Cost: $0/month** (for most apps)

---

### Option 3: Vercel KV (Redis-compatible)

**Free Tier:**
- ✅ **$0/month**
- ✅ **256MB storage**
- ✅ **30,000 reads/day**
- ✅ **30,000 writes/day**

**Paid Plans:**
- **Pro**: $20/month (includes 1GB storage, 1M reads/day, 1M writes/day)
- **Enterprise**: Custom pricing

**Best For:**
- Vercel-native integration
- Simple key-value caching
- Session storage

**Cost: $0/month** (for small apps)

---

### Option 4: Cloudflare KV (Free Tier)

**Free Tier:**
- ✅ **$0/month**
- ✅ **100,000 reads/day**
- ✅ **1,000 writes/day**
- ✅ **1GB storage**

**Paid Plans:**
- **Workers Paid**: $5/month (includes 10M reads/day, 1M writes/day, 10GB storage)

**Best For:**
- Cloudflare Pages deployments
- Edge caching
- Global distribution

**Cost: $0/month** (for small apps)

---

### Option 5: Self-Hosted Redis (VPS)

**Cost: $5-6/month** (VPS hosting)

**What You Get:**
- Full control
- Unlimited storage (within VPS limits)
- No per-request charges

**Best For:**
- High-traffic apps
- Custom Redis configurations
- When you already have a VPS

**Cost: $5-6/month** (plus VPS costs)

---

## Recommended Setup by Traffic Level

### Small App (< 10K page views/month)

**Setup:**
- ✅ **Vercel**: Free (hosting)
- ✅ **Convex**: Free (database)
- ✅ **Clerk**: Free (auth)
- ✅ **PostHog**: Free (analytics)
- ✅ **No external cache** (use built-in caching)

**Total Cost: $0/month**

---

### Medium App (10K - 100K page views/month)

**Setup:**
- ✅ **Vercel**: Free (hosting)
- ✅ **Convex**: Free (database) - may need to monitor usage
- ✅ **Clerk**: Free (auth)
- ✅ **PostHog**: Free (analytics)
- ✅ **Upstash Redis**: Free (caching public pages)

**Total Cost: $0/month**

**When to Add Cache:**
- Public identity pages getting 1000+ views/day
- Slow page load times (> 2 seconds)
- High Convex function call usage

---

### Large App (100K - 1M page views/month)

**Setup:**
- **Vercel Pro**: $20/month (if bandwidth exceeded)
- **Convex Starter**: Pay-as-you-go (~$5-15/month)
- **Clerk**: Free or Pro ($25/month)
- **PostHog**: Free or paid
- **Upstash Redis**: Free or $10/month

**Total Cost: $25-60/month**

---

### Very Large App (1M+ page views/month)

**Setup:**
- **Vercel Pro/Enterprise**: $20-100+/month
- **Convex Pro**: $25+/month
- **Clerk Pro**: $25+/month
- **Upstash Redis**: $10-50/month
- **CDN/Caching**: Additional costs

**Total Cost: $80-200+/month**

---

## When to Add Caching

### Signs You Need External Caching:

1. **High Convex Function Calls**
   - Exceeding 500K calls/month
   - Public pages generating many duplicate queries

2. **Slow Page Load Times**
   - Public pages taking > 2 seconds to load
   - Database queries are the bottleneck

3. **High Bandwidth Costs**
   - Exceeding Convex free tier bandwidth
   - Repeatedly fetching the same data

4. **Rate Limiting Needs**
   - Need to implement rate limiting
   - Prevent abuse/spam

### What to Cache:

**Good Candidates:**
- ✅ Public identity pages (cache for 5-15 minutes)
- ✅ Public links list (cache for 5-15 minutes)
- ✅ Theme data (cache for 1 hour)
- ✅ Analytics aggregations (cache for 1-5 minutes)

**Don't Cache:**
- ❌ User-specific authenticated data
- ❌ Real-time updates (use Convex subscriptions)
- ❌ Frequently changing data (analytics counters)

---

## Implementation Example: Adding Upstash Redis

### Step 1: Install Upstash

```bash
pnpm add @upstash/redis
```

### Step 2: Create Redis Client

```typescript
// src/lib/redis.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
```

### Step 3: Cache Public Pages

```typescript
// src/app/[username]/page.tsx
import { redis } from '@/lib/redis'

export default async function PublicPage({ username }: { username: string }) {
  // Try cache first
  const cacheKey = `identity:${username}`
  const cached = await redis.get(cacheKey)
  
  if (cached) {
    return <PublicIdentityPage identity={cached} />
  }
  
  // Fetch from Convex
  const identity = await getPublicIdentity(username)
  
  // Cache for 10 minutes
  await redis.setex(cacheKey, 600, identity)
  
  return <PublicIdentityPage identity={identity} />
}
```

### Step 4: Invalidate Cache on Updates

```typescript
// In your mutation
await updateIdentity(identityId, data)
await redis.del(`identity:${username}`) // Invalidate cache
```

---

## Cost Comparison Summary

| Setup | Database | Cache | Hosting | Total/Month |
|-------|----------|-------|---------|-------------|
| **Free Tier** | Convex Free | None (built-in) | Vercel Free | **$0** |
| **With Redis** | Convex Free | Upstash Free | Vercel Free | **$0** |
| **Medium Traffic** | Convex Starter | Upstash Free | Vercel Free | **$5-15** |
| **High Traffic** | Convex Pro | Upstash $10 | Vercel Pro | **$55** |
| **Self-Hosted** | Convex Free | Redis on VPS | VPS $6 | **$6** |

---

## Recommendations

### For Your App (Link-It):

1. **Start with Free Tier:**
   - ✅ Vercel (hosting)
   - ✅ Convex (database)
   - ✅ No external cache (use built-in caching)

2. **Add Caching When:**
   - You exceed 500K Convex function calls/month
   - Public pages are slow (> 2 seconds)
   - You have 1000+ daily page views

3. **Cheapest Cache Option:**
   - **Upstash Redis Free Tier** ($0/month)
   - 500K commands/month is usually enough
   - Easy to set up and integrate

4. **Monitor Usage:**
   - Check Convex dashboard monthly
   - Monitor function call counts
   - Track bandwidth usage
   - Add caching before hitting limits

---

## Monitoring & Alerts

### Set Up Alerts:

1. **Convex Dashboard:**
   - Monitor function calls (target: < 800K/month)
   - Monitor bandwidth (target: < 800MB/month)
   - Monitor storage (target: < 400MB)

2. **Vercel Dashboard:**
   - Monitor bandwidth (target: < 80GB/month)
   - Monitor function invocations

3. **Upstash Dashboard** (if using):
   - Monitor commands (target: < 400K/month)
   - Monitor storage (target: < 200MB)

---

## Migration Path

### Phase 1: Launch (Free)
- Vercel + Convex + No cache
- **Cost: $0/month**

### Phase 2: Growth (Still Free)
- Add Upstash Redis for public pages
- **Cost: $0/month**

### Phase 3: Scale (Paid)
- Upgrade Convex if needed
- Upgrade Vercel if bandwidth exceeded
- **Cost: $5-25/month**

### Phase 4: Enterprise (Custom)
- Custom pricing for all services
- **Cost: $50-200+/month**

---

## Conclusion

**For most "link in bio" apps, you can run completely free** with:
- Vercel (hosting)
- Convex (database)
- Built-in caching (no external cache needed)

**Add Upstash Redis (free tier) when:**
- You have high traffic on public pages
- You want to reduce Convex function calls
- You need rate limiting

**Total cost for small-medium apps: $0/month** 🎉
