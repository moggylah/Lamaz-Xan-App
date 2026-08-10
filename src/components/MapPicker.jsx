import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { t } from '../lib/i18n.js';

export default function MapPicker({ location, onChange, language = 'ru' }) {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return undefined;
    const map = L.map(mapElementRef.current, { zoomControl: true, attributionControl: true }).setView([location.lat, location.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    const marker = L.circleMarker([location.lat, location.lng], {
      radius: 8,
      color: '#1e5a43',
      fillColor: '#f8f5ee',
      fillOpacity: 1,
      weight: 3,
    }).addTo(map);
    map.on('click', ({ latlng }) => onChangeRef.current({ lat: Number(latlng.lat.toFixed(6)), lng: Number(latlng.lng.toFixed(6)) }));
    mapRef.current = map;
    markerRef.current = marker;
    setTimeout(() => map.invalidateSize(), 0);
    return () => { map.remove(); mapRef.current = null; markerRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const point = [location.lat, location.lng];
    markerRef.current.setLatLng(point);
    mapRef.current.panTo(point, { animate: true, duration: .3 });
  }, [location.lat, location.lng]);

  return <div ref={mapElementRef} className="map" aria-label={t(language, 'aria.map')}/>;
}
