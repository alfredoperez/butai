/**
 * Butai playground — React root (P2 Group B).
 * Routes live in the app (plan Q3); the engine imports zero router code.
 * Theme CSS is imported by the app, never by @butai/deck (plan Q2): every
 * theme file is scoped to [data-theme="<id>"], so loading all 13 is inert
 * until <html data-theme> matches.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@butai/deck/styles/engine.css';
import '@butai/deck/styles/overview.css';
import '@butai/deck/styles/linktree.css';

import '@butai/themes/themes/brand.css';
import '@butai/themes/themes/dark.css';
import '@butai/themes/themes/light.css';
import '@butai/themes/themes/aurora.css';
import '@butai/themes/themes/glassmorphism.css';
import '@butai/themes/themes/neon.css';
import '@butai/themes/themes/warm-noir.css';
import '@butai/themes/themes/brutalist.css';
import '@butai/themes/themes/midnight-coral.css';
import '@butai/themes/themes/blueprint.css';
import '@butai/themes/themes/atelier.css';
import '@butai/themes/themes/stage.css';
import '@butai/themes/themes/marker.css';

import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
