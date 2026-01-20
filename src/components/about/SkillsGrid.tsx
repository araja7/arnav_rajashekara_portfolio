import { motion } from "framer-motion";
import { 
  Code2, Database, Server, Brain, MessageSquare, 
  BarChart3, Container, Cloud, Boxes, Palette,
  FileCode, Terminal, Layers, Cpu, GitBranch,
  Github, Send, Webhook, CheckSquare2, FileText,
  BookOpen, LineChart, FlaskConical, Circle,
  TestTube, Calculator, Rss, Zap, Rocket,
  Grid3x3, Settings, Cog, Radio
} from "lucide-react";
import { skills } from "@/lib/content";

const iconMap: Record<string, any> = {
  python: FileCode,
  java: Code2,
  javascript: Code2,
  typescript: Code2,
  c: Terminal,
  html: Code2,
  database: Database,
  r: Code2,
  matlab: Calculator,
  assembly: Terminal,
  react: Boxes,
  nextjs: Layers,
  tailwind: Palette,
  rss: Radio,
  nodejs: Server,
  flask: FlaskConical,
  fastapi: Zap,
  postgresql: Database,
  pytorch: Cpu,
  tensorflow: Cpu,
  sklearn: Brain,
  chart: BarChart3,
  numpy: Grid3x3,
  scipy: Calculator,
  matplotlib: LineChart,
  beautifulsoup: FlaskConical,
  aws: Cloud,
  azure: Cloud,
  terraform: Layers,
  git: GitBranch,
  jenkins: Settings,
  kubernetes: Container,
  docker: Container,
  cucumber: FlaskConical,
  junit: TestTube,
};

export function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border hover-lift"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {category.category}
          </h3>
          <div className="flex flex-wrap gap-3">
            {category.items.map((skill, skillIndex) => {
              const Icon = iconMap[skill.icon] || Code2;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.3, 
                    delay: categoryIndex * 0.1 + skillIndex * 0.05 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
                >
                  <Icon size={16} className="text-primary" />
                  {skill.name}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
