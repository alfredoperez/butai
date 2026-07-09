/**
 * Butai Studio — React root (phase-4 §0.1).
 *
 * CSS import chain is LOAD-BEARING and MUST stay in this exact order (§0.1):
 *   1. ./globals.css          — Tailwind layers + shadcn tokens (preflight loads FIRST)
 *   2. deck engine + linktree — the deck's own .slide-scoped rules
 *   3. all 13 theme CSS       — each scoped to [data-theme="<id>"], inert until matched
 *   4. slide-kit aggregator   — kit slide styles (Group D's @butai/slide-kit/styles/index.css)
 *
 * Tailwind's preflight loads first; the engine + theme CSS load AFTER and win on the
 * preview surface via class/attribute-scoped selectors (higher specificity than bare
 * preflight resets). Never apply Tailwind utilities to `.slide*` internals.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './globals.css';

import '@butai/deck/styles/engine.css';
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

// Slide-kit styles: the deterministic aggregator (slide-base + every per-item CSS),
// produced by @butai/slide-kit's generator (P4 Group D CSS-closure fix).
import '@butai/slide-kit/styles/index.css';

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
