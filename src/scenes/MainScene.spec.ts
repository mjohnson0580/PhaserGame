import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainScene } from './MainScene';

// Layer 2: scene wiring. Booting a full Phaser.Game in happy-dom is flaky, so
// instead we construct the scene and inject fake Phaser systems (`add`,
// `tweens`, `input`, `scale`). This verifies `create()` builds the right
// objects and registers input WITHOUT rendering anything.

function makeFakeSystems() {
  const text = { setOrigin: vi.fn().mockReturnThis() };
  const rectangle = { setStrokeStyle: vi.fn().mockReturnThis(), y: 0, angle: 0 };

  return {
    scale: { width: 1280, height: 720 },
    add: {
      text: vi.fn(() => text),
      rectangle: vi.fn(() => rectangle)
    },
    tweens: { add: vi.fn() },
    input: { on: vi.fn() }
  };
}

describe('MainScene.create', () => {
  let scene: MainScene;
  let sys: ReturnType<typeof makeFakeSystems>;

  beforeEach(() => {
    scene = new MainScene();
    sys = makeFakeSystems();
    // Assign the fakes onto the scene instance (bypassing Phaser's Systems).
    Object.assign(scene, sys);
  });

  it('adds the title and instruction text and the box', () => {
    scene.create();
    expect(sys.add.text).toHaveBeenCalledTimes(2);
    expect(sys.add.rectangle).toHaveBeenCalledOnce();
  });

  it('starts the idle bob tween', () => {
    scene.create();
    expect(sys.tweens.add).toHaveBeenCalled();
  });

  it('registers a pointerdown handler that spins the box', () => {
    scene.create();
    expect(sys.input.on).toHaveBeenCalledWith('pointerdown', expect.any(Function));

    // Fire the registered handler and confirm it queues a spin tween.
    const before = sys.tweens.add.mock.calls.length;
    const handler = sys.input.on.mock.calls[0][1] as () => void;
    handler();
    expect(sys.tweens.add.mock.calls.length).toBe(before + 1);
  });
});
