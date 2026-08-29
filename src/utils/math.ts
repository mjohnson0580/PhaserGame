/**
 * Pure, framework-free game math helpers.
 *
 * Keeping logic like this OUT of Phaser scenes is the single biggest win for
 * testability: these functions take numbers and return numbers, so they can be
 * unit-tested directly with zero Phaser/canvas setup. Push as much of your game
 * rules here (scoring, movement, collision math, state transitions) as you can.
 */

/** Constrain `value` to the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Wrap `value` into the half-open range [min, max), e.g. for screen-wrapping a
 * sprite or cycling an index. `wrap(370, 0, 360)` === `10`.
 */
export function wrap(value: number, min: number, max: number): number {
  const range = max - min;
  if (range <= 0) return min;
  return ((((value - min) % range) + range) % range) + min;
}
