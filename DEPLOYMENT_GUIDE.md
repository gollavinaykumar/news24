# 🚀 News97 — Free Cloud Deployment Guide

This guide covers how to deploy your **News97** full-stack application (Next.js client + Express/Prisma server + PostgreSQL) entirely on **free-tier** cloud services.

---

## 📦 Architecture Overview

| Component    | Technology               | Recommended Free Host          |
|-------------|--------------------------|--------------------------------|
| **Frontend** | Next.js 16 (React 19)    | Vercel (free tier)             |
| **Backend**  | Express 5 + Prisma 7     | Render (free tier)             |
| **Database** | PostgreSQL               | Supabase (free tier) or Neon   |
| **Media**    | Cloudinary / AWS S3       | Cloudinary (free tier)         |

```mermaid
graph LR
    A[Vercel - Frontend] -->|API calls| B[Render - Backend]
    B -->|Prisma ORM| C[Supabase / Neon - PostgreSQL]
    B -->|Image uploads| D[Cloudinary]
```

---

## 🗄️ Step 1: Set Up Free PostgreSQL Database

You have two excellent free options:

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project** → choose a name and password → select a region close to you
3. After the project is created, go to **Settings → Database**
4. Copy the **Connection string (URI)** — it looks like:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. Use the **Transaction mode** connection string (port `6543`) for best performance with Prisma

> [!TIP]
> Supabase free tier includes **500 MB** database storage and **unlimited API requests**. More than enough for a news site.

### Option B: Neon

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project → copy the connection string
3. Neon free tier includes **0.5 GB** storage and auto-suspend after inactivity

---

## ⚙️ Step 2: Deploy the Backend on Render

