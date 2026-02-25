# Browser ONNX OCR Lab

A browser-only OCR experiment lab that compares preprocessing pipelines in real time.

## MVP implemented
- Vite + TypeScript web app
- Image upload and 3 pipeline comparison:
  - `raw`
  - `grayscale`
  - `binary`
- Per-pipeline output card with:
  - transformed image preview
  - prediction text (6-digit)
  - confidence score
  - latency (ms)
- Test suite for preprocessing and inference wrapper logic

## Why this is portfolio-worthy
- Shows practical ML product thinking: pipeline quality is treated as measurable, not cosmetic.
- Demonstrates browser-side inference workflow shape (no backend dependency).
- Provides clear extension point to plug in a real ONNX OCR model.

## Quick start
```bash
npm install
npm run dev
npm test
npm run build
```

## Current architecture
- `src/preprocess.ts`: image preprocessing stages
- `src/ocr.ts`: inference wrapper (MVP uses deterministic placeholder path)
- `src/main.ts`: UI orchestration and pipeline comparison rendering
- `tests/`: unit tests for preprocessing + inference wrapper

## Next steps
1. Replace placeholder inference with real ONNX model session loading
2. Add character-level confidence visualization
3. Add sample dataset replay and CSV benchmark export
