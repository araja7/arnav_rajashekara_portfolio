import { ExternalLink, Github } from "lucide-react";
import { useLit } from "@/hooks/use-lit";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    techStack: string[];
    image: string | null;
    github: string;
    demo: string | null;
    featured: boolean;
  };
  index: number;
}

/** A project as a scene: a widescreen still that fades up out of black, then its title card. */
export function ProjectCard({ project }: ProjectCardProps) {
  const { ref, lit } = useLit<HTMLElement>(0.25);

  return (
    <article ref={ref} aria-labelledby={`project-${project.id}`} className="group">
      <div className="gold-frame relative p-2 md:p-3">
        <div className="relative overflow-hidden bg-void">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              className={cn(
                "aspect-[2.39/1] w-full object-cover transition-[filter,transform] duration-[1600ms] ease-out",
                lit
                  ? "scale-100 grayscale sepia brightness-[0.82] contrast-[1.08] saturate-[1.35] group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100 group-focus-within:grayscale-0 group-focus-within:sepia-0 group-focus-within:brightness-100 group-focus-within:contrast-100 group-focus-within:saturate-100"
                  : "scale-[1.04] grayscale sepia brightness-[0.15] saturate-[1.35]"
              )}
            />
          ) : (
            <div className="aspect-[2.39/1] w-full bg-ash" />
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,hsl(var(--void)/0.75))]"
            aria-hidden="true"
          />
          {project.featured && (
            <span className="credit absolute left-4 top-3 text-[0.62rem] text-gold-bright [text-shadow:0_1px_6px_hsl(0_0%_0%)] md:left-6 md:top-4">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h3
            id={`project-${project.id}`}
            className="font-display text-[1.9rem] md:text-[2.4rem] font-semibold uppercase leading-[1.04] tracking-[0.04em]"
          >
            <span className="gilded">{project.title}</span>
          </h3>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2" aria-label="Tech stack">
            {project.techStack.map((tech) => (
              <li key={tech} className="credit whitespace-nowrap text-[0.64rem] text-bone-dim">
                {tech}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="credit inline-flex h-11 items-center gap-2 px-5 text-[0.68rem] gilt-label gilt-edge transition-[filter] hover:brightness-125"
            >
              <Github size={15} strokeWidth={1.5} />
              Code
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="credit inline-flex h-11 items-center gap-2 px-5 text-[0.68rem] gilt-label gilt-edge transition-[filter] hover:brightness-125"
              >
                <ExternalLink size={15} strokeWidth={1.5} />
                Demo
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="text-[1.2rem] md:text-[1.3rem] font-normal leading-relaxed text-bone">{project.description}</p>
          <div className="mt-6 space-y-5 leading-[1.8] text-bone-dim">
            {project.longDescription
              .trim()
              .split(/\n\n+/)
              .map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph.trim()}</p>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}
