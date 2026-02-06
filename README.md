# Skrooge - Australia's Best Deal Aggregator 🦘

Skrooge is a modern, full-stack deal aggregation platform built for the Australian market. It tracks prices, consolidates deals from major retailers (Amazon, Coles, Woolworths) and community sites (OzBargain), and provides a premium user experience.

![Skrooge Banner](/public/logo.png)

## Tech Stack 🛠️

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Styling**: Tailwind CSS + Custom Design System
- **Auth**: NextAuth.js (Google + Credentials)
- **Deployment**: Vercel

## Key Features 🚀

- **Deal Aggregation**: Real-time scraping and normalization.
- **Price Tracking**: Historical price data visualization.
- **Smart Alerts**: Custom Toast notification system.
- **Community**: Voting, commenting, and deal sharing.
- **Admin Dashboard**: Manual control for scrapers and data.

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/Innaialok/Skrooge-C.git
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up Environment**
   Create a `.env` file with:
   ```env
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="your-secret"
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Deployment

Deploy easily to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FInnaialok%2FSkrooge-C)

