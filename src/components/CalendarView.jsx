import { useMemo, useState } from 'react';
import { formatClock } from '../lib/date.js';
import { getLanguage, t } from '../lib/i18n.js';
import { buildMonthSchedule, shiftMonth } from '../lib/monthly.js';
import { downloadMonthlySchedulePdf } from '../lib/pdf.js';

const prayerKeys = [
  'fajr',
  'sunrise',
  'duha',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
  'qiyam',
];

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
      <div className="calendar-card">
        <div className="calendar-header">
          <button
            type="button"
            className="calendar-month-button"
            onClick={() => changeMonth(-1)}
            aria-label={t(language, 'calendar.previous')}
          >
            ‹
          </button>

          <h2>{monthTitle}</h2>

          <button
            type="button"
            className="calendar-month-button"
            onClick={() => changeMonth(1)}
            aria-label={t(language, 'calendar.next')}
          >
            ›
          </button>
        </div>

        <p className="calendar-subtitle">
          {selectedMosque?.name
            ? t(language, 'calendar.mosqueSource', { mosque: selectedMosque.name })
            : t(language, 'calendar.calculatedSource')}
        </p>

        <div className="calendar-table-wrap">
          <table className="calendar-table">
            <thead>
              <tr>
                <th>{t(language, 'calendar.date')}</th>
                {prayerKeys.map((key) => (
                  <th key={key}>{t(language, `prayer.${key}`)}</th>
                ))}
              </tr>
            </thead>

            <tbody>
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
                  <tr
                    key={`${row.dateParts.year}-${row.dateParts.month}-${row.dateParts.day}`}
                    className={isToday ? 'calendar-row-today' : ''}
                  >
                    <td>
                      <span className="calendar-date-cell">
                        <strong>{row.dateParts.day}</strong>
                        <small>{weekday}</small>
                      </span>
                    </td>

                    {prayerKeys.map((key) => (
                      <td key={key}>
                        {formatClock(row.times[key], timeZone, language)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="calendar-actions">
          <button type="button" className="pdf-button" onClick={downloadPdf}>
            {t(language, 'calendar.downloadPdf')}
          </button>
        </div>
      </div>
    </section>
  );
}
