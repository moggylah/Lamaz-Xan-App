import BrandLogo from './BrandLogo.jsx';
import { GearIcon } from './Icons.jsx';
import { t } from '../lib/i18n.js';

const titleKeys = {
  qibla: 'tab.qibla',
  azkar: 'tab.azkar',
  calendar: 'tab.calendar',
};

export default function Header({ dates, onSettings, language = 'ru', view = 'prayers' }) {
  if (view === 'prayers') {
    return (
      <header className="app-header app-header-home">
        <div className="brand-row">
          <BrandLogo className="header-logo" />
          <button
            type="button"
            className="icon-button settings-button"
            onClick={onSettings}
            aria-label={t(language, 'aria.settings')}
          >
            <GearIcon size={28} />
          </button>
        </div>

        <div className="date-panel" aria-label={t(language, 'aria.date')}>
          <div className="date-primary">{dates.gregorian}</div>
          <div className="date-secondary">{dates.hijri}</div>
          <div className="date-weekday">{dates.weekday}</div>
        </div>
      </header>
    );
  }

  return (
    <header className="app-header app-header-section">
      <div className="section-brand">
        <BrandLogo variant="mark" className="section-brand-mark" />
        <div className="section-brand-copy">
          <span>Lamaz Xan</span>
          <strong>{t(language, titleKeys[view] || 'tab.prayers')}</strong>
        </div>
      </div>

      <button
        type="button"
        className="icon-button settings-button"
        onClick={onSettings}
        aria-label={t(language, 'aria.settings')}
      >
        <GearIcon size={28} />
      </button>
    </header>
  );
}
