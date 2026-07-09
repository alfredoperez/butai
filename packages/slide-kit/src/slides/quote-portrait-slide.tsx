/**
 * QuotePortraitSlide — a testimonial with a face: big quote + a portrait (photo
 * or initials medallion) + name/role + optional logo. Social proof with a
 * person attached, vs. the text-only QuoteSlide.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";

interface QuotePortraitSlideProps {
  chapter: string;
  quote: ReactNode;
  name: string;
  role?: string;
  /** portrait image; falls back to initials from `name` */
  avatar?: string;
  /** small logo/wordmark image beside the attribution */
  logo?: string;
  background?: BackgroundPattern;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function QuotePortraitSlide({
  chapter,
  quote,
  name,
  role,
  avatar,
  logo,
  background = "none",
}: QuotePortraitSlideProps) {
  return (
    <Slide chapter={chapter} align="center" background={background}>
      <figure className="qp" data-animate="fade-up">
        <span className="qp__mark">&ldquo;</span>
        <blockquote className="qp__quote">{quote}</blockquote>
        <figcaption className="qp__by">
          <span
            className="qp__avatar"
            style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
          >
            {!avatar && initials(name)}
          </span>
          <span className="qp__meta">
            <span className="qp__name">{name}</span>
            {role && <span className="qp__role">{role}</span>}
          </span>
          {logo && <img className="qp__logo" src={logo} alt="" />}
        </figcaption>
      </figure>
    </Slide>
  );
}