[Render](https://render.com) offers a free tier for web services.

### 2.1 Prepare the Server

Make sure your `server/package.json` has the correct build and start scripts (already done ✅):

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### 2.2 Add a Render Build Script

Create a file `server/render-build.sh`:

```bash
#!/usr/bin/env bash
set -o errexit

npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

Make it executable locally:
```bash
chmod +x server/render-build.sh
```

### 2.3 Create the Render Service

1. Push your code to **GitHub**
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:

| Setting              | Value                       |
|----------------------|-----------------------------|
| **Name**             | `news97-api`                |
| **Root Directory**   | `server`                    |
| **Runtime**          | `Node`                      |
| **Build Command**    | `./render-build.sh`         |
| **Start Command**    | `npm start`                 |
| **Instance Type**    | `Free`                      |

5. Add **Environment Variables**:

| Variable            | Value                                               |
|---------------------|-----------------------------------------------------|
| `DATABASE_URL`      | Your PostgreSQL connection string from Step 1        |
| `JWT_SECRET`        | A random secret string (e.g. `openssl rand -hex 32`)|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name                      |
| `CLOUDINARY_API_KEY`    | Your Cloudinary API key                          |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret                       |
| `CLIENT_URL`        | Your Vercel frontend URL (add after Step 3)          |
| `PORT`              | `10000` (Render default)                             |
| `NODE_ENV`          | `production`                                         |

6. Click **Create Web Service**

> [!IMPORTANT]
> Render free tier services **spin down after 15 minutes** of inactivity. The first request after spin-down takes ~30–60 seconds. This is normal on free tier.

> [!TIP]
> Your Render URL will be something like `https://news97-api.onrender.com`. Save this for the next step.

---

## 🌐 Step 3: Deploy the Frontend on Vercel

[Vercel](https://vercel.com) is the creator of Next.js and the best free option for deploying it.

### 3.1 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up** with GitHub
2. Click **Add New Project** → Import your `news97` repo
3. Configure:

| Setting              | Value                                        |
|----------------------|----------------------------------------------|
| **Framework Preset** | `Next.js` (auto-detected)                    |
| **Root Directory**   | `client`                                     |
| **Build Command**    | `next build` (default)                       |
| **Output Directory** | `.next` (default)                            |

4. Add **Environment Variables**:

| Variable                      | Value                                           |
|-------------------------------|------------------------------------------------|
| `NEXT_PUBLIC_API_URL`          | `https://news97-api.onrender.com/api`          |

5. Click **Deploy**

> [!TIP]
> Vercel free tier includes **100 GB bandwidth/month**, **serverless functions**, automatic HTTPS, and global CDN. Perfect for a news website.

---

## 🖼️ Step 4: Set Up Cloudinary (Free Media Storage)

1. Go to [cloudinary.com](https://cloudinary.com) → sign up
2. From the Dashboard, copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Add these to your Render environment variables (Step 2.3)

> [!NOTE]
> Cloudinary free tier includes **25 GB** storage and **25 GB** bandwidth/month — plenty for article images.

---

## 🔄 Step 5: Run Prisma Migrations & Seed Data

After your Render service is deployed, you need to set up the database schema.

### Option A: Automatic via Render (Recommended)

The `render-build.sh` script already runs `prisma migrate deploy` during each build. For the initial deployment, this automatically creates all tables.

### Option B: Seed Data Manually

To seed initial data (admin user, categories, etc.), use the Render **Shell**:

1. Go to your Render service → **Shell** tab
2. Run:
   ```bash
   npx ts-node src/seed.ts
   ```

> [!CAUTION]
> Only seed once on the production database. Running the seed script multiple times may create duplicate data.

---

## 🔗 Step 6: Connect Frontend & Backend

After both are deployed, update the environment variables to point to each other:

1. **On Render** (Backend): Set `CLIENT_URL` to your Vercel URL
   ```
   https://your-app.vercel.app
   ```

2. **On Vercel** (Frontend): Ensure `NEXT_PUBLIC_API_URL` points to your Render URL
   ```
   https://news97-api.onrender.com/api
   ```

3. Redeploy both services for changes to take effect.

---

## 🌍 Step 7: Custom Domain (Optional, Free)

### On Vercel (Frontend)
1. Go to **Project Settings → Domains**
2. Add your custom domain (e.g. `news97.com`)
3. Update DNS records as instructed (CNAME or A record)

### On Render (Backend)
1. Go to **Service Settings → Custom Domains**
2. Add your API subdomain (e.g. `api.news97.com`)
3. Update DNS records as instructed

---

## 📋 Free Tier Limits Summary

| Service       | Key Limits                                              | Cost   |
|---------------|---------------------------------------------------------|--------|
| **Vercel**    | 100 GB bandwidth, 100 hours serverless, auto HTTPS      | **$0** |
| **Render**    | 750 hours/month, spins down after 15 min idle           | **$0** |
| **Supabase**  | 500 MB DB, 1 GB file storage, 50K monthly active users  | **$0** |
| **Neon**      | 0.5 GB storage, auto-suspend, 191 compute hours         | **$0** |
| **Cloudinary**| 25 GB storage, 25 GB bandwidth                          | **$0** |

> **Total monthly cost: $0** 🎉

---

## 🛠️ Deployment Checklist

Use this checklist to track your progress:

- [ ] Create a PostgreSQL database (Supabase or Neon)
- [ ] Copy the `DATABASE_URL` connection string
- [ ] Push code to GitHub
- [ ] Create Render web service for the backend
- [ ] Set all backend environment variables on Render
- [ ] Verify backend is running (`https://your-api.onrender.com`)
- [ ] Create Vercel project for the frontend
- [ ] Set `NEXT_PUBLIC_API_URL` on Vercel
- [ ] Verify frontend is running and connected to backend
- [ ] Seed the database with initial data
- [ ] (Optional) Add custom domains

---

## ❓ Troubleshooting

### Backend takes long to respond
This is normal on Render free tier — services spin down after 15 min of inactivity. The first request after idle takes 30-60 seconds.

### Database connection errors
- Make sure you're using the correct connection string format
- For Supabase, use the **Transaction/Pooler** connection (port `6543`)
- Check that `DATABASE_URL` is correctly set in Render environment variables

### CORS errors
Make sure your backend CORS config includes your Vercel URL:
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### Build failures on Render
- Check the build logs in the Render dashboard
- Make sure `prisma generate` runs before `tsc`
- Ensure all dependencies are in `dependencies` (not just `devDependencies`)

### Images not loading
- Verify Cloudinary environment variables are set correctly on Render
- Check that your Cloudinary account hasn't exceeded the free tier limits

---

## 🔁 CI/CD — Automatic Deployments

Both **Vercel** and **Render** support automatic deployments from GitHub:

- **Every push to `main`** triggers a new deployment on both platforms
- No manual steps needed after initial setup
- Preview deployments on Vercel for PRs (built-in feature)

---

> **You now have a fully deployed, production-ready news website running entirely for free!** 🎉
