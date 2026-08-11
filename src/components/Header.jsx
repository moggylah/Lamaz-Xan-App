import { useEffect, useState } from 'react';
import BrandLogo from './BrandLogo.jsx';
import { BackIcon, GearIcon } from './Icons.jsx';
import { t } from '../lib/i18n.js';

const titleKeys = {
  qibla: 'tab.qibla',
  azkar: 'tab.azkar',
  calendar: 'tab.calendar',
};

export default function Header({ dates, onSettings, onHome, language = 'ru', view = 'prayers' }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (view === 'prayers') {
      setScrolled(false);
      return undefined;
    }

    const updateScrollState = () => setScrolled(window.scrollY > 64);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, [view]);

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
      <div className="section-back-slot">
        <button
          type="button"
          className={`icon-button section-back-button ${scrolled ? 'is-floating' : ''}`}
          onClick={onHome}
          aria-label={t(language, 'tab.prayers')}
        >
          <BackIcon size={25} />
        </button>
      </div>

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
