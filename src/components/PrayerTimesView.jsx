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
      <div className="next-prayer-card ornament-card">
        <div className="mosque-silhouette" aria-hidden="true">
          <span className="minaret one"/><span className="dome one"/><span className="minaret two"/><span className="dome two"/><span className="minaret three"/>
        </div>
        <span className="next-label">{t(language, 'prayer.next')}</span>
        <strong className="next-name">{t(language, `prayer.${nextFard.key}`)}</strong>
        <span className="countdown-label">{t(language, 'prayer.in')}</span>
        <strong className="countdown">{formatCountdown(nextTime - now)}</strong>
        <span className="next-at">{t(language, 'prayer.until', { time: formatClock(nextTime, timeZone, language) })}</span>
        {mosqueName && <span className="schedule-source">{mosqueName}</span>}
      </div>

      <div className="prayer-list" role="list" aria-label={t(language, 'prayer.schedule')}>
        {rows.map(({ key, type, Icon, subLabelKey }) => {
          const time = times[key];
          const status = getPastStatus(key, time, now, nextFard.key, nextFard.tomorrow);
          return (
            <div role="listitem" className={`prayer-row ${type === 'secondary' ? 'secondary-prayer' : 'fard-prayer'} ${status === 'next' ? 'is-next' : ''}`} key={key}>
              <div className="prayer-title-wrap">
                <span className="prayer-icon"><Icon size={type === 'secondary' ? 19 : 22}/></span>
                <span className="prayer-name-stack"><span className="prayer-name">{t(language, `prayer.${key}`)}</span>{subLabelKey && <small>{t(language, subLabelKey)}</small>}</span>
              </div>
              <div className="prayer-time-wrap">
                <span className="prayer-time-stack">
                  <span className="prayer-time">{formatClock(time, timeZone, language)}</span>
                  {type === 'fard' && iqamahTimes[key] && <small className="iqamah-time">{t(language, 'prayer.iqamah', { time: iqamahTimes[key] })}</small>}
                </span>
                <span className="prayer-status" aria-hidden="true">
                  {status === 'past' ? <CheckIcon size={type === 'secondary' ? 16 : 18}/> : status === 'next' ? <CurrentIcon/> : <EmptyCircleIcon size={type === 'secondary' ? 16 : 18}/>} 
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bottom-ornament" aria-hidden="true"/>
    </section>
  );
}
