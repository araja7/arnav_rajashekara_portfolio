import { ExternalLink } from "lucide-react";

interface PublicationCardProps {
  publication: {
    id: string;
    title: string;
    type: string;
    venue: string;
    year: string;
    description: string;
    highlights?: string[];
    link?: string;
    linkLabel?: string;
  };
  index: number;
}

/** A publication as a title card in a gold frame. */
export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <article aria-labelledby={`publication-${publication.id}`} className="gold-frame bg-ash/60 px-7 py-10 md:px-14 md:py-14">
      <h2
        id={`publication-${publication.id}`}
        className="gilded text-[1.6rem] md:text-[2.2rem] font-semibold leading-[1.15] tracking-[0.02em]"
      >
        {publication.title}
      </h2>
      <p className="mt-5 text-lg italic text-bone">{publication.venue}</p>
      <p className="credit mt-2 text-[0.66rem] text-bone-dim">
        {publication.type} · {publication.year}
      </p>
      <div className="gold-rule my-8 opacity-60" aria-hidden="true" />
      <p className="max-w-[65ch] text-[1.12rem] leading-[1.8] text-bone">{publication.description}</p>

      {publication.highlights && publication.highlights.length > 0 && (
        <ul className="mt-4 list-inside list-disc space-y-1 text-bone-dim">
          {publication.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}

      {publication.link && (
        <a
          href={publication.link}
          target="_blank"
          rel="noopener noreferrer"
          className="credit mt-9 inline-flex h-11 items-center gap-2 bg-gold px-6 text-[0.68rem] text-void transition-colors hover:bg-gold-bright"
        >
          {publication.linkLabel ?? "View publication"}
          <ExternalLink size={14} />
        </a>
      )}
    </article>
  );
}
