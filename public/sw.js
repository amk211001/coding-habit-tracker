/*
  Minimal service worker to schedule and show habit reminder notifications.
  Notes:
  - This uses setTimeout while the SW is alive; browsers may suspend SWs. For reliable background schedules when the page is closed, consider Push API or Periodic Background Sync (limited support).
  - Works on secure contexts (HTTPS) and localhost for development.
*/

const SCHEDULES = new Map(); // id -> timeoutId

self.addEventListener('install', event => {
  // Activate immediately so we can receive messages without a reload
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Listen for messages from the page to schedule/cancel notifications
self.addEventListener('message', event => {
  const data = event.data || {};
  if (!data || typeof data !== 'object') return;

  switch (data.type) {
    case 'SCHEDULE_REMINDERS': {
      // eslint-disable-next-line no-console
      console.log('[SW] Received SCHEDULE_REMINDERS', data.payload);
      // data.payload: array of { id, when: epochMs, title, body }
      clearAllSchedules();
      const now = Date.now();
      (data.payload || []).forEach(item => {
        const delay = Math.max(0, item.when - now);
        // If delay is too long, cap at 24h to avoid huge timers
        const cappedDelay = Math.min(delay, 24 * 60 * 60 * 1000);
        trySchedule(item.id, cappedDelay, item.title, item.body);
      });
      break;
    }
    case 'CLEAR_SCHEDULES': {
      // eslint-disable-next-line no-console
      console.log('[SW] Received CLEAR_SCHEDULES');
      clearAllSchedules();
      break;
    }
    default:
      // no-op
      break;
  }
});

function trySchedule(id, delay, title, body) {
  // Best-effort scheduling while SW is active
  const timeoutId = setTimeout(async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('[SW] Showing notification for', id);
      await self.registration.showNotification(title || 'Habit Reminder', {
        body: body || 'Time to complete your habit!',
        icon: '/logo192.png',
        badge: '/logo192.png',
        data: { id, ts: Date.now() },
        tag: `habit-${id}`,
        renotify: false,
      });
    } catch (e) {
      // Notification may fail if permission is missing
      // eslint-disable-next-line no-console
      console.warn('[SW] showNotification failed', e);
    }
  }, delay);
  SCHEDULES.set(id, timeoutId);
}

function clearAllSchedules() {
  SCHEDULES.forEach(tid => clearTimeout(tid));
  SCHEDULES.clear();
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Focus an existing client or open a new one
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        // Focus first visible client
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
      return undefined;
    })()
  );
});
