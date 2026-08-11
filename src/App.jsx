import { useEffect, useMemo, useState } from 'react';
import tzLookup from 'tz-lookup';
import Header from './components/Header.jsx';
import PrayerTimesView from './components/PrayerTimesView.jsx';
import QiblaCompass from './components/QiblaCompass.jsx';
import SettingsView from './components/SettingsView.jsx';
import BottomNav from './components/BottomNav.jsx';
import CalendarView from './components/CalendarView.jsx';
import AzkarView from './components/AzkarView.jsx';
import { addCalendarDays, getDateDisplay, getLocalDateParts } from './lib/date.js';
import { calculatePrayerData, getLastThirdStart, getNextFard } from './lib/prayer.js';
import { DEFAULT_NOTIFICATION_PREFS, sendDueNotifications } from './lib/notifications.js';
import {
  extractMosqueDay,
  getMosqueTimings,
  mapMosqueDayToIqamah,
  mapMosqueDayToTimes,
} from './lib/mymasjid.js';

const DEFAULT_LOCATION = { lat: 51.1657, lng: 10.4515 };

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function readString(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

export default function App() {
  const [view, setView] = useState('prayers');
  const [language, setLanguage] = useState(() => readString('lamaz-language', 'ru'));
  const [location, setLocation] = useState(() => readJson('lamaz-location', DEFAULT_LOCATION));
  const [timeZone, setTimeZone] = useState(() => {
    try { return tzLookup(readJson('lamaz-location', DEFAULT_LOCATION).lat, readJson('lamaz-location', DEFAULT_LOCATION).lng); }
    catch { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; }
  });
  const [method, setMethod] = useState(() => readString('lamaz-method', 'MWL'));
  const [madhab, setMadhab] = useState(() => readString('lamaz-madhab', 'SHAFI'));
  const [selectedMosque, setSelectedMosque] = useState(() => readJson('lamaz-selected-mosque', null));
  const [mosqueSchedule, setMosqueSchedule] = useState(() => readJson('lamaz-mosque-schedule', null));
  const [mosqueScheduleStatus, setMosqueScheduleStatus] = useState('idle');
  const [duhaOffset, setDuhaOffset] = useState(() => Number(readString('lamaz-duha-offset', '20')));
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    const saved = readJson('lamaz-notifications', {});
    return {
      ...DEFAULT_NOTIFICATION_PREFS,
      ...saved,
      prayers: { ...DEFAULT_NOTIFICATION_PREFS.prayers, ...(saved.prayers || {}) },
    };
  });
  const [notificationPermission, setNotificationPermission] = useState(() => ('Notification' in window ? Notification.permission : 'unsupported'));
  const [gpsStatus, setGpsStatus] = useState('idle');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => { localStorage.setItem('lamaz-location', JSON.stringify(location)); }, [location]);
  useEffect(() => {
    localStorage.setItem('lamaz-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  useEffect(() => { localStorage.setItem('lamaz-method', method); }, [method]);
  useEffect(() => { localStorage.setItem('lamaz-madhab', madhab); }, [madhab]);
  useEffect(() => { localStorage.setItem('lamaz-duha-offset', String(duhaOffset)); }, [duhaOffset]);
  useEffect(() => { localStorage.setItem('lamaz-notifications', JSON.stringify(notificationPrefs)); }, [notificationPrefs]);
  useEffect(() => {
    if (selectedMosque) localStorage.setItem('lamaz-selected-mosque', JSON.stringify(selectedMosque));
    else localStorage.removeItem('lamaz-selected-mosque');
  }, [selectedMosque]);
  useEffect(() => {
    if (mosqueSchedule) localStorage.setItem('lamaz-mosque-schedule', JSON.stringify(mosqueSchedule));
    else localStorage.removeItem('lamaz-mosque-schedule');
  }, [mosqueSchedule]);

  useEffect(() => {
    try { setTimeZone(tzLookup(location.lat, location.lng)); }
    catch { setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'); }
  }, [location.lat, location.lng]);

  const localDate = useMemo(() => getLocalDateParts(now, timeZone), [now, timeZone]);
  const tomorrowDate = useMemo(() => addCalendarDays(localDate, 1), [localDate.year, localDate.month, localDate.day]);

  useEffect(() => {
    if (!selectedMosque?.guidId) return;
    let active = true;
    setMosqueScheduleStatus('loading');
    getMosqueTimings(selectedMosque.guidId)
      .then((schedule) => {
        if (!active) return;
        setMosqueSchedule(schedule);
        setMosqueScheduleStatus('success');
      })
      .catch(() => {
        if (active) setMosqueScheduleStatus('error');
      });
    return () => { active = false; };
  }, [selectedMosque?.guidId, localDate.year, localDate.month, localDate.day]);

  const todayMosqueDay = useMemo(
    () => selectedMosque ? extractMosqueDay(mosqueSchedule, localDate) : null,
    [selectedMosque, mosqueSchedule, localDate.day, localDate.month],
  );
  const tomorrowMosqueDay = useMemo(
    () => selectedMosque ? extractMosqueDay(mosqueSchedule, tomorrowDate) : null,
    [selectedMosque, mosqueSchedule, tomorrowDate.day, tomorrowDate.month],
  );
  const todayMosqueTimes = useMemo(() => mapMosqueDayToTimes(todayMosqueDay), [todayMosqueDay]);
  const tomorrowMosqueTimes = useMemo(() => mapMosqueDayToTimes(tomorrowMosqueDay), [tomorrowMosqueDay]);
  const iqamahTimes = useMemo(() => mapMosqueDayToIqamah(todayMosqueDay), [todayMosqueDay]);

  const todayData = useMemo(() => calculatePrayerData({
    ...location,
    date: now,
    dateParts: localDate,
    method,
    madhab,
    timeZone,
    mosqueTimes: todayMosqueTimes,
    duhaOffset,
  }), [location, localDate, method, madhab, timeZone, todayMosqueTimes, duhaOffset]);

  const tomorrowData = useMemo(() => calculatePrayerData({
    ...location,
    date: now,
    dateParts: tomorrowDate,
    method,
    madhab,
    timeZone,
    mosqueTimes: tomorrowMosqueTimes,
    duhaOffset,
  }), [location, tomorrowDate, method, madhab, timeZone, tomorrowMosqueTimes, duhaOffset]);

  const qiyamTime = useMemo(
    () => getLastThirdStart(todayData.times.maghrib, tomorrowData.times.fajr),
    [todayData.times.maghrib, tomorrowData.times.fajr],
  );
  const displayTimes = useMemo(() => ({ ...todayData.times, qiyam: qiyamTime }), [todayData.times, qiyamTime]);
  const nextFard = useMemo(() => getNextFard({ now, todayData, tomorrowData }), [now, todayData, tomorrowData]);
  const dates = useMemo(() => getDateDisplay(now, timeZone, language), [now, timeZone, language]);

  useEffect(() => {
    if (!notificationPrefs.enabled || notificationPermission !== 'granted') return undefined;
    const check = () => sendDueNotifications({
      times: displayTimes,
      prefs: notificationPrefs,
      now: new Date(),
      timeZone,
      mosqueName: todayMosqueDay ? selectedMosque?.name : '',
      language,
    });
    check();
    const timer = window.setInterval(check, 15_000);
    return () => window.clearInterval(timer);
  }, [displayTimes, notificationPrefs, notificationPermission, timeZone, todayMosqueDay, selectedMosque?.name, language]);

  async function requestNotifications() {
    if (!('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setNotificationPrefs((current) => ({ ...current, enabled: true }));
      }
    } catch {
      setNotificationPermission('denied');
    }
  }

  function useGps() {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: Number(coords.latitude.toFixed(6)), lng: Number(coords.longitude.toFixed(6)) });
        setGpsStatus('success');
      },
      () => setGpsStatus('error'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  function selectMosque({ mosque, schedule }) {
    setSelectedMosque(mosque);
    setMosqueSchedule(schedule);
    setMosqueScheduleStatus('success');
  }

  function clearMosque() {
    setSelectedMosque(null);
    setMosqueSchedule(null);
    setMosqueScheduleStatus('idle');
  }

  if (view === 'settings') {
    return (
      <main className="app-frame">
        <SettingsView
          onBack={() => setView('prayers')}
          location={location}
          onLocationChange={setLocation}
          onUseGps={useGps}
          gpsStatus={gpsStatus}
          timeZone={timeZone}
          method={method}
          onMethodChange={setMethod}
          madhab={madhab}
          onMadhabChange={setMadhab}
          selectedMosque={selectedMosque}
          onMosqueSelect={selectMosque}
          onMosqueClear={clearMosque}
          mosqueScheduleStatus={mosqueScheduleStatus}
          duhaOffset={duhaOffset}
          onDuhaOffsetChange={setDuhaOffset}
          notificationPrefs={notificationPrefs}
          onNotificationPrefsChange={setNotificationPrefs}
          notificationPermission={notificationPermission}
          onRequestNotifications={requestNotifications}
          language={language}
          onLanguageChange={setLanguage}
        />
      </main>
    );
  }

  const navigateTo = (nextView) => {
    setView(nextView);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  return (
    <main className="app-frame">
      <Header
        dates={dates}
        view={view}
        onHome={() => navigateTo('prayers')}
        onSettings={() => navigateTo('settings')}
        language={language}
      />

      {view === 'prayers' && (
        <PrayerTimesView
          times={displayTimes}
          timeZone={timeZone}
          now={now}
          nextFard={nextFard}
          iqamahTimes={iqamahTimes}
          mosqueName={todayMosqueDay ? selectedMosque?.name : ''}
          language={language}
        />
      )}

      {view === 'qibla' && (
        <QiblaCompass qiblaBearing={todayData.qibla} language={language}/>
      )}

      {view === 'azkar' && (
        <AzkarView language={language}/>
      )}

      {view === 'calendar' && (
        <CalendarView
          location={location}
          method={method}
          madhab={madhab}
          timeZone={timeZone}
          mosqueSchedule={mosqueSchedule}
          selectedMosque={selectedMosque}
          duhaOffset={duhaOffset}
          todayParts={localDate}
          language={language}
        />
      )}

      <BottomNav view={view} onChange={navigateTo} language={language}/>
    </main>
  );
}
