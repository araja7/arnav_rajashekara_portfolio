import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image: string;
    github: string;
    demo: string | null;
    featured: boolean;
  };
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover-lift">
        {/* Image container */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <Button asChild variant="default" size="sm">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} />
                Code
              </a>
            </Button>
            {project.demo && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} />
                  Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
