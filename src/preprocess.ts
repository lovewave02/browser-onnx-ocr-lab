export type Pipeline = 'raw' | 'grayscale' | 'binary';

function createImageData(width: number, height: number): ImageData {
  if (typeof ImageData !== 'undefined') {
    return new ImageData(width, height);
  }

  return {
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4),
    colorSpace: 'srgb'
  } as ImageData;
}

function createCanvas(w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

export function toImageData(img: HTMLImageElement): ImageData {
  const c = createCanvas(img.naturalWidth, img.naturalHeight);
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, c.width, c.height);
}

export function grayscale(input: ImageData): ImageData {
  const out = createImageData(input.width, input.height);
  for (let i = 0; i < input.data.length; i += 4) {
    const r = input.data[i];
    const g = input.data[i + 1];
    const b = input.data[i + 2];
    const v = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    out.data[i] = v;
    out.data[i + 1] = v;
    out.data[i + 2] = v;
    out.data[i + 3] = 255;
  }
  return out;
}

export function binary(input: ImageData, threshold = 128): ImageData {
  const gray = grayscale(input);
  const out = createImageData(gray.width, gray.height);
  for (let i = 0; i < gray.data.length; i += 4) {
    const v = gray.data[i] >= threshold ? 255 : 0;
    out.data[i] = v;
    out.data[i + 1] = v;
    out.data[i + 2] = v;
    out.data[i + 3] = 255;
  }
  return out;
}

export function renderImageData(data: ImageData): HTMLCanvasElement {
  const c = createCanvas(data.width, data.height);
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.putImageData(data, 0, 0);
  return c;
}
