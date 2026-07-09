/**
 * Demo deck — 3 trivial slides authored fresh for the playground (plan Q3).
 * No kit components, no content from anywhere else: just <Slide>, plain HTML,
 * and the engine's data-attribute contract (data-step / data-animate /
 * data-stagger), which exercises steps, chapters, notes, and entrances.
 */
import { Slide, SlideEngine } from '@butai/deck';

export interface DemoDeckProps {
  initialSlide?: number;
  slide?: number;
  onSlideChange?: (index: number) => void;
}

export function DemoDeck({ initialSlide, slide, onSlideChange }: DemoDeckProps) {
  return (
    <SlideEngine
      title="Butai Demo"
      transition="slide"
      chapterBar
      watermark={{ label: 'butai', href: 'https://example.com' }}
      initialSlide={initialSlide}
      slide={slide}
      onSlideChange={onSlideChange}
    >
      <Slide
        chapter="Intro"
        align="center"
        className="cover"
        background="dots"
        title="Butai Demo"
        notes="Welcome note for presenter view"
      >
        <h1>Butai Demo</h1>
        <p>A tiny deck that exercises the engine: slides, steps, themes, print.</p>
      </Slide>

      <Slide
        chapter="Intro"
        title="Steps"
        notes="Two step reveals must land before the slide advances."
      >
        <h2 data-animate="fade-up">Reveal, step by step</h2>
        <ul>
          <li>This line is always visible</li>
          <li data-step>Step one appears on the first advance</li>
          <li data-step>Step two appears on the second advance</li>
        </ul>
      </Slide>

      <Slide chapter="Wrap" title="Wrap-up" notes="Recap and close.">
        <h2>That is the whole demo</h2>
        <ul data-stagger>
          <li>Three slides, two chapters</li>
          <li>Keyboard-driven steps</li>
          <li>Thirteen switchable themes</li>
          <li>Print-ready pages</li>
        </ul>
      </Slide>
    </SlideEngine>
  );
}
