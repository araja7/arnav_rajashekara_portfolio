import { motion } from "framer-motion";
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

export function PublicationCard({ publication, index }: PublicationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-card border border-border hover-lift"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
          {publication.type}
        </span>
        <span className="text-muted-foreground">{publication.year}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-foreground leading-snug">
        {publication.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{publication.venue}</p>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {publication.description}
      </p>

      {publication.highlights && publication.highlights.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
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
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {publication.linkLabel ?? "View publication"}
          <ExternalLink size={14} />
        </a>
      )}
    </motion.article>
  );
}
