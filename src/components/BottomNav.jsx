import {
  CalendarIcon,
  DhikrIcon,
  QiblaIcon,
  TimeIcon,
} from './Icons.jsx';
import { t } from '../lib/i18n.js';

const items = [
  { key: 'prayers', labelKey: 'tab.prayers', Icon: TimeIcon },
  { key: 'qibla', labelKey: 'tab.qibla', Icon: QiblaIcon },
  { key: 'azkar', labelKey: 'tab.azkar', Icon: DhikrIcon },
  { key: 'calendar', labelKey: 'tab.calendar', Icon: CalendarIcon },
];

export default function BottomNav({ view, onChange, language = 'ru' }) {
  return (
    <nav className="bottom-nav" aria-label={t(language, 'aria.sections')}>
      {items.map(({ key, labelKey, Icon }) => {
        const active = view === key;
        return (
          <button
            key={key}
            type="button"
            className={active ? 'active' : ''}
            onClick={() => onChange(key)}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bottom-nav-icon"><Icon size={22} /></span>
            <span className="bottom-nav-label">{t(language, labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
