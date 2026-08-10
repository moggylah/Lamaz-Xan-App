import { addCalendarDays, wallTimeToDate } from './date.js';
import { calculatePrayerData, getLastThirdStart } from './prayer.js';
import {
  extractMosqueDay,
  mapMosqueDayToIqamah,
  mapMosqueDayToTimes,
} from './mymasjid.js';

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function shiftMonth(year, month, amount) {
  const value = new Date(Date.UTC(year, month - 1 + amount, 1));
  return {
    year: value.getUTCFullYear(),
    month: value.getUTCMonth() + 1,
  };
}

function getPrayerDataForDay({
  dateParts,
  location,
  method,
  madhab,
  timeZone,
  mosqueSchedule,
  selectedMosque,
  duhaOffset,
}) {
  const mosqueDay = selectedMosque
    ? extractMosqueDay(mosqueSchedule, dateParts)
    : null;

  const mosqueTimes = mapMosqueDayToTimes(mosqueDay);
  const date = wallTimeToDate({
    ...dateParts,
    hour: 12,
    minute: 0,
  }, timeZone);

  const data = calculatePrayerData({
    ...location,
    date,
    dateParts,
    method,
    madhab,
    timeZone,
    mosqueTimes,
    duhaOffset,
  });

  return {
    data,
    mosqueDay,
    iqamah: mapMosqueDayToIqamah(mosqueDay),
  };
}

export function buildMonthSchedule({
  year,
  month,
  location,
  method,
  madhab,
  timeZone,
  mosqueSchedule,
  selectedMosque,
  duhaOffset,
}) {
  const count = daysInMonth(year, month);
  const result = [];

  for (let day = 1; day <= count; day += 1) {
    const dateParts = { year, month, day };
    const nextDateParts = addCalendarDays(dateParts, 1);

    const current = getPrayerDataForDay({
      dateParts,
      location,
      method,
      madhab,
      timeZone,
      mosqueSchedule,
      selectedMosque,
      duhaOffset,
    });

    const next = getPrayerDataForDay({
      dateParts: nextDateParts,
      location,
      method,
      madhab,
      timeZone,
      mosqueSchedule,
      selectedMosque,
      duhaOffset,
    });

    result.push({
      dateParts,
      date: wallTimeToDate({
        ...dateParts,
        hour: 12,
        minute: 0,
      }, timeZone),
      times: {
        ...current.data.times,
        qiyam: getLastThirdStart(
          current.data.times.maghrib,
          next.data.times.fajr,
        ),
      },
      iqamah: current.iqamah,
      mosqueDay: current.mosqueDay,
    });
  }

  return result;
}
