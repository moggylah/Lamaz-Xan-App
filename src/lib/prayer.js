import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PrayerTimes,
  Qibla,
} from 'adhan';
import { addMinutes, getLocalDateParts, isRamadan, wallTimeToDate } from './date.js';

export const METHOD_OPTIONS = [
  { value: 'MWL', label: 'Muslim World League' },
  { value: 'UMM_AL_QURA', label: 'Умм аль-Кура (Мекка)' },
  { value: 'TURKEY', label: 'Diyanet (Турция)' },
  { value: 'MOON', label: 'Moonsighting Committee' },
  { value: 'EGYPT', label: 'Egyptian General Authority' },
  { value: 'KARACHI', label: 'University of Islamic Sciences, Karachi' },
];

export const MADHAB_OPTIONS = [
  { value: 'SHAFI', label: 'Шафиитский / Малики / Ханбали' },
  { value: 'HANAFI', label: 'Ханафитский' },
];

export const FARD_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function getMethod(method) {
  switch (method) {
    case 'MOON': return CalculationMethod.MoonsightingCommittee();
    case 'EGYPT': return CalculationMethod.Egyptian();
    case 'KARACHI': return CalculationMethod.Karachi();
    case 'UMM_AL_QURA': return CalculationMethod.UmmAlQura();
    case 'TURKEY': return CalculationMethod.Turkey();
    case 'MWL':
    default: return CalculationMethod.MuslimWorldLeague();
  }
}

function applyWallOverride(baseDate, value, timeZone) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return baseDate;
  const [hour, minute] = value.split(':').map(Number);
  const local = getLocalDateParts(baseDate, timeZone);
  return wallTimeToDate({ ...local, hour, minute }, timeZone);
}

export function calculatePrayerData({
  lat,
  lng,
  date = new Date(),
  dateParts = null,
  method = 'MWL',
  madhab = 'SHAFI',
  timeZone,
  mosqueTimes = {},
  duhaOffset = 20,
}) {
  const coordinates = new Coordinates(lat, lng);
  const params = getMethod(method);
  params.madhab = madhab === 'HANAFI' ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
  const ramadan = isRamadan(date, timeZone);
  if (method === 'UMM_AL_QURA' && ramadan) params.adjustments.isha += 30;

  const local = dateParts || getLocalDateParts(date, timeZone);
  const calculationDate = new Date(local.year, local.month - 1, local.day);
  const prayerTimes = new PrayerTimes(coordinates, calculationDate, params);

  const times = {
    fajr: applyWallOverride(prayerTimes.fajr, mosqueTimes.fajr, timeZone),
    sunrise: applyWallOverride(prayerTimes.sunrise, mosqueTimes.sunrise, timeZone),
    duha: addMinutes(applyWallOverride(prayerTimes.sunrise, mosqueTimes.sunrise, timeZone), Number(duhaOffset) || 20),
    dhuhr: applyWallOverride(prayerTimes.dhuhr, mosqueTimes.dhuhr, timeZone),
    asr: applyWallOverride(prayerTimes.asr, mosqueTimes.asr, timeZone),
    maghrib: applyWallOverride(prayerTimes.maghrib, mosqueTimes.maghrib, timeZone),
    isha: applyWallOverride(prayerTimes.isha, mosqueTimes.isha, timeZone),
  };

  return {
    times,
    qibla: Qibla(coordinates),
    ramadan,
  };
}


export function getLastThirdStart(maghrib, nextFajr) {
  if (!maghrib || !nextFajr) return null;
  const nightMs = nextFajr.getTime() - maghrib.getTime();
  if (nightMs <= 0) return null;
  return new Date(nextFajr.getTime() - nightMs / 3);
}

export function getNextFard({ now, todayData, tomorrowData }) {
  for (const key of FARD_KEYS) {
    if (todayData.times[key] > now) return { key, time: todayData.times[key], tomorrow: false };
  }
  return { key: 'fajr', time: tomorrowData.times.fajr, tomorrow: true };
}

export function getPastStatus(key, time, now, nextKey, nextIsTomorrow = false) {
  if (!time) return 'future';
  if (!nextIsTomorrow && key === nextKey) return 'next';
  return time < now ? 'past' : 'future';
}
