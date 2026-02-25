import { describe, expect, it } from 'vitest';

import { binary, grayscale } from '../src/preprocess';

function mockImageData(values: number[]): ImageData {
  return {
    width: values.length,
    height: 1,
    data: new Uint8ClampedArray(values.flatMap((v) => [v, v, v, 255])),
    colorSpace: 'srgb'
  } as ImageData;
}

describe('preprocess', () => {
  it('converts to grayscale and keeps alpha', () => {
    const data = mockImageData([10, 120, 250]);
    const out = grayscale(data);
    expect(out.data[3]).toBe(255);
    expect(out.data[7]).toBe(255);
    expect(out.data[11]).toBe(255);
  });

  it('binarizes by threshold', () => {
    const data = mockImageData([20, 180]);
    const out = binary(data, 100);
    expect(out.data[0]).toBe(0);
    expect(out.data[4]).toBe(255);
  });
});
