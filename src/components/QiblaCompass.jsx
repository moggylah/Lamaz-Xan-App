import { useEffect, useMemo, useRef, useState } from 'react';
import { CompassMiniIcon, QiblaIcon } from './Icons.jsx';
import { t } from '../lib/i18n.js';

function normalize(value) {
  return ((value % 360) + 360) % 360;
}

function signedAngle(value) {
  return ((value + 540) % 360) - 180;
}

function smoothHeading(previous, next, factor = 0.18) {
  if (previous == null) return normalize(next);
  const delta = signedAngle(next - previous);
  return normalize(previous + delta * factor);
}

function getScreenAngle() {
  if (Number.isFinite(window.screen?.orientation?.angle)) return window.screen.orientation.angle;
  if (Number.isFinite(window.orientation)) return window.orientation;
  return 0;
}

export default function QiblaCompass({ qiblaBearing, language = 'ru' }) {
  const [heading, setHeading] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState('idle');

  const listenersRef = useRef([]);
  const headingRef = useRef(null);
  const sourceRef = useRef(null);

  const difference = useMemo(() => {
    if (heading == null) return null;
    return signedAngle(qiblaBearing - heading);
  }, [heading, qiblaBearing]);

  const aligned = difference != null && Math.abs(difference) <= 6;
  const needleAngle = heading == null ? 0 : normalize(-heading);
  const turnDegrees = difference == null ? 0 : Math.round(Math.abs(difference));

  function removeListeners() {
    for (const { eventName, handler } of listenersRef.current) {
      window.removeEventListener(eventName, handler, true);
    }
    listenersRef.current = [];
  }

  useEffect(() => () => removeListeners(), []);

  function applyHeading(value, source, sensorAccuracy = null) {
    if (!Number.isFinite(value)) return;
    if (sourceRef.current === 'webkit' && source !== 'webkit') return;

    if (source === 'webkit') sourceRef.current = 'webkit';
    else if (!sourceRef.current) sourceRef.current = source;

    if (Number.isFinite(sensorAccuracy) && sensorAccuracy >= 0) {
      setAccuracy(sensorAccuracy);
    }

    const next = smoothHeading(headingRef.current, normalize(value));
    headingRef.current = next;
    setHeading(next);
    setStatus('active');
  }

  function handleOrientation(event) {
    if (Number.isFinite(event.webkitCompassHeading)) {
      applyHeading(event.webkitCompassHeading, 'webkit', event.webkitCompassAccuracy);
      return;
    }

    if (event.absolute === true && Number.isFinite(event.alpha)) {
      applyHeading(360 - event.alpha + getScreenAngle(), 'absolute');
    }
  }

  async function startCompass() {
    try {
      setStatus('requesting');
      const Orientation = window.DeviceOrientationEvent;

      if (!Orientation) {
        setStatus('unsupported');
        return;
      }

      if (typeof Orientation.requestPermission === 'function') {
        const permission = await Orientation.requestPermission();
        if (permission !== 'granted') {
          setStatus('denied');
          return;
        }
      }

      removeListeners();
      headingRef.current = null;
      sourceRef.current = null;
      setAccuracy(null);

      window.addEventListener('deviceorientation', handleOrientation, true);
      listenersRef.current.push({ eventName: 'deviceorientation', handler: handleOrientation });

      if ('ondeviceorientationabsolute' in window) {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        listenersRef.current.push({ eventName: 'deviceorientationabsolute', handler: handleOrientation });
      }

      setStatus('listening');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  const needsActivation = heading == null;
  const lowAccuracy = Number.isFinite(accuracy) && accuracy > 25;

  let guidance = t(language, 'qibla.instruction');
  if (difference != null) {
    if (aligned) guidance = t(language, 'qibla.alignedInstruction');
    else if (difference > 0) guidance = t(language, 'qibla.turnRight', { degrees: turnDegrees });
    else guidance = t(language, 'qibla.turnLeft', { degrees: turnDegrees });
  }

  return (
    <section className="qibla-screen">
      <div className={`qibla-guide-card ${aligned ? 'is-aligned' : ''}`}>
        <div className="qibla-guide-label">{guidance}</div>
        <div className="qibla-guide-scale" aria-hidden="true">
          <span />
          <strong>{aligned ? '✓' : difference != null ? `${turnDegrees}°` : '—'}</strong>
          <span />
        </div>
      </div>

      <div className={`compass-shell compass-clean ${aligned ? 'is-aligned' : ''}`}>
        <div className="compass-face">
          <div className="compass-ticks" aria-hidden="true" />
          <div className="compass-inner-ring" aria-hidden="true" />

          <span className="cardinal north">N</span>
          <span className="cardinal east">E</span>
          <span className="cardinal south">S</span>
          <span className="cardinal west">W</span>

          <div className={`qibla-top-target ${aligned ? 'is-visible' : ''}`} aria-hidden="true">
            {aligned ? <QiblaIcon size={42} /> : <span />}
          </div>

          <div
            className="compass-north-pointer"
            style={{ transform: `rotate(${needleAngle}deg)` }}
            aria-hidden="true"
          >
            <span className="compass-arrow" />
          </div>

          <div className="compass-center" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>

      <div className={`qibla-readout ${aligned ? 'is-aligned' : ''}`}>
        <CompassMiniIcon size={22} />
        <div className="qibla-readout-main">
          <strong>
            {aligned
              ? t(language, 'qibla.aligned')
              : t(language, 'qibla.value', { degrees: Math.round(qiblaBearing) })}
          </strong>
          {heading != null && (
            <span>{t(language, 'qibla.heading', { degrees: Math.round(heading) })}</span>
          )}
        </div>
      </div>

      {needsActivation && (
        <button className="compass-activate" type="button" onClick={startCompass}>
          {status === 'requesting' ? t(language, 'qibla.requesting') : t(language, 'qibla.enable')}
        </button>
      )}

      {lowAccuracy && <p className="sensor-note">{t(language, 'qibla.calibrate')}</p>}

      {['denied', 'unsupported', 'error'].includes(status) && (
        <p className="sensor-note">{t(language, 'qibla.unavailable')}</p>
      )}
    </section>
  );
}
