import { formatClock } from './date.js';
import { t } from './i18n.js';

export const DEFAULT_NOTIFICATION_PREFS = {
  enabled: false,
  leadMinutes: 0,
  prayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true, qiyam: false },
};

export const NOTIFICATION_ROWS = [
  { key: 'fajr' }, { key: 'dhuhr' }, { key: 'asr' }, { key: 'maghrib' }, { key: 'isha' },
  { key: 'qiyam', detailKey: 'notification.lastThirdStart' },
];

function readSent() {
  try { return JSON.parse(localStorage.getItem('lamaz-notifications-sent') || '{}'); }
  catch { return {}; }
}

function writeSent(value) {
  try { localStorage.setItem('lamaz-notifications-sent', JSON.stringify(value)); }
  catch { /* Ignore storage restrictions. */ }
}

async function displayNotification(title, options) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false;
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return true;
    } catch { /* Fallback below. */ }
  }
  try { new Notification(title, options); return true; }
  catch { return false; }
}

export async function sendDueNotifications({ times, prefs, now, timeZone, mosqueName = '', language = 'ru' }) {
  if (!prefs?.enabled || !times || !('Notification' in window) || Notification.permission !== 'granted') return;

  const leadMinutes = Number(prefs.leadMinutes) || 0;
  const sent = readSent();
  const nowMs = now.getTime();
  const staleBefore = nowMs - 3 * 24 * 60 * 60 * 1000;
  for (const [tag, timestamp] of Object.entries(sent)) if (Number(timestamp) < staleBefore) delete sent[tag];

  for (const row of NOTIFICATION_ROWS) {
    if (!prefs.prayers?.[row.key]) continue;
    const prayerTime = times[row.key];
    if (!(prayerTime instanceof Date) || Number.isNaN(prayerTime.getTime())) continue;

    const notifyAt = prayerTime.getTime() - leadMinutes * 60_000;
    const delta = nowMs - notifyAt;
    if (delta < 0 || delta > 120_000) continue;

    const tag = `lamaz-${row.key}-${prayerTime.getTime()}-${leadMinutes}`;
    if (sent[tag]) continue;

    const when = formatClock(prayerTime, timeZone, language);
    const prayerLabel = t(language, `prayer.${row.key}`);
    const title = row.key === 'qiyam'
      ? t(language, 'notification.lastThirdStarted')
      : leadMinutes > 0
        ? t(language, 'notification.inMinutes', { prayer: prayerLabel, minutes: leadMinutes })
        : t(language, 'notification.prayerTime', { prayer: prayerLabel });

    const bodyParts = [
      row.key === 'qiyam' ? t(language, 'notification.start', { time: when }) : t(language, 'notification.time', { time: when }),
      mosqueName && row.key !== 'qiyam' ? mosqueName : '',
    ].filter(Boolean);

    const shown = await displayNotification(title, {
      body: bodyParts.join(' · '), tag, icon: '/app-icon-192.png', badge: '/app-icon-192.png', data: { url: '/' },
    });
    if (shown) sent[tag] = nowMs;
  }
  writeSent(sent);
}
