import { useState } from 'react';
import MapPicker from './MapPicker.jsx';
import MosqueSelector from './MosqueSelector.jsx';
import { BackIcon, BellIcon, CalcIcon, ChevronIcon, DownIcon, GlobeIcon, LocationIcon, MosqueIcon } from './Icons.jsx';
import { MADHAB_OPTIONS, METHOD_OPTIONS } from '../lib/prayer.js';
import { NOTIFICATION_ROWS } from '../lib/notifications.js';
import { LANGUAGES, t } from '../lib/i18n.js';

function SettingCard({ Icon, title, subtitle, onClick, expanded }) {
  return (
    <button className={`settings-row-card ${expanded ? 'expanded' : ''}`} onClick={onClick}>
      <span className="settings-leading"><Icon size={27}/></span>
      <span className="settings-text"><strong>{title}</strong><small>{subtitle}</small></span>
      <ChevronIcon size={21} className={expanded ? 'chevron-rotated' : ''}/>
    </button>
  );
}

export default function SettingsView({
  onBack, location, onLocationChange, onUseGps, gpsStatus, timeZone, method, onMethodChange, madhab, onMadhabChange,
  selectedMosque, onMosqueSelect, onMosqueClear, mosqueScheduleStatus, duhaOffset, onDuhaOffsetChange,
  notificationPrefs, onNotificationPrefsChange, notificationPermission, onRequestNotifications,
  language = 'ru', onLanguageChange,
}) {
  const [open, setOpen] = useState(null);
  const toggle = (name) => setOpen((current) => current === name ? null : name);
  const methodLabel = t(language, `method.${method}`);
  const mosqueSubtitle = selectedMosque?.name || (mosqueScheduleStatus === 'loading' ? t(language, 'settings.updating') : t(language, 'settings.noMosque'));

  return (
    <section className="settings-screen">
      <div className="settings-topbar">
        <button className="icon-button back-button" onClick={onBack} aria-label={t(language, 'aria.back')}><BackIcon/></button>
        <h1>{t(language, 'settings.title')}</h1><span className="topbar-spacer"/>
      </div>
      <div className="settings-top-pattern" aria-hidden="true"/>

      <div className="settings-cards">
        <SettingCard Icon={LocationIcon} title={t(language, 'settings.location')} subtitle={`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`} onClick={() => toggle('location')} expanded={open === 'location'}/>
        {open === 'location' && (
          <div className="settings-panel location-panel">
            <button className="primary-action" onClick={onUseGps}>{gpsStatus === 'loading' ? t(language, 'settings.detecting') : t(language, 'settings.useCurrent')}</button>
            {gpsStatus === 'error' && <p className="panel-error">{t(language, 'settings.gpsError')}</p>}
            <div className="map-frame"><MapPicker location={location} onChange={onLocationChange} language={language}/></div>
            <div className="coordinate-fields">
              <label>{t(language, 'settings.latitude')}<input type="number" step="0.000001" value={location.lat} onChange={(e) => onLocationChange({ ...location, lat: Number(e.target.value) })}/></label>
              <label>{t(language, 'settings.longitude')}<input type="number" step="0.000001" value={location.lng} onChange={(e) => onLocationChange({ ...location, lng: Number(e.target.value) })}/></label>
            </div>
            <p className="timezone-line">{t(language, 'settings.timezone', { zone: timeZone })}</p>
          </div>
        )}

        <SettingCard Icon={CalcIcon} title={t(language, 'settings.calculationMethod')} subtitle={methodLabel} onClick={() => toggle('method')} expanded={open === 'method'}/>
        {open === 'method' && (
          <div className="settings-panel form-panel">
            <label>{t(language, 'settings.method')}
              <select value={method} onChange={(e) => onMethodChange(e.target.value)}>{METHOD_OPTIONS.map((item) => <option key={item.value} value={item.value}>{t(language, `method.${item.value}`)}</option>)}</select>
            </label>
            <label>{t(language, 'settings.asrMethod')}
              <select value={madhab} onChange={(e) => onMadhabChange(e.target.value)}>{MADHAB_OPTIONS.map((item) => <option key={item.value} value={item.value}>{t(language, `madhab.${item.value}`)}</option>)}</select>
            </label>
            <label>{t(language, 'settings.duhaOffset')}
              <input type="number" min="10" max="60" value={duhaOffset} onChange={(e) => onDuhaOffsetChange(Number(e.target.value))}/>
            </label>
          </div>
        )}

        <SettingCard Icon={MosqueIcon} title={t(language, 'settings.mosqueSchedule')} subtitle={mosqueSubtitle} onClick={() => toggle('mosque')} expanded={open === 'mosque'}/>
        {open === 'mosque' && (
          <div className="settings-panel">
            <MosqueSelector selectedMosque={selectedMosque} onSelect={onMosqueSelect} onClear={onMosqueClear} onLocationDetected={onLocationChange} language={language}/>
            {mosqueScheduleStatus === 'error' && <p className="panel-error">{t(language, 'settings.mosqueUpdateError')}</p>}
          </div>
        )}

        <SettingCard Icon={BellIcon} title={t(language, 'settings.notifications')} subtitle={notificationPrefs.enabled && notificationPermission === 'granted' ? t(language, 'settings.enabled') : t(language, 'settings.disabled')} onClick={() => toggle('notifications')} expanded={open === 'notifications'}/>
        {open === 'notifications' && (
          <div className="settings-panel notification-panel">
            {notificationPermission !== 'granted' ? (
              <button className="primary-action" onClick={onRequestNotifications}>{notificationPermission === 'denied' ? t(language, 'settings.permissionBlocked') : t(language, 'settings.allowNotifications')}</button>
            ) : (
              <label className="notification-master">
                <span><strong>{t(language, 'settings.notifications')}</strong><small>{t(language, 'settings.notificationReminders')}</small></span>
                <input type="checkbox" checked={Boolean(notificationPrefs.enabled)} onChange={(e) => onNotificationPrefsChange((current) => ({ ...current, enabled: e.target.checked }))}/>
              </label>
            )}

            <label className="notification-toggle vibration-toggle">
              <span>
                <strong>{t(language, 'settings.vibration')}</strong>
                <small>{t(language, 'settings.vibrationHint')}</small>
              </span>
              <input
                type="checkbox"
                checked={notificationPrefs.vibration !== false}
                onChange={(e) => onNotificationPrefsChange((current) => ({ ...current, vibration: e.target.checked }))}
              />
            </label>

            <label className="selector-label">{t(language, 'settings.whenNotify')}
              <select value={notificationPrefs.leadMinutes} onChange={(e) => onNotificationPrefsChange((current) => ({ ...current, leadMinutes: Number(e.target.value) }))}>
                <option value="0">{t(language, 'settings.atTime')}</option>
                {[5,10,15,30].map((minutes) => <option key={minutes} value={minutes}>{t(language, 'settings.minutesBefore', { minutes })}</option>)}
              </select>
            </label>

            <div className="notification-list">
              {NOTIFICATION_ROWS.map((row) => (
                <label className="notification-toggle" key={row.key}>
                  <span><strong>{t(language, `prayer.${row.key}`)}</strong>{row.detailKey && <small>{t(language, row.detailKey)}</small>}</span>
                  <input type="checkbox" checked={Boolean(notificationPrefs.prayers?.[row.key])} onChange={(e) => onNotificationPrefsChange((current) => ({ ...current, prayers: { ...current.prayers, [row.key]: e.target.checked } }))}/>
                </label>
              ))}
            </div>
            {notificationPermission === 'denied' && <p className="panel-error">{t(language, 'settings.permissionDenied')}</p>}
            <p className="notification-note">{t(language, 'settings.notificationNote')}</p>
          </div>
        )}
      </div>

      <h2 className="language-title">{t(language, 'settings.chooseLanguage')}</h2>
      <div className="language-card">
        <span className="settings-leading"><GlobeIcon size={26}/></span>
        <select className="language-select" value={language} onChange={(e) => onLanguageChange(e.target.value)} aria-label={t(language, 'settings.chooseLanguage')}>
          {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
        </select>
        <DownIcon size={20}/>
      </div>
    </section>
  );
}
