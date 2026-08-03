/**
 * Centralized Application Constants
 * Strictly no magic strings or magic numbers allowed in components or services.
 */

// Timing Thresholds
export const NOTIFICATION_LEAD_TIME_MS = 10 * 60 * 1000; // 10 minutes prior to appointment
export const DEFAULT_SESSION_DURATION_MS = 50 * 60 * 1000; // 50 minutes standard therapy session

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  AGENDA: '/dashboard/agenda',
  PATIENTS: '/dashboard/patients',
} as const;

// App Configuration & Service Worker
export const SW_SCOPE = '/';
export const SW_SCRIPT_URL = '/sw.js';

// Local Storage Keys
export const STORAGE_KEYS = {
  PUSH_SUBSCRIPTION: 'kineto_push_subscription',
  THEME_MODE: 'kineto_theme_mode',
} as const;
