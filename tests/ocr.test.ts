import { describe, expect, it } from 'vitest';

import { runPipeline } from '../src/ocr';

function uniformImageData(v: number, size = 10): ImageData {
  return {
    width: size,
    height: size,
    data: new Uint8ClampedArray(Array.from({ length: size * size * 4 }, (_, i) => (i % 4 === 3 ? 255 : v))),
    colorSpace: 'srgb'
  } as ImageData;
}

describe('runPipeline', () => {
  it('returns bounded confidence and fixed-width prediction', async () => {
    const r = await runPipeline('raw', uniformImageData(120));
    expect(r.confidence).toBeGreaterThanOrEqual(0.05);
    expect(r.confidence).toBeLessThanOrEqual(0.99);
    expect(r.prediction).toHaveLength(6);
  });
});
