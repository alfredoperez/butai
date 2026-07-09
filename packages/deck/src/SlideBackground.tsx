import { useMemo } from "react";

export type BackgroundPattern =
  | "dots"
  | "grid"
  | "particles"
  | "beams"
  | "noise"
  | "blueprint"
  | "none";

interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

function Particles() {
  const particles = useMemo<ParticleData[]>(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * -20,
        drift: (Math.random() - 0.5) * 60,
      })),
    [],
  );

  return (
    <div className="slide-bg slide-bg--particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="slide-particle"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function SlideBackground({ pattern }: { pattern: BackgroundPattern }) {
  if (pattern === "none") return null;
  if (pattern === "particles") return <Particles />;
  return <div className={`slide-bg slide-bg--${pattern}`} />;
}
