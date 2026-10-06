# 🏋️ IronPeak Gym Website

A modern, high-energy fitness gym website with full member management system, built with **Next.js 14**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🚀 Deploy to Vercel (2 Minutes)

### Option A — Vercel CLI
```bash
npm i -g vercel
cd gym-website
vercel
```
Follow the prompts and your site will be live!

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Vercel auto-detects Next.js — just click **Deploy**

---

## 🖥️ Run Locally

```bash
cd gym-website
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📄 Pages

| URL | Description |
|-----|-------------|
| `/` | Public home page (Hero, About, Facilities, Trainers, Pricing, Testimonials, Contact) |
| `/admin` | Admin login — **username:** `admin` / **password:** `gym@2024` |
| `/admin/dashboard` | Dashboard with stats & expiring alerts |
| `/admin/members` | Searchable, sortable member list |
| `/admin/members/add` | Add new member form |
| `/admin/members/[id]/edit` | Edit / renew a member |
| `/admin/workout-plans` | Create & manage workout plans |
| `/member` | Member login (by phone number) |
| `/member/portal` | Member dashboard: status + workout plan |

---

## ⚙️ Features

### Public Website
- 🎨 Dark theme with neon green accents
- 📱 Fully responsive (mobile + desktop)
- ⚡ Smooth hover animations & transitions
- 🖼️ High-quality Unsplash gym photography
- 🗺️ Google Maps embed with dark filter

### Admin Dashboard
- 🔐 Session-based login (admin/gym@2024)
- 📊 Stats: Total / Active / Expiring / Expired members
- ⚠️ **Red alert badges** for memberships expiring within 7 days
- ➕ Add member with: name, phone, plan, start date, photo
- 🗓️ **Auto-calculates end date** from plan (30 / 90 / 365 days)
- ✅ **Auto-updates status** (Active/Expired) on every load
- 🔍 Search + filter by status + sortable columns
- ✏️ Edit or delete any member
- 🏋️ Full workout plan builder (Monday–Sunday)

### Member Portal
- 📲 Login with phone number
- 📅 See membership status, days remaining, start/end dates
- 🏋️ View assigned weekly workout plan
- 📌 Today's workout highlighted at the top
- 📂 Accordion day-by-day exercise view

---

## 💾 Data Storage

All data is stored in **localStorage** (browser) — no database required!  
Perfect for a single front-desk setup. Data persists between sessions on the same browser.

> **Note:** If you need multi-device sync (e.g., staff + front desk + trainer all on different computers), upgrade to [Vercel KV](https://vercel.com/storage/kv) or [Supabase](https://supabase.com) (both have free tiers).

---

## 🎨 Customization

| What | Where |
|------|-------|
| Gym name | `src/app/layout.tsx` + `src/components/Navbar.tsx` + `src/components/Footer.tsx` |
| Accent color | `src/app/globals.css` → `--accent: #39ff14` |
| Admin password | `src/lib/data.ts` → `ADMIN_CREDENTIALS` |
| Pricing | `src/components/HomeSections.tsx` → `plans` array |
| Trainers | `src/components/HomeSections.tsx` → `trainers` array |
| Contact info | `src/components/Footer.tsx` + `HomeSections.tsx` ContactSection |

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Fonts:** Montserrat (Google Fonts)
- **Storage:** localStorage (no backend required)
- **Hosting:** Vercel (recommended)
