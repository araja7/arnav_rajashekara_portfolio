import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Trophy, FlaskConical, FolderGit2 } from "lucide-react";
import { timeline } from "@/lib/content";

const typeIcons = {
  work: Briefcase,
  education: GraduationCap,
  award: Trophy,
  research: FlaskConical,
  project: FolderGit2,
};

const typeColors = {
  work: "bg-blue-500",
  education: "bg-green-500",
  award: "bg-yellow-500",
  research: "bg-purple-500",
  project: "bg-primary",
};

export function Timeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

      <div className="space-y-8">
        {timeline.map((item, index) => {
          const Icon = typeIcons[item.type];
          const colorClass = typeColors[item.type];
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ml-12 md:ml-0 ${isEven ? "md:text-right" : ""}`}>
                <div 
                  className={`inline-block p-6 rounded-2xl bg-card border border-border hover-lift ${
                    isEven ? "md:mr-8" : "md:ml-8"
                  }`}
                >
                  <span className="text-sm font-medium text-primary">{item.year}</span>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.company}</p>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Icon */}
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center shadow-lg`}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
