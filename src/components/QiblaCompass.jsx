import { useEffect, useMemo, useRef, useState } from 'react';
import { CompassMiniIcon, QiblaIcon } from './Icons.jsx';
import { t } from '../lib/i18n.js';

function normalize(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function signedAngle(degrees) {
  return ((degrees + 540) % 360) - 180;
}

function smoothAngle(previous, next, factor = 0.14) {
  if (previous == null) return normalize(next);
  const delta = signedAngle(next - previous);
  return normalize(previous + delta * factor);
}

export default function QiblaCompass({ qiblaBearing, language = 'ru' }) {
  const [heading, setHeading] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState('idle');

  const listenersRef = useRef([]);
  const headingRef = useRef(null);
  const sourceRef = useRef(null);

  const relativeQibla = useMemo(() => {
    if (heading == null) return normalize(qiblaBearing);
    return normalize(qiblaBearing - heading);
  }, [heading, qiblaBearing]);

  const alignmentError = useMemo(
    () => Math.abs(signedAngle(relativeQibla)),
    [relativeQibla],
  );

  const aligned = heading != null && alignmentError <= 5;

  const northNeedleAngle = useMemo(() => {
    if (heading == null) return 0;
    return normalize(-heading);
  }, [heading]);

  const targetStyle = useMemo(() => {
    const radians = (relativeQibla * Math.PI) / 180;
    const radius = 42.5;

    return {
      left: `${50 + Math.sin(radians) * radius}%`,
      top: `${50 - Math.cos(radians) * radius}%`,
    };
  }, [relativeQibla]);

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

    if (source === 'webkit') {
      sourceRef.current = 'webkit';
    } else if (!sourceRef.current) {
      sourceRef.current = source;
    }

    if (Number.isFinite(sensorAccuracy) && sensorAccuracy >= 0) {
      setAccuracy(sensorAccuracy);
    }

    const smoothed = smoothAngle(headingRef.current, normalize(value));
    headingRef.current = smoothed;
    setHeading(smoothed);
    setStatus('active');
  }

  function handleOrientation(event) {
    if (Number.isFinite(event.webkitCompassHeading)) {
      applyHeading(
        event.webkitCompassHeading,
        'webkit',
        event.webkitCompassAccuracy,
      );
      return;
    }

    if (event.absolute === true && Number.isFinite(event.alpha)) {
      applyHeading(360 - event.alpha, 'absolute');
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
      listenersRef.current.push({
        eventName: 'deviceorientation',
        handler: handleOrientation,
      });

      if ('ondeviceorientationabsolute' in window) {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        listenersRef.current.push({
          eventName: 'deviceorientationabsolute',
          handler: handleOrientation,
        });
      }

      setStatus('listening');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  const needsActivation = heading == null;
  const lowAccuracy = Number.isFinite(accuracy) && accuracy > 25;

  return (
    <section className="qibla-screen">
      <div className={`compass-shell ${aligned ? 'is-aligned' : ''}`}>
        <div className="compass-face">
          <div className="compass-ticks" aria-hidden="true" />
          <span className="cardinal north">N</span>
          <span className="cardinal east">E</span>
          <span className="cardinal south">S</span>
          <span className="cardinal west">W</span>
          <span className="north-marker" aria-hidden="true" />
          <div className="compass-pattern" aria-hidden="true" />

          <div
            className="qibla-needle compass-north-needle"
            style={{ transform: `rotate(${northNeedleAngle}deg)` }}
            aria-hidden="true"
          >
            <span className="needle-shaft" />
          </div>

          <span
            className={`qibla-target-dot ${aligned ? 'aligned' : ''}`}
            style={targetStyle}
            aria-hidden="true"
          />

          {aligned && (
            <div
              className="qibla-marker aligned"
              style={targetStyle}
              aria-hidden="true"
            >
              <QiblaIcon size={40} />
              <span>{t(language, 'qibla.marker')}</span>
            </div>
          )}

          <span className="needle-pivot" aria-hidden="true">
            <span />
          </span>
        </div>
      </div>

      <div className={`qibla-value ${aligned ? 'aligned' : ''}`}>
        <CompassMiniIcon size={23} />
        <div>
          <strong>
            {aligned
              ? t(language, 'qibla.aligned')
              : t(language, 'qibla.value', { degrees: Math.round(qiblaBearing) })}
          </strong>
          {heading != null && (
            <small>
              {t(language, 'qibla.heading', { degrees: Math.round(heading) })}
            </small>
          )}
        </div>
      </div>

      {needsActivation ? (
        <button className="compass-activate" onClick={startCompass}>
          {status === 'requesting'
            ? t(language, 'qibla.requesting')
            : t(language, 'qibla.enable')}
        </button>
      ) : (
        <p className="compass-instruction">
          {aligned
            ? t(language, 'qibla.alignedInstruction')
            : t(language, 'qibla.instruction')}
        </p>
      )}

      {lowAccuracy && (
        <p className="sensor-note">
          {t(language, 'qibla.calibrate')}
        </p>
      )}

      {['denied', 'unsupported', 'error'].includes(status) && (
        <p className="sensor-note">
          {t(language, 'qibla.unavailable')}
        </p>
      )}

      <div className="bottom-ornament compass-ornament" aria-hidden="true" />
    </section>
  );
}
