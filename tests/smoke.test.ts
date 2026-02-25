import { benchmarkStub } from '../src/main';

const v = benchmarkStub();
if (!('model' in v)) throw new Error('benchmark stub failed');
