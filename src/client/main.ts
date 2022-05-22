import { boot } from './boot';
import { __addPikachu } from '@debug/special/pikachu';

const __window__ = window as any;

export const app = (__window__.app = boot());

__addPikachu(app.stage, { x: 500, y: 600 })

// const app = document.querySelector<HTMLDivElement>('#app')!
// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `
