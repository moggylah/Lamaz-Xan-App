import { useEffect, useMemo, useState } from 'react';
import { CheckIcon } from './Icons.jsx';
import { AZKAR, AZKAR_SOURCE, getAzkarMeaning, getAzkarName } from '../lib/azkar.js';
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

export default function AzkarView({ language = 'ru' }) {
  const [category, setCategory] = useState('morning');
  const [remaining, setRemaining] = useState(readCounters);

  const items = AZKAR[category] || [];
  const selectedCategory = categories.find((item) => item.key === category) || categories[0];

  useEffect(() => {
    try {
      localStorage.setItem('lamaz-azkar-counters', JSON.stringify(remaining));
    } catch {
      return undefined;
    }
  }, [remaining]);

  const completedCount = useMemo(
    () => items.filter((item) => remaining[makeCounterKey(category, item)] === 0).length,
    [category, items, remaining],
  );

  const progress = items.length ? Math.round((completedCount / items.length) * 100) : 0;

  function getRemaining(item) {
    const key = makeCounterKey(category, item);
    return remaining[key] ?? item.repetitions;
  }

  function decrement(item) {
    const key = makeCounterKey(category, item);
    setRemaining((current) => {
      const value = current[key] ?? item.repetitions;
      return { ...current, [key]: Math.max(0, value - 1) };
    });
  }

  function resetItem(item) {
    const key = makeCounterKey(category, item);
    setRemaining((current) => ({ ...current, [key]: item.repetitions }));
  }

  function resetCategory() {
    setRemaining((current) => {
      const next = { ...current };
      for (const item of items) {
        next[makeCounterKey(category, item)] = item.repetitions;
      }
      return next;
    });
  }

  return (
    <section className="azkar-screen">
      <div className="azkar-overview">
        <div className="azkar-overview-copy">
          <div>
            <h2>{t(language, 'azkar.title')}</h2>
            <p>{t(language, 'azkar.progress', { done: completedCount, total: items.length })}</p>
          </div>
          <strong>{progress}%</strong>
        </div>
        <div className="azkar-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="azkar-category-tabs" role="tablist" aria-label={t(language, 'azkar.title')}>
        {categories.map((item) => (
          <button
            key={item.key}
            type="button"
            className={category === item.key ? 'active' : ''}
            onClick={() => setCategory(item.key)}
            role="tab"
            aria-selected={category === item.key}
          >
            {t(language, item.titleKey)}
          </button>
        ))}
      </div>

      <div className="azkar-category-meta">
        <span>{t(language, selectedCategory.hintKey)}</span>
        <button type="button" onClick={resetCategory}>{t(language, 'azkar.resetAll')}</button>
      </div>

      <div className="azkar-list">
        {items.map((item, index) => {
          const count = getRemaining(item);
          const complete = count === 0;
          const itemProgress = item.repetitions > 0
            ? Math.round(((item.repetitions - count) / item.repetitions) * 100)
            : 100;

          return (
            <article className={`azkar-item ${complete ? 'complete' : ''}`} key={`${category}-${item.id}`}>
              <div className="azkar-item-topline">
                <div>
                  <span className="azkar-number">{t(language, 'azkar.number', { number: index + 1 })}</span>
                  <h3>{getAzkarName(item, language)}</h3>
                </div>
                <span className="azkar-repeat-label">{t(language, 'azkar.times', { count: item.repetitions })}</span>
              </div>

              <p className="azkar-arabic" dir="rtl" lang="ar">{item.arabic}</p>
              {item.transcription && (
                <div className="azkar-transcription-block" dir="ltr">
                  <span className="azkar-transcription-label">{t(language, 'azkar.transcription')}</span>
                  <p className="azkar-transcription">{item.transcription}</p>
                </div>
              )}
              <p className="azkar-meaning">{getAzkarMeaning(item, language)}</p>

              <div className="azkar-meta">
                <span>{item.reference}</span>
                <a href={AZKAR_SOURCE[category]} target="_blank" rel="noreferrer">azkar.ru</a>
              </div>

              <div className="azkar-counter-row">
                <button
                  type="button"
                  className={`azkar-counter ${complete ? 'done' : ''}`}
                  onClick={() => decrement(item)}
                  disabled={complete}
                  aria-label={t(language, 'azkar.counterLabel', { count })}
                  style={{ '--counter-progress': `${itemProgress * 3.6}deg` }}
                >
                  <span className="azkar-counter-inner">
                    {complete ? <CheckIcon size={25} /> : count}
                  </span>
                </button>

                <div className="azkar-counter-text">
                  <strong>
                    {complete ? t(language, 'azkar.done') : t(language, 'azkar.remaining', { count })}
                  </strong>
                  <span>{complete ? t(language, 'azkar.completedHint') : t(language, 'azkar.tapHint')}</span>
                </div>

                <button type="button" className="azkar-reset-one" onClick={() => resetItem(item)}>
                  {t(language, 'azkar.reset')}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
