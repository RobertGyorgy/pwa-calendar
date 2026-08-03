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

## 3. Architectural Constitution & Modularity Rules

Both developers must strictly adhere to the following 4 Architectural Constitution rules for all features:

### Rule 1: The Service Layer (Logic Abstraction)
UI components (`.astro`, `.tsx`, etc.) must **NEVER** contain raw business logic, direct fetch calls, or raw Convex client instantiations.
- **Location:** `src/lib/services/`
- **Files:** `appointmentService.ts`, `patientService.ts`, `notificationService.ts`
- **Principle:** If the backend database or notification mechanism changes, only the `services/` layer is updated — never the UI components.

### Rule 2: Design System & Strict Semantic Theming
**NO arbitrary hex colors or hardcoded utility colors** are allowed in markup (e.g. `bg-[#ff8800]` or `text-blue-500` are forbidden).
- All colors, surfaces, borders, and text states use semantic design tokens defined in `src/styles/global.css` and mapped in `tailwind.config.mjs`.
- **Allowed Class Syntax Examples:**
  - `bg-brand-primary`, `bg-brand-accent`
  - `bg-surface-card`, `bg-surface-base`, `bg-surface-panel`
  - `text-text-main`, `text-text-muted`
  - `border-border-subtle`

### Rule 3: UI Modularity & Component Architecture
No monolithic layout files (keep files focused under 150-200 lines). Follow the Single Responsibility Principle:
- `src/components/ui/` → Reusable dumb primitive components (`Button.astro`, `Card.astro`, `Badge.astro`).
- `src/components/features/` → Smart components combining primitives and invoking the Service Layer (`features/agenda/AppointmentCard.astro`, `features/patients/PatientList.astro`).
- `src/components/layout/` → Structural layout containers (`Sidebar.astro`, `Header.astro`).

### Rule 4: Centralized Constants
No magic strings or hardcoded numbers anywhere in the codebase.
- **Location:** `src/lib/constants.ts`
- All timing thresholds (e.g., `NOTIFICATION_LEAD_TIME_MS`), route paths (`ROUTES`), storage keys (`STORAGE_KEYS`), and configuration flags are defined here and imported.

---

## 4. Architecture Rules & Notification Workflow

### Native Web-Push System Architecture
We intentionally **do not** use Firebase Cloud Messaging (FCM) or external third-party scheduling tools. Instead, we leverage Convex's native scheduling capabilities.

1. **Appointment Creation:**
   - When an appointment is scheduled in Convex (`convex/appointments.ts`), a mutation schedules an execution task using `ctx.scheduler.runAt()`.
2. **Precision Execution (T-10 Minutes):**
   - Convex executes the scheduled task exactly **10 minutes before** the appointment start time.
3. **Internal Node Action:**
   - The scheduled timer calls a Convex Node Action (`convex/push.ts`).
   - The action uses the `web-push` library combined with standard VAPID keys (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`) stored in Convex environment variables.
4. **Service Worker Push Listener (`public/sw.js`):**
   - The payload is dispatched to the push service endpoint.
   - The registered client-side Service Worker receives the `push` event and invokes `self.registration.showNotification()`.

---

## 5. Developer Work Split

This repository is maintained by a 2-person development team with clear domain boundaries:

### **Person A — Frontend Architect (`src/` & `public/`)**
- **Responsibilities:**
  - Build UI layout structure, responsive components, and pages inside `src/pages/` and `src/components/`.
  - Implement smooth page transitions and calendar interaction using GSAP.
  - Setup and maintain PWA configuration (`public/manifest.json`, icon assets in `public/icons/`).
  - Write client-side Service Worker logic (`public/sw.js`) to register push event listeners.
  - Implement UI calls via the Service Layer (`src/lib/services/`).

### **Person B — Backend Architect (`convex/`)**
- **Responsibilities:**
  - Design database schema in `convex/schema.ts` (patients, appointments, push subscriptions, medical records).
  - Implement queries and mutations in `convex/appointments.ts`.
  - Configure scheduled jobs and weekly preparation logic in `convex/crons.ts`.
  - Implement Web-Push payload builder and dispatch logic in `convex/push.ts` using Node runtime environment.
  - Manage Convex environment variables and VAPID key configuration.

---

## 6. Local Setup Instructions

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

4. **Start Astro Development Server:**
   In a second terminal window, run:
   ```bash
   npm run dev
   ```

5. **Access Application:**
   Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## 7. Directory Structure Reference

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
│   │   ├── features/       # Smart feature-driven UI components
│   │   ├── layout/         # Structural header/sidebar/navigation components
│   │   └── ui/             # Reusable UI primitives (Button, Card, Badge)
│   ├── layouts/
│   │   └── DashboardLayout.astro # Primary application wrapper layout
│   ├── lib/                
│   │   ├── services/       # Abstraction layer (appointment, patient, notification services)
│   │   ├── constants.ts    # Centralized timing thresholds, routes, and config
│   │   └── web-push.ts     # Frontend Push subscription & permission handler
│   ├── pages/              
│   │   ├── dashboard/      # Agenda calendar and patient management routes
│   │   ├── login.astro     # Authentication page
│   │   └── index.astro     # Root application landing page
│   ├── styles/
│   │   └── global.css      # Semantic design tokens & Tailwind base directives
│   └── env.d.ts            # TypeScript environment definitions
├── astro.config.mjs        # Astro configuration (Vercel SSR + Tailwind)
├── tailwind.config.mjs     # Semantic theme extension & Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Architecture & Constitution documentation map
```
