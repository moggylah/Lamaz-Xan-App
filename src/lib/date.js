import { getLanguage } from './i18n.js';

const MONTHS = {
  ru: {
    gregorian: ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
    hijri: ['мух.', 'саф.', 'раб. I', 'раб. II', 'джум. I', 'джум. II', 'радж.', 'шааб.', 'рам.', 'шав.', 'зуль-када', 'зуль-хиджа'],
  },
  en: {
    gregorian: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    hijri: ['Muh.', 'Saf.', 'Rab. I', 'Rab. II', 'Jum. I', 'Jum. II', 'Raj.', 'Sha.', 'Ram.', 'Shaw.', 'Dhu al-Q.', 'Dhu al-H.'],
  },
  de: {
    gregorian: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
    hijri: ['Muh.', 'Saf.', 'Rab. I', 'Rab. II', 'Dschum. I', 'Dschum. II', 'Radsch.', 'Scha.', 'Ram.', 'Schaw.', 'Dhu l-Q.', 'Dhu l-H.'],
  },
  fr: {
    gregorian: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
    hijri: ['Mouh.', 'Saf.', 'Rab. I', 'Rab. II', 'Joum. I', 'Joum. II', 'Raj.', 'Chaab.', 'Ram.', 'Chaww.', 'Dhou al-Q.', 'Dhou al-H.'],
  },
  es: {
    gregorian: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
    hijri: ['Muh.', 'Saf.', 'Rab. I', 'Rab. II', 'Yum. I', 'Yum. II', 'Ray.', 'Shaab.', 'Ram.', 'Shaw.', 'Dhu al-Q.', 'Dhu al-H.'],
  },
  ar: {
    gregorian: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    hijri: ['محرم', 'صفر', 'ربيع ١', 'ربيع ٢', 'جمادى ١', 'جمادى ٢', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
  },
};

function numericParts(date, timeZone, calendar = 'gregory') {
  const parts = new Intl.DateTimeFormat(`en-u-ca-${calendar}-nu-latn`, {
    day: 'numeric', month: 'numeric', year: 'numeric', timeZone,
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => ['day', 'month', 'year'].includes(part.type)).map((part) => [part.type, Number(part.value)]));
}

export function getLocalDateParts(date, timeZone) { return numericParts(date, timeZone, 'gregory'); }
export function getHijriParts(date, timeZone) { return numericParts(date, timeZone, 'islamic-umalqura'); }

export function getDateDisplay(date, timeZone, language = 'ru') {
  const code = MONTHS[language] ? language : 'ru';
  const greg = getLocalDateParts(date, timeZone);
  const hijri = getHijriParts(date, timeZone);
  const locale = getLanguage(code).locale;
  return {
    gregorian: `${greg.day} ${MONTHS[code].gregorian[greg.month - 1]} ${greg.year}`,
    hijri: `${hijri.day} ${MONTHS[code].hijri[hijri.month - 1]} ${hijri.year}`,
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone }).format(date),
  };
}

export function isRamadan(date, timeZone) { return getHijriParts(date, timeZone).month === 9; }

export function formatClock(date, timeZone, language = 'ru') {
  if (!date) return '—';
  return new Intl.DateTimeFormat(getLanguage(language).locale, {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone,
  }).format(date);
}

function zoneOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone,
  }).formatToParts(date);
  const map = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]));
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second);
  return asUtc - date.getTime();
}

export function wallTimeToDate({ year, month, day, hour, minute }, timeZone) {
  const utc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let result = new Date(utc - zoneOffsetMs(new Date(utc), timeZone));
  result = new Date(utc - zoneOffsetMs(result, timeZone));
  return result;
}

export function addMinutes(date, minutes) { return date ? new Date(date.getTime() + minutes * 60_000) : null; }

export function addCalendarDays(parts, amount) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + amount, 12));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}
