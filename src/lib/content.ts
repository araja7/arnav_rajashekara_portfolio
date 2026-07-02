// ============================================
// PORTFOLIO CONTENT - EDIT ALL TEXT HERE
// ============================================

import projectGridsmart from "@/assets/project-gridsmart.png";
import projectStockrag from "@/assets/project-stockrag.png";
import projectApexclip from "@/assets/project-apexclip.png";

export const siteConfig = {
  name: "Arnav Rajashekara",
  title: "Software Engineer",
  // tagline: "Automate the ordinary. Engineer the impossible.",
  email: "arnavrajashekara2@gmail.com",
  location: "Seattle, WA",
  resumeUrl: "/arnav_rajashekara_resume.pdf",
};

export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/arnav-rajashekara-078995275/",
  email: "mailto:arnavrajashekara2@gmail.com",
  github: "https://github.com/araja7",
};

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Publications", href: "/publications" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export const publicationsContent = {
  headline: "Publications",
  subtitle:
    "Research output and academic writing.",
};

export const publications = [
  {
    id: "undergrad-thesis-scotus-2026",
    title: "Inferring Agenda: An Unsupervised Approach to SCOTUS Issue Classification",
    type: "Undergraduate Thesis",
    venue: "The Ohio State University",
    year: "2026",
    description:
      "Presents an end-to-end machine learning pipeline to process, embed, and cluster large-scale legal text data, addressing computational efficiency and interpretability challenges present in high-dimensional natural language data.",
    link: "https://kb.osu.edu/handle/1811/107152",
    linkLabel: "View paper",
  },
];

