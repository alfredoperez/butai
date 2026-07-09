/**
 * SpeakerIntroSlide — avatar + name + role + optional bio + links.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";

export interface SpeakerLink {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface SpeakerIntroSlideProps {
  chapter?: string;
  avatar: string;
  name: string;
  role: string;
  bio?: ReactNode;
  links?: SpeakerLink[];
  background?: BackgroundPattern;
}

export function SpeakerIntroSlide({
  chapter = "Speaker",
  avatar,
  name,
  role,
  bio,
  links,
  background = "blueprint",
}: SpeakerIntroSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      <div className="speaker" data-animate="fade-up">
        <img src={avatar} alt={name} className="speaker__avatar" />
        <div className="speaker__copy">
          <h1 className="speaker__name title-serif">{name}</h1>
          <div className="speaker__role">{role}</div>
          {bio && <p className="speaker__bio">{bio}</p>}
          {links && links.length > 0 && (
            <ul className="speaker__links">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer">
                    {l.icon} {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Slide>
  );
}
