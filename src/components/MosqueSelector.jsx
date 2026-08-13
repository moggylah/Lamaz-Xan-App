import { useEffect, useMemo, useState } from 'react';
import {
  findBestNamedMatch,
  getCities,
  getCountries,
  getMosqueTimings,
  getMosques,
  reverseGeocodeDeviceLocation,
} from '../lib/mymasjid.js';
import { t } from '../lib/i18n.js';

export default function MosqueSelector({ selectedMosque, onSelect, onClear, onLocationDetected, language = 'ru' }) {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [mosques, setMosques] = useState([]);
  const [countryId, setCountryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [loading, setLoading] = useState('countries');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getCountries()
      .then((items) => { if (active) setCountries(items); })
      .catch(() => { if (active) setError(t(language, 'mosque.errorCountries')); })
      .finally(() => { if (active) setLoading(''); });
    return () => { active = false; };
  }, [language]);

  async function chooseCountry(id) {
    setCountryId(String(id)); setCityId(''); setCities([]); setMosques([]);
    if (!id) return;
    setLoading('cities'); setError('');
    try { setCities(await getCities(id)); }
    catch { setError(t(language, 'mosque.errorCities')); }
    finally { setLoading(''); }
  }

  async function chooseCity(id, overrideCountryId = countryId) {
    setCityId(String(id)); setMosques([]);
    if (!id || !overrideCountryId) return;
    setLoading('mosques'); setError('');
    try { setMosques(await getMosques(overrideCountryId, id)); }
    catch { setError(t(language, 'mosque.errorMosques')); }
    finally { setLoading(''); }
  }

  async function selectMosque(mosque) {
    setLoading(`mosque:${mosque.guidId}`); setError('');
    try {
      const schedule = await getMosqueTimings(mosque.guidId);
      onSelect({ mosque: { guidId: mosque.guidId, id: mosque.id, name: mosque.name, address: mosque.address || '', city: mosque.city || '', country: mosque.country || '' }, schedule });
    } catch { setError(t(language, 'mosque.errorSchedule')); }
    finally { setLoading(''); }
  }

  async function findNearby() {
    if (!navigator.geolocation) { setError(t(language, 'mosque.noGeolocation')); return; }
    setLoading('nearby'); setError('');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const lat = Number(coords.latitude.toFixed(6));
        const lng = Number(coords.longitude.toFixed(6));
        onLocationDetected?.({ lat, lng });
        const geo = await reverseGeocodeDeviceLocation(lat, lng);
        const country = findBestNamedMatch(countries, [geo.countryName, geo.countryCode]);
        if (!country) throw new Error('country');
        setCountryId(String(country.id));
        const countryCities = await getCities(country.id);
        setCities(countryCities);
        const city = findBestNamedMatch(countryCities, [geo.city, geo.locality, geo.principalSubdivision]);
        if (!city) {
          setLoading('');
          const place = geo.city || geo.locality || geo.principalSubdivision || geo.countryName;
          setError(t(language, 'mosque.detectedChoose', { place }));
          return;
        }
        setCityId(String(city.id));
        const nearbyMosques = await getMosques(country.id, city.id);
        setMosques(nearbyMosques);
        if (!nearbyMosques.length) setError(t(language, 'mosque.noneInCity'));
      } catch { setError(t(language, 'mosque.autoMatchError')); }
      finally { setLoading(''); }
    }, () => {
      setLoading('');
      setError(t(language, 'mosque.locationDenied'));
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  }

  const selectedLabel = useMemo(() => selectedMosque ? [selectedMosque.name, selectedMosque.city].filter(Boolean).join(' · ') : '', [selectedMosque]);

  return (
    <div className="mosque-selector">
      {selectedMosque && (
        <div className="selected-mosque-card">
          <span className="selected-mosque-label">{t(language, 'mosque.selected')}</span>
          <strong>{selectedLabel}</strong>
          {selectedMosque.address && <small>{selectedMosque.address}</small>}
          <button type="button" className="text-action danger-action" onClick={onClear}>{t(language, 'mosque.useCalculation')}</button>
        </div>
      )}

      <button type="button" className="primary-action nearby-button" onClick={findNearby} disabled={Boolean(loading)}>
        {loading === 'nearby' ? t(language, 'mosque.searching') : t(language, 'mosque.findNearby')}
      </button>
      <div className="selector-divider"><span>{t(language, 'mosque.orChoose')}</span></div>

      <label className="selector-label">{t(language, 'mosque.country')}
        <select value={countryId} onChange={(e) => chooseCountry(e.target.value)} disabled={loading === 'countries'}>
          <option value="">{loading === 'countries' ? t(language, 'mosque.loading') : t(language, 'mosque.chooseCountry')}</option>
          {countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
        </select>
      </label>

      <label className="selector-label">{t(language, 'mosque.city')}
        <select value={cityId} onChange={(e) => chooseCity(e.target.value)} disabled={!countryId || loading === 'cities'}>
          <option value="">{loading === 'cities' ? t(language, 'mosque.loading') : t(language, 'mosque.chooseCity')}</option>
          {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
      </label>

      {loading === 'mosques' && <p className="selector-status">{t(language, 'mosque.loadingMosques')}</p>}
      {error && <p className="panel-error">{error}</p>}
      {mosques.length > 0 && (
        <div className="mosque-results">
          {mosques.map((mosque) => (
            <button type="button" className={`mosque-result ${selectedMosque?.guidId === mosque.guidId ? 'selected' : ''}`} key={mosque.guidId || mosque.id} onClick={() => selectMosque(mosque)} disabled={Boolean(loading)}>
              <strong>{mosque.name}</strong>
              <small>{[mosque.address, mosque.city].filter(Boolean).join(' · ')}</small>
              <span>{loading === `mosque:${mosque.guidId}` ? t(language, 'mosque.loading') : selectedMosque?.guidId === mosque.guidId ? t(language, 'mosque.chosen') : t(language, 'mosque.choose')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
