import './styles.css';

import { runPipeline } from './ocr';
import { binary, grayscale, renderImageData, toImageData, type Pipeline } from './preprocess';

const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
const runBtn = document.querySelector<HTMLButtonElement>('#runBtn');
const resultsEl = document.querySelector<HTMLElement>('#results');

if (!fileInput || !runBtn || !resultsEl) {
  throw new Error('required DOM elements missing');
}

let loadedImage: HTMLImageElement | null = null;

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  loadedImage = await loadImage(url);
  runBtn.disabled = false;
});

runBtn.addEventListener('click', async () => {
  if (!loadedImage) return;
  resultsEl.innerHTML = '';

  const raw = toImageData(loadedImage);
  const variants: Array<{ name: Pipeline; data: ImageData }> = [
    { name: 'raw', data: raw },
    { name: 'grayscale', data: grayscale(raw) },
    { name: 'binary', data: binary(raw, 140) }
  ];

  for (const v of variants) {
    const result = await runPipeline(v.name, v.data);
    resultsEl.appendChild(buildCard(v.name, v.data, result.prediction, result.confidence, result.latencyMs));
  }
});

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = src;
  });
}

function buildCard(
  pipeline: Pipeline,
  data: ImageData,
  prediction: string,
  confidence: number,
  latencyMs: number
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'panel card';

  const title = document.createElement('h3');
  title.textContent = pipeline;

  const canvas = renderImageData(data);
  canvas.className = 'preview';

  const info = document.createElement('p');
  info.className = 'meta';
  info.textContent = `prediction=${prediction} | confidence=${(confidence * 100).toFixed(0)}% | latency=${latencyMs}ms`;

  card.append(title, canvas, info);
  return card;
}
