
# 🧩 Monorepo with Bun, Turbo, and Prisma

This monorepo is structured using **Bun** as the runtime, **Turborepo** for task orchestration, and **Prisma** for database management.

## 📁 Folder Structure

```
mobi-trade/
├── apps/
│   ├── api/                  # Backend API (served from root)
│   └── web/                  # Frontend app (served via dev inside web/)
├── docker-compose.yaml       # Service orchestration for local development
├── packages/                 # Shared libraries (optional)
├── package.json              # Root-level config and scripts
├── turbo.json                # Turbo configuration
```

## 📸 Preview

### 🏠 Landing Page

![Landing Page](https://kmjlymleaovyuvintnha.supabase.co/storage/v1/object/public/gallery-images//Screenshot%202025-05-29%20at%205.03.41%20PM.png)

### 📋 Detail Page

![Detail Page](https://kmjlymleaovyuvintnha.supabase.co/storage/v1/object/public/gallery-images//Screenshot%202025-05-29%20at%205.04.03%20PM.png)

### 🛒 Checkout Page

![Checkout Page](https://kmjlymleaovyuvintnha.supabase.co/storage/v1/object/public/gallery-images//Screenshot%202025-05-29%20at%205.04.16%20PM.png)

### 📊 Dashboard Page

![Dashboard Page](https://kmjlymleaovyuvintnha.supabase.co/storage/v1/object/public/gallery-images//Screenshot%202025-05-29%20at%205.12.25%20PM.png)


## 🚀 Getting Started

### Install Dependencies

```bash
bun install
```

## 🧪 Development

### Run only the API

```bash
bun run dev:api
```

### Run only the Web App

```bash
cd apps/web
bun run dev
```

### Run Local DB with Docker

```bash
docker-compose up --build
```

## 🌐 Environment Variables

### API (`apps/api/.env`)

```
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-api-key"
```

### Web (`apps/web/.env`)

```
VITE_APP_URL="your-backend-url"
```

## 🧬 Prisma

### Migrate and Generate

```bash
bun prisma migrate deploy
bun prisma generate
```

> For local development, you may also use:
> 
> ```bash
> bun prisma migrate dev
> ```

### Seed the Database

```bash
bunx tsx prisma/seed.ts
```

## 📦 Runtime & Tools

- Bun: `v1.2.13`
- Node: `>=18`
- Package Manager: **Bun**
- Framework: **Hono**, **React**, **React Router 7**
- Tools: **Turbo**, **Prisma**, **TypeScript**, **Prettier**

## 🔧 Root Scripts (`package.json`)

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "dev:api": "bun run apps/api/index.ts",
    "lint": "turbo run lint",
    "seed": "bun run apps/api/prisma/seed.ts",
    "format": "prettier --write "**/*.{ts,tsx,md}"",
    "prisma:generate": "prisma generate --schema=apps/api/prisma/schema.prisma",
    "check-types": "turbo run check-types"
  }
}
```

## 🚢 Deployment

### API

```bash
bun run apps/api/index.ts
```

### Web App

```bash
cd apps/web
bun run build
bun run start
```

## ✅ Live Demo

**Admin Login:**  
- Email: `admin@mobitrade.com`  
- Password: `admin123`

- API: https://backend-mobitrade.aldinugraha.me  
- Web: https://mobitrade.aldinugraha.me

🕒 Note: Please allow up to 50 seconds for the data to load when accessing the app for the first time. The backend is hosted on Render's free tier, which may cause a delay due to cold starts. Thanks for your patience! 🙏
