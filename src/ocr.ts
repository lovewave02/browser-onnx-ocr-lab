import type { Pipeline } from './preprocess';

export interface PipelineResult {
  pipeline: Pipeline;
  prediction: string;
  confidence: number;
  latencyMs: number;
}

function imageContrast(data: ImageData): number {
  const values: number[] = [];
  for (let i = 0; i < data.data.length; i += 4) {
    values.push(data.data[i]);
  }
  const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / 128;
}

function pseudoPrediction(data: ImageData): string {
  let hash = 0;
  for (let i = 0; i < data.data.length; i += 32) {
    hash = (hash * 31 + data.data[i]) % 1000000;
  }
  return hash.toString().padStart(6, '0');
}

export async function runPipeline(pipeline: Pipeline, data: ImageData): Promise<PipelineResult> {
  const start = performance.now();

  // Placeholder inference path. Model loading is optional in this MVP.
  await Promise.resolve();

  const contrast = imageContrast(data);
  const pipelineBias = pipeline === 'binary' ? 0.09 : pipeline === 'grayscale' ? 0.05 : 0.02;
  const confidence = Math.max(0.05, Math.min(0.99, Number((0.45 + contrast * 0.3 + pipelineBias).toFixed(2))));

  return {
    pipeline,
    prediction: pseudoPrediction(data),
    confidence,
    latencyMs: Number((performance.now() - start).toFixed(2))
  };
}
