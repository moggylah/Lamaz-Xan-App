import {
  CheckIcon, CurrentIcon, EmptyCircleIcon, MoonIcon, StarIcon, SunIcon, SunriseIcon, SunsetIcon,
} from './Icons.jsx';
import { formatClock } from '../lib/date.js';
import { getPastStatus } from '../lib/prayer.js';
import { t } from '../lib/i18n.js';

const rows = [
  { key: 'fajr', type: 'fard', Icon: SunriseIcon },
  { key: 'sunrise', type: 'secondary', Icon: SunriseIcon },
  { key: 'duha', type: 'secondary', Icon: SunIcon },
  { key: 'dhuhr', type: 'fard', Icon: SunIcon },
  { key: 'asr', type: 'fard', Icon: SunriseIcon },
  { key: 'maghrib', type: 'fard', Icon: SunsetIcon },
  { key: 'isha', type: 'fard', Icon: MoonIcon },
  { key: 'qiyam', type: 'secondary', Icon: StarIcon, subLabelKey: 'prayer.lastThird' },
];

function formatCountdown(ms) {
  const safe = Math.max(0, ms);
  const total = Math.floor(safe / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

export default function PrayerTimesView({ times, timeZone, now, nextFard, iqamahTimes = {}, mosqueName = '', language = 'ru' }) {
  const nextTime = nextFard.time;

  return (
    <section className="prayer-screen">
      <div className="next-prayer-card">
        <div className="next-prayer-copy">
          <span className="next-label">{t(language, 'prayer.next')}</span>
          <strong className="next-name">{t(language, `prayer.${nextFard.key}`)}</strong>
          <span className="next-at">{t(language, 'prayer.until', { time: formatClock(nextTime, timeZone, language) })}</span>
        </div>

        <div className="next-prayer-countdown">
          <span className="countdown-label">{t(language, 'prayer.in')}</span>
          <strong className="countdown">{formatCountdown(nextTime - now)}</strong>
        </div>

        <div className="next-prayer-watermark" aria-hidden="true">
          <MoonIcon size={112} />
        </div>
      </div>

      <div className="schedule-heading">
        <div>
          <strong>{t(language, 'prayer.schedule')}</strong>
          {mosqueName && <span>{mosqueName}</span>}
        </div>
        {mosqueName && <span className="schedule-source-dot" aria-hidden="true" />}
      </div>

      <div className="prayer-list" role="list" aria-label={t(language, 'prayer.schedule')}>
        {rows.map(({ key, type, Icon, subLabelKey }) => {
          const time = times[key];
          const status = getPastStatus(key, time, now, nextFard.key, nextFard.tomorrow);

          return (
            <div
              role="listitem"
              className={`prayer-row ${type === 'secondary' ? 'secondary-prayer' : 'fard-prayer'} ${status === 'next' ? 'is-next' : ''}`}
              key={key}
            >
              <div className="prayer-title-wrap">
                <span className="prayer-icon"><Icon size={type === 'secondary' ? 18 : 21} /></span>
                <span className="prayer-name-stack">
                  <span className="prayer-name">{t(language, `prayer.${key}`)}</span>
                  {subLabelKey && <small>{t(language, subLabelKey)}</small>}
                </span>
              </div>

              <div className="prayer-time-wrap">
                <span className="prayer-time-stack">
                  <span className="prayer-time">{formatClock(time, timeZone, language)}</span>
                  {type === 'fard' && iqamahTimes[key] && (
                    <small className="iqamah-time">{t(language, 'prayer.iqamah', { time: iqamahTimes[key] })}</small>
                  )}
                </span>

                <span className="prayer-status" aria-hidden="true">
                  {status === 'past'
                    ? <CheckIcon size={type === 'secondary' ? 15 : 17} />
                    : status === 'next'
                      ? <CurrentIcon size={17} />
                      : <EmptyCircleIcon size={type === 'secondary' ? 15 : 17} />}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
