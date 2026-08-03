/**
 * Notification Service
 * Abstraction layer for Web-Push permission requests, subscription handling, and SW registration.
 */

export interface PushSubscriptionResult {
  success: boolean;
  subscription?: PushSubscription;
  error?: string;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support desktop notifications.');
  }
  return await Notification.requestPermission();
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }
  return await navigator.serviceWorker.register('/sw.js');
}

export async function subscribeUserToPush(): Promise<PushSubscriptionResult> {
  // Placeholder service method - to be implemented with VAPID key exchange
  return { success: false, error: 'Not implemented yet' };
}
