/**
 * LinktreePage — a per-talk landing page: speaker chip, talk header, a primary
 * "view the deck" CTA, link rows, socials, footer. Fully data-driven: every
 * rendered string and URL arrives via props — the consumer resolves slugs,
 * configs, and routing (this component renders plain <a> elements).
 *
 * Styles: import `@butai/deck/styles/linktree.css` in the consuming app.
 */

/** One link row. Local type — no kit dependency. */
export interface LinktreeLink {
  /** emoji (or short glyph) shown in the row's media square */
  icon?: string;
  label: string;
  detail?: string;
  href?: string;
  /** image thumbnail; wins over `icon` */
  imgSrc?: string;
}

export interface LinktreePageProps {
  talk: {
    title: string;
    /** ISO date (e.g. "2026-07-07") */
    date: string;
    tagline?: string;
    /** fallback shown when `tagline` is absent */
    description?: string;
    /** full-bleed blurred backdrop image URL */
    cover?: string;
  };
  speaker: {
    name: string;
    role?: string;
    bio?: string;
    avatar?: string;
  };
  /** related links (articles, repos, …) */
  links?: LinktreeLink[];
  linksHeading?: string;
  socials?: LinktreeLink[];
  /** href of the deck CTA; omitted → no CTA row */
  deckHref?: string;
  deckLabel?: string;
  /** href of the "all presentations" footer link; omitted → link not rendered */
  homeHref?: string;
  /** footer website link (e.g. the speaker's site) */
  footer?: { label: string; href: string };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function LinkRow({ link }: { link: LinktreeLink }) {
  const inner = (
    <>
      <span className="lt-row__media" aria-hidden="true">
        {link.imgSrc ? (
          <img src={link.imgSrc} alt="" />
        ) : link.icon ? (
          <span className="lt-row__emoji">{link.icon}</span>
        ) : (
          <span className="lt-row__dot" />
        )}
      </span>
      <span className="lt-row__text">
        <span className="lt-row__label">{link.label}</span>
        {link.detail && <span className="lt-row__detail">{link.detail}</span>}
      </span>
      <span className="lt-row__chev" aria-hidden="true">
        →
      </span>
    </>
  );
  if (link.href) {
    return (
      <a
        className="lt-row"
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }
  return <div className="lt-row lt-row--inert">{inner}</div>;
}

export function LinktreePage({
  talk,
  speaker,
  links,
  linksHeading = "Related links",
  socials,
  deckHref,
  deckLabel = "View the talk",
  homeHref,
  footer,
}: LinktreePageProps) {
  return (
    <div className="lt-root">
      {talk.cover && (
        <div
          className="lt-cover"
          style={{ backgroundImage: `url("${talk.cover}")` }}
        />
      )}
      <main className="lt-card">
        <header className="lt-head">
          {speaker.avatar && (
            <img className="lt-avatar" src={speaker.avatar} alt={speaker.name} />
          )}
          <div className="lt-speaker">
            <div className="lt-speaker__name">{speaker.name}</div>
            {speaker.role && (
              <div className="lt-speaker__role">{speaker.role}</div>
            )}
            {speaker.bio && <p className="lt-speaker__bio">{speaker.bio}</p>}
          </div>
        </header>

        <section className="lt-talk">
          <div className="lt-talk__date">{formatDate(talk.date)}</div>
          <h1 className="lt-talk__title">{talk.title}</h1>
          {talk.tagline ? (
            <p className="lt-talk__tagline">{talk.tagline}</p>
          ) : talk.description ? (
            <p className="lt-talk__tagline">{talk.description}</p>
          ) : null}
        </section>

        {deckHref && (
          <a href={deckHref} className="lt-row lt-row--primary">
            <span className="lt-row__media" aria-hidden="true">
              <span className="lt-row__emoji">🎤</span>
            </span>
            <span className="lt-row__text">
              <span className="lt-row__label">{deckLabel}</span>
              <span className="lt-row__detail">Open the slides</span>
            </span>
            <span className="lt-row__chev" aria-hidden="true">
              →
            </span>
          </a>
        )}

        {links && links.length > 0 && (
          <div className="lt-links" aria-label={linksHeading}>
            <div className="lt-links__heading">{linksHeading}</div>
            {links.map((l, i) => (
              <LinkRow key={`${l.label}-${i}`} link={l} />
            ))}
          </div>
        )}

        {socials && socials.length > 0 && (
          <div className="lt-links lt-links--socials" aria-label="Socials">
            {socials.map((s, i) => (
              <LinkRow key={`social-${s.href ?? s.label}-${i}`} link={s} />
            ))}
          </div>
        )}

        {(footer || homeHref) && (
          <footer className="lt-footer">
            {footer && (
              <a href={footer.href} target="_blank" rel="noreferrer">
                {footer.label}
              </a>
            )}
            {homeHref && (
              <a href={homeHref} className="lt-footer__home">
                ← All presentations
              </a>
            )}
          </footer>
        )}
      </main>
    </div>
  );
}
