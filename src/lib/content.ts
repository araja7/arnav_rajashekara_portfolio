// ============================================
// PORTFOLIO CONTENT - EDIT ALL TEXT HERE
// ============================================

import projectLegal from "@/assets/project-legal.png";
import projectS3 from "@/assets/project-s3.png";
import projectRobot from "@/assets/project-robot.png";
import projectMario from "@/assets/project-mario.png";

export const siteConfig = {
  name: "Arnav Rajashekara",
  title: "Software Engineer | Data Scientist",
  tagline: "Building intelligent systems, one line of code at a time.",
  email: "arnavrajashekara2@gmail.com",
  location: "Seattle, WA",
  resumeUrl: "/resume.pdf",
};

export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/arnav-rajashekara-078995275/",
  email: "mailto:arnavrajashekara2@gmail.com",
};

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export const aboutContent = {
  headline: "About Me",
  intro: `I'm a Computer Science and Data Science student passionate about building 
    intelligent systems that solve real-world problems. With a strong foundation in 
    software engineering and machine learning, I love turning complex data into 
    actionable insights.`,
  bio: [
    `My journey in tech started with a curiosity about how things work. That curiosity 
    led me to explore everything from low-level systems programming to cutting-edge 
    machine learning models.`,
    `When I'm not coding, you'll find me contributing to open-source projects, 
    exploring new technologies, or mentoring aspiring developers. I believe in 
    continuous learning and sharing knowledge with the community.`,
    `I'm currently seeking opportunities where I can apply my skills in software 
    engineering and data science to build impactful products.`,
  ],
};

export const skills = [
  {
    category: "Languages",
    items: [
      { name: "Python", icon: "python" },
      { name: "C", icon: "c" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "SQL", icon: "database" },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "TailwindCSS", icon: "tailwind" },
      { name: "Framer Motion", icon: "framer" },
    ],
  },
  {
    category: "Backend & Cloud",
    items: [
      { name: "Node.js", icon: "nodejs" },
      { name: "AWS", icon: "aws" },
      { name: "Docker", icon: "docker" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    category: "Data Science & ML",
    items: [
      { name: "Machine Learning", icon: "brain" },
      { name: "NLP", icon: "message" },
      { name: "PyTorch", icon: "pytorch" },
      { name: "Pandas", icon: "chart" },
    ],
  },
];

export const timeline = [
  {
    year: "2024",
    title: "Software Engineering Intern",
    company: "Tech Company",
    description: "Built scalable microservices and contributed to ML pipeline development.",
    type: "work" as const,
  },
  {
    year: "2023",
    title: "Research Assistant",
    company: "University AI Lab",
    description: "Conducted research on natural language processing and published findings.",
    type: "research" as const,
  },
  {
    year: "2023",
    title: "Hackathon Winner",
    company: "HackMIT",
    description: "First place for an AI-powered accessibility tool.",
    type: "award" as const,
  },
  {
    year: "2022",
    title: "Open Source Contributor",
    company: "Various Projects",
    description: "Active contributor to popular open-source machine learning libraries.",
    type: "project" as const,
  },
  {
    year: "2021",
    title: "Started CS + DS Degree",
    company: "University",
    description: "Began dual degree program in Computer Science and Data Science.",
    type: "education" as const,
  },
];

export const projects = [
  {
    id: "ai-legal-classifier",
    title: "AI Legal Document Classifier",
    description: "An NLP-powered system that automatically classifies and extracts key information from legal documents, reducing manual review time by 70%.",
    longDescription: `Built a comprehensive NLP pipeline using transformer models to classify legal documents 
      into categories such as contracts, agreements, and court filings. Implemented named entity recognition 
      for extracting parties, dates, and key clauses. The system processes thousands of documents daily 
      with 95% accuracy.`,
    techStack: ["Python", "PyTorch", "Transformers", "FastAPI", "PostgreSQL"],
    image: projectLegal,
    github: "https://github.com/arnav/legal-classifier",
    demo: "https://legal-classifier.demo.com",
    featured: true,
  },
  {
    id: "s3-storage-browser",
    title: "S3 Storage Browser",
    description: "A modern, intuitive web interface for browsing and managing AWS S3 buckets with advanced filtering and batch operations.",
    longDescription: `Developed a React-based file browser for AWS S3 that supports drag-and-drop uploads, 
      advanced search and filtering, batch operations, and real-time sync. Implemented presigned URLs 
      for secure file access and integrated with AWS IAM for fine-grained permissions.`,
    techStack: ["React", "TypeScript", "AWS SDK", "TailwindCSS", "Node.js"],
    image: projectS3,
    github: "https://github.com/arnav/s3-browser",
    demo: "https://s3-browser.demo.com",
    featured: true,
  },
  {
    id: "robot-analytics",
    title: "Robot Analytics Dashboard",
    description: "Real-time industrial robot monitoring dashboard with predictive maintenance alerts and performance analytics.",
    longDescription: `Created a comprehensive dashboard for monitoring industrial robots in manufacturing plants. 
      Features include real-time telemetry visualization, anomaly detection using ML models, predictive 
      maintenance scheduling, and historical performance analysis. Reduced unplanned downtime by 40%.`,
    techStack: ["React", "D3.js", "Python", "TensorFlow", "InfluxDB", "Grafana"],
    image: projectRobot,
    github: "https://github.com/arnav/robot-analytics",
    demo: "https://robot-analytics.demo.com",
    featured: true,
  },
  {
    id: "super-mario-c",
    title: "Super Mario Clone in C",
    description: "A faithful recreation of the classic Super Mario Bros game built from scratch in C with custom physics engine.",
    longDescription: `Developed a complete platformer game engine in C, including sprite rendering, 
      collision detection, physics simulation, and level parsing. Features multiple levels, 
      power-ups, enemies with AI behavior, and a custom level editor. Optimized for smooth 
      60 FPS gameplay on minimal hardware.`,
    techStack: ["C", "SDL2", "Custom Physics", "Level Editor"],
    image: projectMario,
    github: "https://github.com/arnav/super-mario-c",
    demo: null,
    featured: false,
  },
];

export const contactContent = {
  headline: "Get In Touch",
  description: `I'm always open to discussing new opportunities, interesting projects, 
    or just having a chat about technology. Feel free to reach out!`,
  formLabels: {
    name: "Your Name",
    email: "Email Address",
    message: "Your Message",
    submit: "Send Message",
  },
};
