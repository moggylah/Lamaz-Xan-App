const API_BASE = '/my-masjid-api/api';

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`My-Masjid API: ${response.status}`);
  }

  const data = await response.json();
  return data?.model ?? data;
}

function sortByName(items = []) {
  return [...items].sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || ''), 'ru'));
}

export async function getCountries() {
  return sortByName(await fetchJson('/Country/GetAllCountries'));
}

export async function getCities(countryId) {
  return sortByName(await fetchJson(`/City/GetCitiesByCountryId?CountryId=${encodeURIComponent(countryId)}`));
}

export async function getMosques(countryId, cityId) {
  return sortByName(await fetchJson(`/Masjid/SearchMasjidByLocation?CountryId=${encodeURIComponent(countryId)}&CityId=${encodeURIComponent(cityId)}`));
}

export async function getMosqueTimings(guidId) {
  return fetchJson(`/TimingsInfoScreen/GetMasjidTimings?GuidId=${encodeURIComponent(guidId)}`);
}

export async function reverseGeocodeDeviceLocation(lat, lng) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    localityLanguage: 'en',
  });
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`);
  if (!response.ok) throw new Error(`Reverse geocoding: ${response.status}`);
  return response.json();
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function findBestNamedMatch(items, candidates = []) {
  const cleaned = candidates.map(normalize).filter(Boolean);
  if (!cleaned.length) return null;

  const exact = items.find((item) => cleaned.includes(normalize(item?.name)));
  if (exact) return exact;

  return items.find((item) => {
    const name = normalize(item?.name);
    return cleaned.some((candidate) => name.includes(candidate) || candidate.includes(name));
  }) || null;
}

export function normalizeClock(value) {
  if (!value) return '';
  const text = String(value).trim();
  const twentyFour = text.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFour) {
    return `${String(Number(twentyFour[1])).padStart(2, '0')}:${twentyFour[2]}`;
  }

  const twelveHour = text.match(/^(\d{1,2}):(\d{2})\s*([ap])\.?m\.?$/i);
  if (!twelveHour) return '';
  let hour = Number(twelveHour[1]) % 12;
  if (twelveHour[3].toLowerCase() === 'p') hour += 12;
  return `${String(hour).padStart(2, '0')}:${twelveHour[2]}`;
}

export function extractMosqueDay(schedule, dateParts) {
  const timings = schedule?.salahTimings;
  if (!Array.isArray(timings)) return null;
  return timings.find((entry) => Number(entry?.day) === Number(dateParts.day) && Number(entry?.month) === Number(dateParts.month)) || null;
}

export function mapMosqueDayToTimes(day) {
  if (!day) return {};
  return {
    fajr: normalizeClock(day.fajr),
    sunrise: normalizeClock(day.shouruq),
    dhuhr: normalizeClock(day.zuhr),
    asr: normalizeClock(day.asr),
    maghrib: normalizeClock(day.maghrib),
    isha: normalizeClock(day.isha),
  };
}

export function mapMosqueDayToIqamah(day) {
  if (!day) return {};
  return {
    fajr: normalizeClock(day.iqamah_Fajr),
    dhuhr: normalizeClock(day.iqamah_Zuhr),
    asr: normalizeClock(day.iqamah_Asr),
    maghrib: normalizeClock(day.iqamah_Maghrib),
    isha: normalizeClock(day.iqamah_Isha),
  };
}