export const aboutContent = {
  headline: "About Me",
  intro: [
    `I am a passionate Master of Engineering in Computer Science student at Cornell University with a strong 
    foundation in programming and a deep curiosity for cutting-edge technologies. 
    I am eager to explore the endless possibilities of the digital world and am committed to 
    continuous learning. I am enthusiastic about solving real-world problems through 
    innovative software solutions.`,
    `My journey in tech started with a realization that technology was not just a luxury 
    that affords convenience, but instead actually expands human capability. That realization 
    sparked a fundamental curiosity: How far can software push the boundaries of human potential? 
    That question has fueled me ever since, as I aim to be at the forefront of the efforts to find out.`,],
          
  bio: [
    `When I'm not coding, you'll find me weightlifting, watching sports (Go Hawks!), reading, playing piano, 
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
      { name: "Pydantic", icon: "pydantic" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
  },
  {
    category: "AI/ML",
    items: [
      { name: "PyTorch", icon: "pytorch" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "LangChain", icon: "langchain" },
      { name: "scikit-learn", icon: "sklearn" },
      { name: "Pandas", icon: "chart" },
      { name: "NumPy", icon: "numpy" },
      { name: "SciPy", icon: "scipy" },
      { name: "Matplotlib", icon: "matplotlib" },
      { name: "Scrapy", icon: "scrapy" },
      { name: "Playwright", icon: "playwright" },
      { name: "BeautifulSoup", icon: "beautifulsoup" },
    ],
  },
  {
    category: "Cloud/DevOps",
    items: [
      { name: "AWS", icon: "aws" },
      { name: "Azure", icon: "azure" },
      { name: "Supabase", icon: "supabase" },
      { name: "Hetzner", icon: "hetzner" },
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
      { name: "Pytest", icon: "pytest" },
      { name: "Cucumber", icon: "cucumber" },
      { name: "JUnit", icon: "junit" },
    ],
  },
];

export const timeline = [
  {
    year: "2026",
    title: "Began MEng Computer Science Degree",
    company: "Cornell University",
    description: "Began pursuing a Master of Engineering in Computer Science at Cornell University, Ithaca. Focus on Computing Systems.",
    type: "education" as const,
  },
  {
    year: "2026",
    title: "Founding Software Engineer Intern",
    company: "AI Recruiting Stealth Startup",
    description:
      "Architected a concurrent data pipeline that reduced collection latency by ~90% across multiple platforms. Integrated local (Ollama/LLaMA3) and cloud (OpenAI) LLMs for structured data extraction, and built a resilient scraping system using Scrapy and Playwright.",
    type: "work" as const,
  },
  {
    year: "2026",
    title: "Graduated with B.S. in Computer Science & Engineering with a Minor in Statistics",
    company: "The Ohio State University",
    description: "Graduated Cum Laude with Honors Research Distinction. GPA: 3.65/4.00",
    type: "education" as const,
  },
  {
    year: "2026",
    title: "Midwest Political Science Association (MPSA) Conference Presentation",
    company: "Midwest Political Science Association",
    description: "Finished writing and successfully defended undergraduate thesis: Inferring Agenda: An Unsupervised Approach to SCOTUS Issue Classification. Presented at the 2026 MPSA Conference in Chicago, and was nominated for best undergraduate presentation.",
    link: "https://kb.osu.edu/handle/1811/107152",
    linkLabel: "View thesis",
    type: "work" as const,
  },
  {
    year: "2025",
    title: "Systems & Analytics Engineer Intern",
    company: "American Honda Motor Company",
    description: "Prototyped and engineered industrial production applications using Figma for UI/UX design and Ignition SCADA for real-time process visualization, integrating user feedback through iterative testing cycles.",
    type: "work" as const,
  },
  {
    year: "2025",
    title: "Software Engineer Intern",
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
    description: "Began leading a research team to develop an issue classification model that categorizes SCOTUS petitions into issue areas. Supporting author on multiple papers and started writing undergraduate thesis.",
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
    description: "Worked as part of a team to develop and demonstrate an autonomous vehicle that can navigate urban driving courses as described by SAE J3016 Standard Level 4 automation.",
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
    description: "Began pursuing a Bachelor of Science in Computer Science & Engineering with a Minor in Statistics",
    type: "education" as const,
  },
];

export const projects = [
  {
    id: "apexclip",
    title: "ApexClip",
    description:
      "Automated sports highlight compiler that uses YOLOv8 object tracking and motion detection to extract exciting plays from raw game footage into a single highlight reel.",
    longDescription: `A solo project that turns raw sports footage into a compiled highlight video without manual editing. ApexClip scans each frame with YOLOv8 and ByteTrack to track players and the ball, using per-object velocity to flag high-motion moments worth clipping.

PySceneDetect handles camera-cut detection so tracking state resets cleanly across broadcast angle changes. A temporal frame buffer stores pre-roll in memory, letting the engine capture context before each peak action without re-seeking the source video, then stitches post-play frames into the final reel.

The pipeline outputs both a diagnostic stream with tracking overlays and the finished highlight compilation. Built with Python, OpenCV, Ultralytics YOLOv8, PySceneDetect, ByteTrack, and NumPy.`,
    techStack: ["Python", "OpenCV", "YOLOv8", "ByteTrack", "PySceneDetect", "NumPy"],
    image: projectApexclip,
    github: "https://github.com/araja7/ApexClip",
    demo: null,
    featured: true,
  },
  {
    id: "stockrag",
    title: "StockRAG",
    description:
      "RAG-based stock recommendation system grounded in SEC EDGAR data for ~7,100 companies, with ChromaDB retrieval and Gemini-generated answers with filing citations.",
    longDescription: `Done in collaboration with five other engineers for our senior capstone project, StockRAG lets users ask natural-language questions (e.g. "suggest a semiconductor stock with strong free cash flow"). A FastAPI backend retrieves the most relevant company profiles, descriptions, and annual snapshots from a ChromaDB vector store, then Google Gemini produces grounded recommendations with citations back to EDGAR filings.

The repo includes a one-shot cold-start orchestrator that sets up the Python venv, installs backend and frontend dependencies, prompts for API keys, streams a prebuilt Chroma snapshot from Hugging Face (~256 MB), and launches the backend (port 8000) and React + Vite frontend (port 5173).

Data pipeline coverage spans 7,138 EDGAR-listed companies across three Chroma collections (profiles, descriptions, annual snapshots), embedded with sentence-transformers/all-MiniLM-L6-v2. The RAG flow merges multi-collection search, formats a cited context blob, and maps LLM output to structured recommendations with EDGAR source URLs.`,
    techStack: ["Python", "FastAPI", "React", "ChromaDB", "Gemini", "Vite"],
    image: projectStockrag,
    github: "https://github.com/araja7/StockRag",
    demo: null,
    featured: true,
  },
  {
    id: "gridsmart",
    title: "GridSmart – Cost-Aware Energy Task Scheduler",
    description:
      "Full-stack tool that syncs household energy demand with real-time PJM grid pricing, using constraint-based scheduling to minimize cost and flatten load profiles.",
    longDescription: `GridSmart addresses residential energy peaks by synchronizing high-load appliance runs with live Locational Marginal Prices from the PJM Interconnection. Users set earliest-start and must-finish-by windows; a sliding-window optimizer finds the lowest-cost schedule while respecting household kW limits across competing tasks.

Core features include real-time PJM API ingestion with CSV fallback, greedy scheduling with min-heap task ordering, resource contention management to avoid exceeding max household draw, and a React dashboard with Recharts visualizations and savings reports versus a FIFO baseline.

Built with a FastAPI backend (scheduler, grid service, caching, fail-safe mode) and a Vite + React frontend. Simulated tests on PJM Ohio Hub data showed 15–40% cost reductions by shifting load from afternoon peaks to overnight troughs.`,
    techStack: ["Python", "FastAPI", "React", "Recharts", "PJM API", "Vite"],
    image: projectGridsmart,
    github: "https://github.com/araja7/GridSmart",
    demo: null,
    featured: true,
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
