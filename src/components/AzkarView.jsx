import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckIcon } from './Icons.jsx';
import { AZKAR, AZKAR_SOURCE, getAzkarMeaning, getAzkarName } from '../lib/azkar.js';
import { triggerHaptic } from '../lib/haptics.js';
import { t } from '../lib/i18n.js';

const categories = [
  { key: 'morning', titleKey: 'azkar.morning', hintKey: 'azkar.morningHint' },
  { key: 'evening', titleKey: 'azkar.evening', hintKey: 'azkar.eveningHint' },
  { key: 'afterPrayer', titleKey: 'azkar.afterPrayer', hintKey: 'azkar.afterPrayerHint' },
];

function makeCounterKey(category, item) {
  return `${category}:${item.id}`;
}

function readCounters() {
  try {
    return JSON.parse(localStorage.getItem('lamaz-azkar-counters') || '{}');
  } catch {
    return {};
  }
}

function firstIncompleteIndex(category, items, remaining) {
  const index = items.findIndex((item) => (remaining[makeCounterKey(category, item)] ?? item.repetitions) > 0);
  return index >= 0 ? index : 0;
}

export default function AzkarView({ language = 'ru', hapticsEnabled = true }) {
  const [category, setCategory] = useState('morning');
  const [remaining, setRemaining] = useState(readCounters);
  const [currentIndex, setCurrentIndex] = useState(() => firstIncompleteIndex('morning', AZKAR.morning, readCounters()));
  const touchStartRef = useRef(null);
  const advanceTimer = useRef(null);
  const scrollAreaRef = useRef(null);

  const items = AZKAR[category] || [];
  const selectedCategory = categories.find((item) => item.key === category) || categories[0];
  const currentItem = items[currentIndex] || items[0];

  useEffect(() => {
    try {
      localStorage.setItem('lamaz-azkar-counters', JSON.stringify(remaining));
    } catch {
      return undefined;
    }
  }, [remaining]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [category, currentIndex]);

  const completedCount = useMemo(
    () => items.filter((item) => remaining[makeCounterKey(category, item)] === 0).length,
    [category, items, remaining],
  );

  function getRemaining(item) {
    const key = makeCounterKey(category, item);
    return remaining[key] ?? item.repetitions;
  }

  function goTo(index) {
    window.clearTimeout(advanceTimer.current);
    if (!items.length) return;
    setCurrentIndex(Math.max(0, Math.min(index, items.length - 1)));
  }

  function changeCategory(nextCategory) {
    window.clearTimeout(advanceTimer.current);
    const nextItems = AZKAR[nextCategory] || [];
    setCategory(nextCategory);
    setCurrentIndex(firstIncompleteIndex(nextCategory, nextItems, remaining));
  }

  function decrement(item) {
    if (!item) return;
    const key = makeCounterKey(category, item);
    const value = getRemaining(item);
    if (value <= 0) return;

    const nextValue = Math.max(0, value - 1);
    setRemaining((current) => ({ ...current, [key]: nextValue }));
    triggerHaptic(nextValue === 0 ? [22, 45, 34] : 18, hapticsEnabled);

    if (nextValue === 0 && currentIndex < items.length - 1) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => setCurrentIndex((index) => Math.min(index + 1, items.length - 1)), 420);
    }
  }

  function resetItem(item) {
    if (!item) return;
    const key = makeCounterKey(category, item);
    setRemaining((current) => ({ ...current, [key]: item.repetitions }));
  }

  function resetCategory() {
    setRemaining((current) => {
      const next = { ...current };
      for (const item of items) next[makeCounterKey(category, item)] = item.repetitions;
      return next;
    });
    setCurrentIndex(0);
  }

  function handleTouchStart(event) {
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current;
    const touch = event.changedTouches?.[0];
    touchStartRef.current = null;
    if (!start || !touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.abs(dx) < 56) return;
    if (Math.abs(dx) <= Math.abs(dy) * 1.35) return;

    if (dx < 0) goTo(currentIndex + 1);
    else goTo(currentIndex - 1);
  }

  if (!currentItem) return null;

  const count = getRemaining(currentItem);
  const complete = count === 0;
  const itemProgress = currentItem.repetitions > 0
    ? Math.round(((currentItem.repetitions - count) / currentItem.repetitions) * 100)
    : 100;
  const positionProgress = items.length ? ((currentIndex + 1) / items.length) * 100 : 0;

  return (
    <section className="azkar-screen">
      <div className="azkar-category-tabs" role="tablist" aria-label={t(language, 'azkar.title')}>
        {categories.map((item) => (
          <button
            key={item.key}
            type="button"
            className={category === item.key ? 'active' : ''}
            onClick={() => changeCategory(item.key)}
            role="tab"
            aria-selected={category === item.key}
          >
            {t(language, item.titleKey)}
          </button>
        ))}
      </div>

      <div className="azkar-position-card">
        <div className="azkar-position-copy">
          <div>
            <span>{t(language, selectedCategory.hintKey)}</span>
            <strong>{t(language, 'azkar.position', { current: currentIndex + 1, total: items.length })}</strong>
          </div>
          <button type="button" onClick={resetCategory}>{t(language, 'azkar.resetAll')}</button>
        </div>
        <div className="azkar-position-progress" aria-hidden="true">
          <span style={{ width: `${positionProgress}%` }} />
        </div>
      </div>

      <div className="azkar-swipe-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <article className={`azkar-slide ${complete ? 'complete' : ''}`} key={`${category}-${currentItem.id}`}>
          <div className="azkar-slide-topline">
            <div>
              <span className="azkar-number">{t(language, 'azkar.number', { number: currentIndex + 1 })}</span>
              <h3>{getAzkarName(currentItem, language)}</h3>
            </div>
            <span className="azkar-repeat-label">{t(language, 'azkar.times', { count: currentItem.repetitions })}</span>
          </div>

          <div className="azkar-scroll-area" ref={scrollAreaRef}>
            <p className="azkar-arabic azkar-arabic-slide" dir="rtl" lang="ar">{currentItem.arabic}</p>

            <details className="azkar-details">
              <summary>{t(language, 'azkar.details')}</summary>
              <div className="azkar-details-body">
                <div className="azkar-detail-block" dir="ltr">
                  <span>{t(language, 'azkar.transcription')}</span>
                  <p>{currentItem.transcription}</p>
                </div>
                <div className="azkar-detail-block azkar-translation-block">
                  <span>{t(language, 'azkar.translation')}</span>
                  <p>{getAzkarMeaning(currentItem, language)}</p>
                </div>
              </div>
            </details>

            <div className="azkar-meta azkar-slide-meta">
              <span>{currentItem.reference}</span>
              <a href={AZKAR_SOURCE[category]} target="_blank" rel="noreferrer">azkar.ru</a>
            </div>
          </div>

          <div className="azkar-counter-zone">
            <button
              type="button"
              className={`azkar-counter azkar-counter-large ${complete ? 'done' : ''}`}
              onClick={() => decrement(currentItem)}
              disabled={complete}
              aria-label={t(language, 'azkar.counterLabel', { count })}
              style={{ '--counter-progress': `${itemProgress * 3.6}deg` }}
            >
              <span className="azkar-counter-inner">
                {complete ? <CheckIcon size={30} /> : count}
              </span>
            </button>

            <div className="azkar-counter-copy">
              <strong>{complete ? t(language, 'azkar.done') : t(language, 'azkar.remaining', { count })}</strong>
              <span>{complete ? t(language, 'azkar.completedHint') : t(language, 'azkar.tapHint')}</span>
              <button type="button" onClick={() => resetItem(currentItem)}>{t(language, 'azkar.reset')}</button>
            </div>
          </div>
        </article>

      </div>

      <div className="azkar-dots" aria-label={t(language, 'azkar.position', { current: currentIndex + 1, total: items.length })}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`${index === currentIndex ? 'active' : ''} ${getRemaining(item) === 0 ? 'complete' : ''}`}
            onClick={() => goTo(index)}
            aria-label={t(language, 'azkar.number', { number: index + 1 })}
          />
        ))}
      </div>

      <p className="azkar-swipe-hint">{t(language, 'azkar.swipeHint')}</p>
      <p className="azkar-completed-total">{t(language, 'azkar.progress', { done: completedCount, total: items.length })}</p>
    </section>
  );
}
