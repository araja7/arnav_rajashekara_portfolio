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
  tagline: "Automate the ordinary. Engineer the impossible.",
  email: "arnavrajashekara2@gmail.com",
  location: "Seattle, WA",
  resumeUrl: "/arnav_rajashekara_resume.pdf",
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
  intro: `I am a passionate fourth-year B.S. computer science & statistics student with a strong 
          foundation in programming and a deep curiosity for cutting-edge technologies. 
          I am eager to explore the endless possibilities of the digital world and am committed to 
          continuous learning. I am enthusiastic about solving real-world problems through 
          innovative software solutions.`,
  bio: [
    `My journey in tech started with a realization that technology was not just a luxury 
    that affords convenience, but instead actually expands human capability. That realization 
    sparked a fundamental curiosity: How far can software push the boundaries of human potential? 
    That question has fueled me ever since, as I aim to be at the forefront of the efforts to find out.`,
    `When I'm not coding, you'll find me weightlifting, watching sports, reading, playing piano, 
    or exploring new technologies. I also love spending time with my friends and family.`,
    `I love opportunities to apply my skills in software 
    engineering and data science to build impactful products.`,
  ],
};

export const skills = [
  {
    category: "Languages",
    items: [
      { name: "Python", icon: "python" },
      { name: "Java", icon: "java" },
      { name: "C", icon: "c" },
      { name: "TypeScript", icon: "typescript" },
      { name: "SQL", icon: "database" },
      { name: "R", icon: "r" },
      { name: "MATLAB", icon: "matlab" },
      { name: "x86 Assembly", icon: "assembly" },
    ],
  },
  {
    category: "Web/Frontend",
    items: [
      { name: "React.js", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "HTML", icon: "html" },
      { name: "RSS", icon: "rss" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Flask", icon: "flask" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
  },
  {
    category: "ML/Data Science",
    items: [
      { name: "PyTorch", icon: "pytorch" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "scikit-learn", icon: "sklearn" },
      { name: "Pandas", icon: "chart" },
      { name: "NumPy", icon: "numpy" },
      { name: "SciPy", icon: "scipy" },
      { name: "Matplotlib", icon: "matplotlib" },
      { name: "BeautifulSoup", icon: "beautifulsoup" },
    ],
  },
  {
    category: "Cloud/DevOps",
    items: [
      { name: "AWS", icon: "aws" },
      { name: "Azure", icon: "azure" },
      { name: "Terraform", icon: "terraform" },
      { name: "Git", icon: "git" },
      { name: "Jenkins", icon: "jenkins" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Docker", icon: "docker" },
    ],
  },
  {
    category: "Testing",
    items: [
      { name: "Cucumber", icon: "cucumber" },
      { name: "JUnit", icon: "junit" },
    ],
  },
];

export const timeline = [
  {
    year: "2025",
    title: "Systems & Analytics Engineer Intern",
    company: "American Honda Motor Company",
    description: "Prototyped and engineered industrial production applications using Figma for UI/UX design and Ignition SCADA for real-time process visualization, integrating user feedback through iterative testing cycles.",
    type: "work" as const,
  },
  {
    year: "2025",
    title: "Software Engineering Intern",
    company: "NetJets Inc. (A Berkshire Hathaway Company)",
    description: "Developed a secure, scalable, and intuitive web-based portal for business analysts to view AWS S3 data.",
    type: "work" as const,
  },
  {
    year: "2025",
    title: "Hackathon Finalist",
    company: "DataFest 2025",
    description: "Placed top three at the 9th annual DataFest Hackathon, a competition that consisted of over 200 competitors.",
    type: "project" as const,
  },
  {
    year: "2024",
    title: "ML Research Assistant - Project Manager",
    company: "American Institutions & Methodologies (AIM) Lab, under Dr. Janet Box-Steffensmeier at the Ohio State University",
    description: "Began leading a research team to develop an issue classification model that categorizes SCOTUS petitions into issue areas. Supporting author on multiple papers and currently writing undergraduate thesis.",
    type: "work" as const,
  },
  {
    year: "2024",
    title: "Software Engineer Intern",
    company: "Mimecast",
    description: "Played a pivotal role in advancing cutting-edge technology designed to fortify customers' collaboration platforms.",
    type: "work" as const,
  },
  {
    year: "2023",
    title: "Student Researcher",
    company: "Buckeye AutoDrive",
    description: "Working as part of a team to develop and demonstrate an autonomous vehicle that can navigate urban driving courses as described by SAE J3016 Standard Level 4 automation.",
    type: "work" as const,
  },
  {
    year: "2023",
    title: "Hackathon Finalist",
    company: "Make OHI/O 2023",
    description: "Won 2nd place in the Human Centered Computing challenge at the 10th annual Make OHI/O competition.",
    type: "project" as const,
  },
  {
    year: "2022",
    title: "Started CSE + Statistics Degree",
    company: "The Ohio State University",
    description: "Began pursuing a Bachelor of Science in Computer Science & Engineering and Statistics",
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
