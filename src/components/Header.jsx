import BrandLogo from './BrandLogo.jsx';
import { GearIcon } from './Icons.jsx';
import { t } from '../lib/i18n.js';

export default function Header({ dates, onSettings, language = 'ru' }) {
  return (
    <header className="app-header">
      <div className="date-stack" aria-label={t(language, 'aria.date')}>
        <div>{dates.gregorian}</div>
        <div>{dates.hijri}</div>
        <div className="weekday">{dates.weekday}</div>
      </div>
      <BrandLogo className="header-logo" />
      <button className="icon-button settings-button" onClick={onSettings} aria-label={t(language, 'aria.settings')}>
        <GearIcon size={31} />
      </button>
    </header>
  );
}
