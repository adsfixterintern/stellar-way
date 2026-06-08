This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev# 🌟 Stellar Way — E-Commerce & Delivery Platform

A full-featured e-commerce and delivery management platform built with **Next.js 16**, featuring real-time order tracking, live rider messaging, rider application management, and a comprehensive admin dashboard.

---

## ✨ Features

### 👤 Customer
- Browse products and place orders
- Real-time order tracking with live map view
- Live chat with assigned delivery rider
- Order history and status updates
- QR code support for orders

### 🛵 Rider
- Apply to become a delivery rider
- Accept and manage assigned deliveries
- Real-time location sharing
- In-app messaging with customers
- Delivery history and earnings overview

### 🛡️ Admin
- Full order management dashboard
- Rider application review & approval
- User and rider account management
- Analytics and reporting with charts
- Real-time monitoring of all active deliveries

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth.js |
| Data Fetching | TanStack React Query + Axios |
| Real-time | Socket.IO Client |
| Maps | Leaflet + React Leaflet |
| Charts | Recharts |
| Forms | React Hook Form |
| Animations | Framer Motion, GSAP |
| Notifications | React Hot Toast, SweetAlert2 |
| PDF/Export | jsPDF, html2canvas, modern-screenshot |
| UI Components | Lucide React, React Icons, Swiper |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** / yarn / pnpm / bun

### Installation

```bash
git clone https://github.com/your-username/stellar-way.git
cd stellar-way
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Database
DATABASE_URL=your_database_url

# Socket / Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
stellar-way/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, Register
│   ├── (customer)/         # Customer-facing pages
│   ├── (rider)/            # Rider portal
│   └── admin/              # Admin dashboard
├── components/             # Reusable UI components
├── lib/                    # Utility functions, API clients
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔌 Real-Time Features

Real-time communication is powered by **Socket.IO**. The following events are handled live:

- Order status updates
- Rider location tracking on map
- Customer ↔ Rider messaging
- New order notifications for admins

Make sure your backend Socket.IO server is running and the `NEXT_PUBLIC_SOCKET_URL` is set correctly.

---

## 🗺️ Map & Tracking

Order tracking uses **Leaflet** with **React Leaflet** to display:

- Rider's live location
- Pickup and delivery points
- Route visualization

---

## 🚢 Deployment

### Deploy on Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your repository to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy

### Manual Build

```bash
npm run build
npm run start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

> Built with ❤️ using [Next.js](https://nextjs.org)

pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
