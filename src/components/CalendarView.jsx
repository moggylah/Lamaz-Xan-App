import { useMemo, useState } from 'react';
import { formatClock } from '../lib/date.js';
import { getLanguage, t } from '../lib/i18n.js';
import { buildMonthSchedule, shiftMonth } from '../lib/monthly.js';
import { downloadMonthlySchedulePdf } from '../lib/pdf.js';

const mainPrayerKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const secondaryKeys = ['sunrise', 'duha', 'qiyam'];

export default function CalendarView({
  location,
  method,
  madhab,
  timeZone,
  mosqueSchedule,
  selectedMosque,
  duhaOffset,
  todayParts,
  language = 'ru',
}) {
  const [monthState, setMonthState] = useState({
    year: todayParts.year,
    month: todayParts.month,
  });

  const rows = useMemo(
    () => buildMonthSchedule({
      ...monthState,
      location,
      method,
      madhab,
      timeZone,
      mosqueSchedule,
      selectedMosque,
      duhaOffset,
    }),
    [
      monthState.year,
      monthState.month,
      location.lat,
      location.lng,
      method,
      madhab,
      timeZone,
      mosqueSchedule,
      selectedMosque,
      duhaOffset,
    ],
  );

  const locale = getLanguage(language).locale;
  const monthTitle = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(monthState.year, monthState.month - 1, 1)));

  function changeMonth(amount) {
    setMonthState((current) => shiftMonth(current.year, current.month, amount));
  }

  function downloadPdf() {
    downloadMonthlySchedulePdf({
      rows,
      year: monthState.year,
      month: monthState.month,
      timeZone,
      language,
      sourceName: selectedMosque?.name || '',
    });
  }

  return (
    <section className="calendar-screen">
      <div className="calendar-toolbar">
        <button
          type="button"
          className="calendar-month-button"
          onClick={() => changeMonth(-1)}
          aria-label={t(language, 'calendar.previous')}
        >
          ‹
        </button>

        <div className="calendar-month-title">
          <h2>{monthTitle}</h2>
          <span>
            {selectedMosque?.name
              ? t(language, 'calendar.mosqueSource', { mosque: selectedMosque.name })
              : t(language, 'calendar.calculatedSource')}
          </span>
        </div>

        <button
          type="button"
          className="calendar-month-button"
          onClick={() => changeMonth(1)}
          aria-label={t(language, 'calendar.next')}
        >
          ›
        </button>
      </div>

      <div className="calendar-list">
        {rows.map((row) => {
          const isToday =
            row.dateParts.year === todayParts.year &&
            row.dateParts.month === todayParts.month &&
            row.dateParts.day === todayParts.day;

          const weekday = new Intl.DateTimeFormat(locale, {
            weekday: 'short',
            timeZone,
          }).format(row.date);

          return (
            <article
              key={`${row.dateParts.year}-${row.dateParts.month}-${row.dateParts.day}`}
              className={`calendar-day ${isToday ? 'is-today' : ''}`}
            >
              <div className="calendar-day-date">
                <strong>{row.dateParts.day}</strong>
                <span>{weekday}</span>
              </div>

              <div className="calendar-day-times">
                <div className="calendar-main-times">
                  {mainPrayerKeys.map((key) => (
                    <div className="calendar-time" key={key}>
                      <span>{t(language, `prayer.${key}`)}</span>
                      <strong>{formatClock(row.times[key], timeZone, language)}</strong>
                    </div>
                  ))}
                </div>

                <div className="calendar-secondary-times">
                  {secondaryKeys.map((key) => (
                    <div key={key}>
                      <span>{t(language, `prayer.${key}`)}</span>
                      <strong>{formatClock(row.times[key], timeZone, language)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button type="button" className="pdf-button calendar-pdf-button" onClick={downloadPdf}>
        {t(language, 'calendar.downloadPdf')}
      </button>
    </section>
  );
}
