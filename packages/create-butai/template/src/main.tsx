/**
 * React entry. The app imports the engine CSS and ONE theme; @butai/deck never
 * imports theme CSS itself (themes are scoped to [data-theme="<id>"], inert
 * until <html data-theme> matches). Swap the theme by changing the import + the
 * data-theme value below (see @butai/themes for the full list).
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@butai/deck/styles/engine.css';
import '@butai/themes/themes/dark.css';

import { App } from './App';

document.documentElement.setAttribute('data-theme', 'dark');

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
