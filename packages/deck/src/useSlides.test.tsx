// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useSlides } from './useSlides.js';

// jsdom has no WAAPI / may lack rAF depending on setup — the magic-move path
// is not under test here (it's gated behind data-magicmove anyway).
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0) as unknown as number;
}

/** Deck fixture: 2 chapters, slide 1 carries two [data-step] items. */
function buildDeck(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <div data-slide data-chapter="Intro" data-title="Cover" data-notes="Welcome"></div>
    <div data-slide data-chapter="Intro">
      <ul>
        <li data-step>step one</li>
        <li data-step>step two</li>
      </ul>
    </div>
    <div data-slide data-chapter="Wrap" data-title="Close"></div>
  `;
  document.body.appendChild(container);
  return container;
}

describe('useSlides', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('derives chapters, titles and notes from data attributes on init', () => {
    const container = buildDeck();
    const { result } = renderHook(() => useSlides());

    act(() => result.current.init(container));

    expect(result.current.total).toBe(3);
    expect(result.current.chapters).toEqual([
      { name: 'Intro', firstSlide: 0 },
      { name: 'Wrap', firstSlide: 2 },
    ]);
    // titles fall back to the chapter name when data-title is absent
    expect(result.current.titles).toEqual(['Cover', 'Intro', 'Close']);
    expect(result.current.notes).toEqual(['Welcome', '', '']);
    expect(result.current.current).toBe(0);
    expect(result.current.currentChapter).toBe('Intro');
    expect(container.querySelectorAll('[data-slide]')[0].classList).toContain(
      'active',
    );
  });

  it('init activates the requested initial slide (deep link), clamped to range', () => {
    const container = buildDeck();
    const { result } = renderHook(() => useSlides());

    act(() => result.current.init(container, 2));
    expect(result.current.current).toBe(2);
    expect(result.current.currentChapter).toBe('Wrap');
    expect(container.querySelectorAll('[data-slide]')[2].classList).toContain(
      'active',
    );
  });

  it('next() reveals pending steps before advancing the slide', () => {
    const container = buildDeck();
    const { result } = renderHook(() => useSlides());
    act(() => result.current.init(container, 1));

    const steps = Array.from(
      container.querySelectorAll<HTMLElement>('[data-step]'),
    );
    expect(result.current.current).toBe(1);

    // first two presses reveal the steps — the slide must NOT change
    act(() => result.current.next());
    expect(steps[0].classList).toContain('step-visible');
    expect(result.current.current).toBe(1);

    act(() => result.current.next());
    expect(steps[1].classList).toContain('step-visible');
    expect(result.current.current).toBe(1);

    // all steps visible → the third press advances the slide
    act(() => result.current.next());
    expect(result.current.current).toBe(2);
  });

  it('prev() un-reveals the last step before going back a slide', () => {
    const container = buildDeck();
    const { result } = renderHook(() => useSlides());
    act(() => result.current.init(container, 1));

    act(() => result.current.next()); // reveal step one
    act(() => result.current.prev()); // hide it again — same slide
    expect(result.current.current).toBe(1);
    expect(
      container.querySelectorAll('[data-step].step-visible'),
    ).toHaveLength(0);

    act(() => result.current.prev()); // no steps visible → previous slide
    expect(result.current.current).toBe(0);
  });
});
