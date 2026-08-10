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
      {items.map(({ key, labelKey, Icon }) => (
        <button
          key={key}
          type="button"
          className={view === key ? 'active' : ''}
          onClick={() => onChange(key)}
        >
          <Icon size={23} />
          <span>{t(language, labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
