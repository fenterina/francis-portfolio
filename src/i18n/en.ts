export const en = {
  language: "en",
  metadata: {
    title: "Francis - Creative frontend developer",
    description:
      "Francis is a creative frontend developer making thoughtful digital experiences.",
    themeColor: "#7562D8",
  },
  images: {
    heroPortrait:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    aboutPortrait:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85",
  },
  nav: {
    homeLabel: "Francis home",
    openLabel: "Open navigation",
    closeLabel: "Close navigation",
    about: "About",
    projects: "Projects",
    skills: "Skills",
    contact: "Let's talk",
  },
  hero: {
    eyebrow: "Frontend developer / designer",
    titleStart: "Interfaces with a little",
    titleAccent: "more feeling.",
    description:
      "I'm Francis, a creative developer who turns thoughtful ideas into clear, lively digital experiences that people enjoy using.",
    workLink: "#projects",
    workLabel: "See my work",
    contactLink: "#contact",
    contactLabel: "Start a conversation",
    availability: "Available for selected freelance projects",
    portraitLabel: "Portrait of Francis",
    portraitAlt: "Portrait of Francis smiling",
  },
  about: {
    eyebrow: "A bit about me",
    title: "Good work lives where logic meets wonder.",
    paragraphs: [
      "I care about the details that make a product feel obvious: the rhythm of a page, the weight of a button, the quiet confidence of a well-made system. My practice brings together frontend craft, visual design, and a healthy curiosity about how people move through the web.",
      "When I'm away from the screen, you'll usually find me collecting print magazines, walking unfamiliar streets, or making a very strong case for one more typeface.",
    ],
    badge: ["Curious", "by default"],
    portraitAlt: "Francis working as a creative developer",
    factsLabel: "Professional facts",
    facts: [
      { value: "06+", label: "Years creating" },
      { value: "24", label: "Projects shipped" },
      { value: "04", label: "Time zones worked" },
    ],
  },
  projects: {
    eyebrow: "Selected work",
    title: "A few things I've helped bring to life.",
    intro:
      "A small selection of collaborations, experiments, and digital products made with thoughtful people.",
    items: [
      {
        title: "Sonder Finance",
        category: "Product design + build",
        description:
          "A calmer way for independent teams to understand their money and make their next move.",
        tags: ["Astro", "TypeScript", "UX"],
        preview: "preview-purple",
        year: "2024",
        href: "https://example.com/sonder-finance",
        linkLabel: "View project",
      },
      {
        title: "Mori Studio",
        category: "Brand platform",
        description:
          "A warm, editorial home for a small studio making beautiful things with purpose.",
        tags: ["Webflow", "Art direction"],
        preview: "preview-mint",
        year: "2024",
        href: "https://example.com/mori-studio",
        linkLabel: "View project",
      },
      {
        title: "Field Notes",
        category: "Editorial experience",
        description:
          "A flexible reading experience for stories about place, process, and the people behind both.",
        tags: ["Next.js", "CMS", "Motion"],
        preview: "preview-yellow",
        year: "2023",
        href: "https://example.com/field-notes",
        linkLabel: "View project",
      },
      {
        title: "Orbit OS",
        category: "Design system",
        description:
          "A practical visual language that helped a growing product team move with more confidence.",
        tags: ["Figma", "Systems", "React"],
        preview: "preview-coral",
        year: "2023",
        href: "https://example.com/orbit-os",
        linkLabel: "View project",
      },
    ],
  },
  skills: {
    eyebrow: "How I work",
    title: "A flexible toolkit for thoughtful digital work.",
    intro:
      "The tools change. The intention doesn't: make it clear, make it useful, make it feel like someone cared.",
    groups: [
      {
        title: "Frontend craft",
        description:
          "Astro, React, TypeScript, semantic HTML, accessible CSS, performance.",
      },
      {
        title: "Visual systems",
        description:
          "Design tokens, responsive layouts, interaction patterns, motion, prototyping.",
      },
      {
        title: "Product thinking",
        description:
          "Information architecture, user flows, content strategy, product direction.",
      },
      {
        title: "Good collaboration",
        description:
          "Clear communication, kind critique, documentation, and calm momentum.",
      },
    ],
  },
  contact: {
    eyebrow: "Have a good idea?",
    title: "Let's make something people remember.",
    intro:
      "Tell me what you're working on, where it feels stuck, or what you're excited about. I usually reply within a couple of days.",
    email: "hello@francis.design",
    emailHref: "mailto:hello@francis.design",
    ctaLabel: "Say hello",
    social: [
      { label: "LinkedIn", href: "https://www.linkedin.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
  footer: {
    copyright: "Designed + built by Francis, 2024",
    backToTop: "Back to top",
  },
} as const;

export type Locale = typeof en;
