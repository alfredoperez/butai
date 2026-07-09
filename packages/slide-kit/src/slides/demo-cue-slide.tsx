/**
 * DemoCueSlide — `Live Demo` badge + h1 + optional subtitle.
 * The cue card that drops the speaker out of the deck and into the demo.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Badge } from "../primitives/badge.js";
import { Subtitle } from "../primitives/subtitle.js";
import { Icon, type IconName } from "../primitives/icon.js";

interface DemoCueSlideProps {
  chapter?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Badge copy ("Live Demo" / …) */
  cue?: string;
  iconName?: IconName;
  background?: BackgroundPattern;
}

export function DemoCueSlide({
  chapter = "Live Demo",
  title,
  subtitle,
  cue = "Live Demo",
  iconName = "terminal",
  background = "blueprint",
}: DemoCueSlideProps) {
  return (
    <Slide chapter={chapter} variant="demo" background={background}>
      <Badge variant="accent">
        <Icon name={iconName} size={14} /> {cue}
      </Badge>
      <h1>{title}</h1>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Slide>
  );
}
