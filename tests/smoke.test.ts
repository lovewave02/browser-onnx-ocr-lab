import { describe, expect, it } from 'vitest';

import { runPipeline } from '../src/ocr';

describe('smoke', () => {
  it('runs pipeline without crashing', async () => {
    const data = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([
        255, 255, 255, 255,
        0, 0, 0, 255,
        120, 120, 120, 255,
        80, 80, 80, 255
      ]),
      colorSpace: 'srgb'
    } as ImageData;

    const r = await runPipeline('binary', data);
    expect(r.pipeline).toBe('binary');
  });
});
