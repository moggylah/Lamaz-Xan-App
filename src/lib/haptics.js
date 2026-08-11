export function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function triggerHaptic(pattern = 18, enabled = true) {
  if (!enabled || !canVibrate()) return false;
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}
