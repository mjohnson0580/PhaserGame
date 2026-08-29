import { describe, it, expect } from 'vitest';
import { clamp, wrap } from './math';

// Layer 1: pure logic. No Phaser, no canvas, no jsdom needed — fast and stable.
// This is where the bulk of your game's rules should be tested.

describe('clamp', () => {
  it('returns the value when already in range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps below the minimum and above the maximum', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});

describe('wrap', () => {
  it('leaves in-range values unchanged', () => {
    expect(wrap(10, 0, 360)).toBe(10);
  });

  it('wraps values past the max back to the start', () => {
    expect(wrap(370, 0, 360)).toBe(10);
  });

  it('wraps negative values up into range', () => {
    expect(wrap(-10, 0, 360)).toBe(350);
  });
});
