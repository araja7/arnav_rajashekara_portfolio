import { Briefcase, ExternalLink, FolderGit2, GraduationCap } from "lucide-react";
import { timeline } from "@/lib/content";

type Entry = (typeof timeline)[number];

const typeIcons = {
  work: Briefcase,
  education: GraduationCap,
  project: FolderGit2,
};

function groupByYear(entries: readonly Entry[]) {
  const groups: { year: string; entries: Entry[] }[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.year === entry.year) last.entries.push(entry);
    else groups.push({ year: entry.year, entries: [entry] });
  }
  return groups;
}

/** An ember thread running back through the years, newest first. */
export function Timeline() {
  const stages = groupByYear(timeline);

  return (
    <ol>
      {stages.map((stage) => (
        <li key={stage.year} className="grid grid-cols-[3.4rem_1fr] gap-x-5 md:grid-cols-[8.5rem_1fr] md:gap-x-10">
          <div>
            <span className="sticky top-28 block pt-0.5 font-display text-[1.3rem] md:text-[2.4rem] font-semibold leading-none">
              <span className="gilded">{stage.year}</span>
            </span>
          </div>

          <ol className="relative pb-6 pl-8 md:pl-12 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-[linear-gradient(to_bottom,hsl(var(--fire-deep)),hsl(var(--gold-dim))_40%,hsl(var(--gold-dim)/0.4))]">
            {stage.entries.map((item, i) => {
              const Icon = typeIcons[item.type];
              return (
                <li key={`${item.title}-${i}`} className="relative pb-12 last:pb-10">
                  <span
                    className="absolute -left-[calc(2rem+14px)] md:-left-[calc(3rem+14px)] top-0 grid h-7 w-7 place-items-center rounded-full bg-void text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold))]"
                    aria-hidden="true"
                  >
                    <Icon size={13} strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-[1.12rem] md:text-[1.3rem] font-semibold leading-snug tracking-[0.02em] text-bone">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 italic gilt-label">{item.company}</p>
                  <p className="mt-3 max-w-[65ch] leading-[1.75] text-bone-dim">{item.description}</p>
                  {"link" in item && item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="credit mt-4 inline-flex items-center gap-1.5 text-[0.64rem] text-gold underline decoration-gold-dim underline-offset-4 hover:text-gold-bright"
                    >
                      {item.linkLabel ?? "Learn more"}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}
