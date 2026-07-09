/**
 * __PROJECT_NAME__ — a minimal butai deck.
 *
 * A tiny presentation built on @butai/deck. Add more slides below, or pull
 * ready-made archetypes from the registry with `npx butai add <slide>`.
 */
import { Slide, SlideEngine } from '@butai/deck';

export function App() {
  return (
    <SlideEngine title="__PROJECT_NAME__" transition="slide" chapterBar>
      <Slide
        chapter="Intro"
        align="center"
        className="cover"
        background="dots"
        title="__PROJECT_NAME__"
        notes="Welcome — this is the presenter note."
      >
        <h1>__PROJECT_NAME__</h1>
        <p>A deck built on butai. Edit src/App.tsx to make it yours.</p>
      </Slide>

      <Slide chapter="Intro" title="Steps" notes="Two step reveals before advancing.">
        <h2 data-animate="fade-up">Reveal, step by step</h2>
        <ul>
          <li>This line is always visible</li>
          <li data-step>Press the arrow key to reveal this</li>
          <li data-step>…and this</li>
        </ul>
      </Slide>

      <Slide chapter="Wrap" title="Next" notes="Where to go from here.">
        <h2>Next steps</h2>
        <ul data-stagger>
          <li>Swap the theme in src/main.tsx</li>
          <li>Run `npx butai add cover-slide` to copy in an archetype</li>
          <li>Add your own &lt;Slide&gt; components</li>
        </ul>
      </Slide>
    </SlideEngine>
  );
}
