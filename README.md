# Kinetotherapist PWA — Business, Agenda & Patient Management

A custom Progressive Web Application (PWA) tailored specifically for a kinetotherapist to manage her daily schedule, business operations, patient medical records, and automated push notifications.

---

## 1. Project Overview
This application serves as an all-in-one management platform for a kinetotherapist. It provides an intuitive agenda calendar, patient profile tracking, session logs, and automated reminder alerts. Designed as a PWA, it supports offline capabilities, mobile home-screen installation, and native Web-Push notifications directly to the device.

---

## 2. Tech Stack Breakdown

- **Astro (SSR Mode):** Modern high-performance web framework configured with `@astrojs/vercel` serverless adapter for fast dynamic server-side rendering and deployment on Vercel.
- **Convex:** Real-time serverless database, backend function platform, and scheduler. Eliminates external cron infrastructure and handles data synchronization, schedule logic, and backend actions natively.
- **Tailwind CSS:** Utility-first CSS framework for crafting a responsive, clean, accessible UI design system.
- **GSAP (GreenSock Animation Platform):** High-performance animation library used for fluid UI micro-interactions, page transitions, and interactive schedule views.
- **Web-Push & VAPID:** Standardized Web-Push API using `web-push` Node module on Convex Node actions and standard Service Worker (`sw.js`) on the client.
- **Vercel:** Deployment platform for host assets and Astro SSR edge runtime functions.

---

## 3. Architecture Rules & Notification Workflow

### Native Web-Push System Architecture
We intentionally **do not** use Firebase Cloud Messaging (FCM) or external third-party scheduling tools. Instead, we leverage Convex's native scheduling capabilities.

1. **Appointment Creation:**
   - When an appointment is scheduled in Convex (`convex/appointments.ts`), a mutation schedules a execution task using `ctx.scheduler.runAt()`.
2. **Precision Execution (T-10 Minutes):**
   - Convex executes the scheduled task exactly **10 minutes before** the appointment start time.
3. **Internal Node Action:**
   - The scheduled timer calls a Convex Node Action (`convex/push.ts`).
   - The action uses the `web-push` library combined with standard VAPID keys (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`) stored in Convex environment variables.
4. **Service Worker Push Listener (`public/sw.js`):**
   - The payload is dispatched to the push service endpoint.
   - The registered client-side Service Worker receives the `push` event and invokes `self.registration.showNotification()`.

---

## 4. Developer Work Split

This repository is maintained by a 2-person development team with clear domain boundaries:

### **Person A — Frontend Architect (`src/` & `public/`)**
- **Responsibilities:**
  - Build UI layout structure, responsive components, and pages inside `src/pages/` and `src/components/`.
  - Implement smooth page transitions and calendar interaction using GSAP.
  - Setup and maintain PWA configuration (`public/manifest.json`, icon assets in `public/icons/`).
  - Write client-side Service Worker logic (`public/sw.js`) to register push event listeners.
  - Write browser permission helper (`src/lib/web-push.ts`) to request notification permissions and register `PushSubscription` with the backend.

### **Person B — Backend Architect (`convex/`)**
- **Responsibilities:**
  - Design database schema in `convex/schema.ts` (patients, appointments, push subscriptions, medical records).
  - Implement queries and mutations in `convex/appointments.ts`.
  - Configure scheduled jobs and weekly preparation logic in `convex/crons.ts`.
  - Implement Web-Push payload builder and dispatch logic in `convex/push.ts` using Node runtime environment.
  - Manage Convex environment variables and VAPID key configuration.

---

## 5. Local Setup Instructions

### Prerequisites
- Node.js (v20+ recommended)
- npm package manager

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RobertGyorgy/pwa-calendar.git
   cd "pwa calendar kineto"
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Initialize Convex Environment:**
   Run the Convex development server initialization in one terminal window:
   ```bash
   npx convex dev
   ```
   *(Follow prompt to sign in / select workspace and create local `.env.local` bindings).*

4. **Start Astro Development Server:**
   In a second terminal window, run:
   ```bash
   npm run dev
   ```

5. **Access Application:**
   Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## 6. Directory Structure Reference

```
/
├── public/                 
│   ├── icons/              # PWA App Icons
│   ├── manifest.json       # Web App Manifest
│   └── sw.js               # Service Worker (Push listener & Offline handler)
├── convex/                 
│   ├── schema.ts           # Convex Database Schema definition
│   ├── appointments.ts     # Appointment & Patient Queries / Mutations
│   ├── crons.ts            # Recurring weekly cron definitions
│   └── push.ts             # Node.js internalAction executing Web-Push notifications
├── src/
│   ├── components/         
│   │   ├── layout/         # Header, Navigation, Sidebar components
│   │   └── ui/             # Reusable UI widgets & buttons
│   ├── layouts/
│   │   └── DashboardLayout.astro # Primary application wrapper layout
│   ├── lib/                
│   │   └── web-push.ts     # Frontend Push subscription & permission handler
│   ├── pages/              
│   │   ├── dashboard/      # Agenda calendar and patient management routes
│   │   ├── login.astro     # Authentication page
│   │   └── index.astro     # Root application landing page
│   ├── styles/
│   │   └── global.css      # Tailwind base CSS directives
│   └── env.d.ts            # TypeScript environment definitions
├── astro.config.mjs        # Astro configuration (Vercel SSR + Tailwind)
├── tailwind.config.mjs     # Tailwind CSS theme extension & configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Architecture documentation map
```
