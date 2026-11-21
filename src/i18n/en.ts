export type Certificate = {
  title: string;
  file: string;
  image?: string;
  thumb: string;
  preview: string;
  credentialUrl?: string;
};

export const en = {
  language: "en",
  site: {
    url: "https://francisenterina.work",
    canonicalHome: "https://francisenterina.work/",
    ogImage: "https://francisenterina.work/images/Logo_with_name.png",
    ogImageAlt: "Francis Enterina logo",
    googleSiteVerification: "M2nUoE72IQRMfIMna9vfpk-IdyZtdXDjzvl3WGyyCuA",
    personSchema: {
      name: "Francis Enterina",
      alternateName: "Francis Ronald Borja Enterina",
      jobTitle: "Software Developer",
      alumniOf: "Mindanao State University - Iligan Institute of Technology",
      addressLocality: "Iligan City",
      addressCountry: "PH",
      sameAs: [
        "https://www.linkedin.com/in/fenterina/",
        "https://github.com/fenterina",
        "https://www.youtube.com/@francisenterina4097",
        "https://www.instagram.com/f.enterina/",
      ],
    },
  },
  metadata: {
    title: "Francis Enterina | Information Systems Graduate & Software Developer",
    description:
      "Portfolio of Francis Enterina, an Information Systems graduate from MSU-IIT building mobile apps with React Native, TypeScript and Supabase. Based in Iligan City, Philippines.",
    themeColor: "#4169E1",
  },
  images: {
    brandMark: "/images/brand-logo-trimmed.png",
    brandMarkAlt: "Francis Enterina logo mark",
    brandLogo: "/images/Logo_with_name.png",
    brandLogoAlt: "Francis Enterina logo",
    navLogo: "/images/logo-white.png",
    heroPortrait: "/images/francis-portrait.jpg",
    aboutPortrait: "/images/francis-portrait.jpg",
    heroCityscapeAlt: "Iligan Cityscape illustration",
    featuredThumbAlt: "Red Carpet marketplace interface preview",
    contactAvatarAlt: "Francis Enterina",
    workHistoryIcon: "/images/work-history-icon.png",
    educationIcon: "/images/education-icon.png",
    recognitionIcon: "/images/leadership-recognition-icon.png",
    aiMasteryCertImage: "/certificates/thumbs/AI Mastery Cert.webp",
    aiMasteryCertAlt: "AI Mastery certificate",
    footerWebp1x: "/images/footer-illustration.webp",
    footerWebp2x: "/images/footer-illustration@2x.webp",
    footerPng1x: "/images/footer-illustration.png",
    footerPng2x: "/images/footer-illustration@2x.png",
  },
  nav: {
    brandName: "Francis",
    homeHref: "/",
    primaryAriaLabel: "Primary navigation",
    homeLabel: "Francis home",
    openLabel: "Open navigation",
    closeLabel: "Close navigation",
    home: "Home",
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    contact: "Let's Connect!",
    contactShort: "Contact",
    downloadCv: "Download CV",
    menuLabel: "Menu",
    closeShortLabel: "Close",
  },
  hero: {
    displayName: "Francis Enterina",
    fusedBio:
      "Information Systems graduate and software developer building thoughtful web applications, multi-role platforms, and reliable digital workflows.",
    exploreCta: {
      label: "Explore the work",
      href: "#projects",
    },
    brandTitle: "FRANCIS ENTERINA",
    brandPhrase: "Welcome to the portfolio of Francis Enterina.",
    eyebrow: "Software development / Product work / Digital operations",
    roleLine: "Software development, product work, and digital operations",
    eyebrowSegments: [
      "SOFTWARE DEVELOPMENT",
      "PRODUCT WORK",
      "DIGITAL OPERATIONS",
    ],
    titleMain: "Systems",
    titleSub: "That",
    titleAccent: "Perform",
    titleStart: "Interfaces with a little",
    description:
      "Information Systems graduate and software developer building thoughtful web applications, multi-role platforms, and reliable digital workflows.",
    lead:
      "Information Systems graduate and software developer building thoughtful web applications, multi-role platforms, and reliable digital workflows.",
    primaryCta: {
      label: "Explore My Work",
      href: "#projects",
    },
    secondaryCta: {
      label: "Download CV",
      href: "/documents/ENTERINA_CV_PROF.pdf",
      downloadName: "ENTERINA_CV_PROF.pdf",
    },
    dockLinks: [
      { id: "top", label: "Home", href: "#top", icon: "⌂" },
      { id: "projects", label: "Projects", href: "#projects", icon: "⊞" },
      { id: "skills", label: "Tools", href: "#skills", icon: "⚙", isToolsTrigger: true },
      { id: "contact", label: "Contact", href: "#contact", icon: "✉" },
    ],
    keywords: ["SCALABLE", "USER-CENTRIC", "FUNCTIONAL", "RELIABLE"],
    featuredCard: {
      badge: "FEATURED PROJECT",
      count: "01 / 01",
      title: "Red Carpet",
      summary:
        "Multi-role wedding planning marketplace & admin dashboard built with React Native, TypeScript, and Supabase.",
      image: "/Projects/redCarpetFrontPage.png",
      href: "/projects/red-carpet",
      dialogTrigger: "redcarpet-case-study",
      linkText: "View case study",
      ariaLabel: "Open Red Carpet case study",
    },
    metrics: [
      { value: "4+", label: "Roles & Internships" },
      { value: "30+", label: "Tools & Technologies" },
      { value: "Full-Cycle", label: "Product & Ops Execution" },
    ],
    contactCard: {
      avatar: "/images/picture%20bilyard.png",
      title: "Bring Your Vision To Life",
      description:
        "Available for software development, product, and digital operations opportunities.",
      href: "#contact",
    },
    workLink: "#projects",
    workLabel: "Explore My Work",
    contactLink: "#contact",
    contactLabel: "Start a conversation",
    availability: "Available for selected opportunities",
    portraitLabel: "Portrait of Francis",
    portraitAlt: "Portrait of Francis smiling",
  },
  about: {
    eyebrow: "A bit about Francis Enterina",
    title: "Don't be sad, it's such a waste of time.",
    paragraphs: [
      "I’m an Information Systems graduate at MSU-IIT. My path started in e-commerce and social media, where I managed Amazon PPC and BSR for clients and their brands, and handled marketing for a Salon Business based in Cebu. Those years taught me how people actually decide what to click, buy, and trust.",
      "Now I’m pairing that with a technical side: building projects, working with data, and learning how to make tools that are useful and not just functional. Based in the Philippines, open to remote roles, and always up for a good problem to untangle.",
    ],
    portraitAlt: "Francis working as a creative developer",
  },
  experience: {
    eyebrow: "03 / Experience",
    title: "Experience.",
    intro:
      "Marketing, product work, and systems thinking shaped by hands-on roles across digital operations and technology.",
    workLabel: "Work history",
    rolesCountUnit: "roles",
    educationLabel: "Education",
    recognitionLabel: "Recognition & leadership",
    work: [
      {
        period: "Jan 2026 - May 2026 · 5 mos",
        role: "Software Engineer Intern",
        organization: "Anura Innovations",
        employmentType: "Internship",
        location: "Iligan City · Hybrid",
        project: "Red Carpet",
        details: [
          "Built a multi-role mobile marketplace as part of a team with React Native, TypeScript, and Supabase, featuring role-based workflows, vendor bidding, real-time messaging, and integrated booking and payment systems.",
        ],
      },
      {
        period: "Sep 2023 - Apr 2026 · 2 yrs 8 mos",
        role: "Social Media Manager",
        organization: "Hues X Palette",
        employmentType: "Part-time",
        location: "Remote",
        details: [
          "Managed end-to-end social media operations across Facebook and Instagram, overseeing customer engagement, appointment coordination, and promotional campaigns.",
          "Handled high-volume customer inquiries via Meta Business Suite, ensuring timely responses and converting inquiries into confirmed bookings.",
          "Designed and executed targeted ad campaigns using audience segmentation, optimizing delivery through strategic scheduling and budget allocation.",
          "Coordinated appointment bookings using integrated platform tools and a manual Google Sheets tracking system after feature deprecation.",
        ],
      },
      {
        period: "Jan 2021 - Jan 2024 · 3 yrs 1 mo",
        role: "Assistant PPC and BSR Manager",
        organization: "Maven Agency",
        employmentType: "Freelance",
        location: "Remote",
        details: [
          "Managed and optimized Amazon PPC campaigns across multiple client accounts, improving ad efficiency and contributing to increased product visibility and sales performance.",
          "Analyzed keyword performance, bid strategies, and conversion data to refine targeting and maximize return on ad spend (ROAS).",
          "Assisted in boosting Best Seller Rank (BSR) through data-driven campaign adjustments and competitive market analysis.",
          "Assisted in implementing campaign improvements, reducing wasted ad spend and improving click-through rates.",
          "Handled 16 client accounts.",
        ],
      },
    ],
    education: [
      {
        period: "2022 - 2026",
        title: "Bachelor of Science in Information Systems",
        organization:
          "Mindanao State University - Iligan Institute of Technology",
        logo: "/images/msu-iit.png",
        logoAlt:
          "Mindanao State University - Iligan Institute of Technology logo",
      },
      {
        period: "2012 - 2022",
        title: "Grade School to Senior High",
        organization: "Lasalle Academy, Iligan City",
        logo: "/images/lasalle-academy.png",
        logoAlt: "La Salle Academy Iligan City logo",
      },
    ],
    recognition: [
      {
        title: "College of Computer Studies Executive Council",
        period: "2023 - 2024",
        description:
          "Managed organizational assets, inventory records, equipment lending, and resource allocation for council initiatives.",
      },
      {
        title: "Philippine Red Cross, WASAR Trainee",
        period: "2020",
        description:
          "Bronze member trained in survival techniques, CPR, rescue knot-tying, and aquatic emergency response.",
      },
    ],
  },
  projects: {
    eyebrow: "Selected work",
    title: "What I did",
    intro:
      "A small selection of collaborations, experiments, and digital products made with thoughtful people.",
    items: [
      {
        title: "Red Carpet",
        category: "Mobile app + admin dashboard",
        description:
          "An all-in-one wedding marketplace connecting couples, planners, and vendors in one clear, coordinated experience.",
        tags: ["React Native", "TypeScript", "Supabase"],
        preview: "preview-red-carpet",
        year: "2026",
        href: "/projects/red-carpet",
        linkLabel: "View case study",
      },
    ],
    redCarpetCaseStudy: {
      pageTitle: "Red Carpet | Wedding Planning App Case Study",
      pageDescription:
        "Red Carpet is a multi-role wedding planning marketplace built with React Native, TypeScript and Supabase by Francis Enterina.",
      canonicalUrl: "https://francisenterina.work/projects/red-carpet",
      backLabel: "Back to projects",
      eyebrow: "Case study",
      title: "Red Carpet",
      tagline:
        "An all-in-one wedding planning app that connects couples, wedding planners, and vendors, plus an admin analytics dashboard.",
      heroImage: "/Projects/redCarpetFrontPage.png",
      heroImageWebp: "/Projects/redCarpetFrontPage.webp",
      heroAlt: "Red Carpet mobile app and admin dashboard interface",
      closeLabel: "Close",
      closeAriaLabel: "Close Red Carpet case study",
      meta: [
        { label: "Company", value: "Anura Innovations" },
        { label: "Role", value: "Frontend & Backend Developer Intern" },
        { label: "Year", value: "2026" },
        { label: "Focus", value: "Mobile product, Marketplace, and Dashboard" },
      ],
      columns: [
        {
          label: "The brief",
          text: "Wedding planning is spread across many people and tools. Red Carpet brings couples, planners, and vendors into one marketplace for tasks, vendor booking, guests, and event coordination.",
        },
        {
          label: "What I did",
          text: "I created the app's frontend and backend components following user experience principles: the couple dashboard, vendor marketplace, activity planner, bookings, guests, and payments. I worked with developers to implement features and ran UI/UX testing and QA on the flows.",
        },
        {
          label: "The result",
          text: "A mobile app for three roles, plus a companion web dashboard showing real-time app status, an end-to-end user messaging feature, and metrics such as revenue, retention, and monthly active users.",
        },
      ],
      rolesHeading: "Three roles, one platform",
      roles: [
        {
          title: "Couple / Client",
          description:
            "Plans and organizes their wedding, books vendors, manages guests, and tracks progress.",
        },
        {
          title: "Wedding Planner",
          description:
            "Oversees wedding projects, coordinates vendors, and manages execution.",
        },
        {
          title: "Vendor",
          description:
            "Offers wedding services, manages bookings, and fulfills assigned tasks.",
        },
      ],
      featuresHeading: "Key features",
      features: [
        {
          number: "01",
          title: "Centralized Wedding Dashboard",
          description:
            "Set preferences, view curated vendors, and request quotations.",
        },
        {
          number: "02",
          title: "Integrated Vendor Marketplace",
          description: "Search, filter, compare, and book vendors.",
        },
        {
          number: "03",
          title: "Activity Planner",
          description: "Shared tasks, assignments, and deadline tracking.",
        },
        {
          number: "04",
          title: "Booking & Project Management",
          description: "Confirmations, workflows, and leads.",
        },
        {
          number: "05",
          title: "Guest & Invitation Management",
          description: "Guest lists, roles, and RSVP tracking.",
        },
        {
          number: "06",
          title: "Profile, Notifications & Payments",
          description: "Real-time alerts, payouts, and security controls.",
        },
      ],
      tags: ["React Native", "TypeScript", "Supabase"],
      githubLabel: "View GitHub",
      demoLabel: "Live demo",
      links: { github: "", demo: "" },
    },
  },
  skills: {
    eyebrow: "How I work",
    title: "Tools I use.",
    intro:
      "The tools change. The intention doesn't: make it clear, make it useful, make it feel like someone cared.",
    toolsLoopAriaLabel: "Tools I use",
    viewAllToolsLabel: "View all tools",
    certificatesCardTitle: "Certificates",
    certificatesCardSubtitle:
      "Certificates, diplomas, and additional training",
    certificatesCardLink: "View all certificates",
    certificatesDialog: {
      title: "Certificates",
      lede: "A collection of certificates and milestones from professional work, learning, and community involvement.",
      closeLabel: "Close",
      closeAriaLabel: "Close certificates",
      primaryCategoryTitle: "Certificates",
      additionalCategoryTitle: "Additional certificates",
      itemsUnit: "items",
      showCredentialLabel: "Show credential",
      previewAriaLabel: "Certificate preview",
      previewCloseAriaLabel: "Close certificate preview",
      previewFallbackAlt: "Certificate preview",
    },
    toolsDialog: {
      title: "Everything I work with",
      lede: "A complete look at the tools, platforms, and technologies I use to bring ideas to life.",
      closeLabel: "Close",
      closeAriaLabel: "Close tools dialog",
      chipAriaPrefix: "View",
      chipAriaSuffix: "details",
    },
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
    certificates: [
      {
        title: "AI Mastery",
        file: "AI Mastery Cert.png",
        image: "/certificates/AI Mastery Cert.png",
        thumb: "/certificates/thumbs/AI Mastery Cert.webp",
        preview: "/certificates/preview/AI Mastery Cert.webp",
        credentialUrl:
          "https://tixu.ai/certificate/5d8df00b-2a960c-4f6b-40000005-7b57b76937ac?type=roadmap&name=AI+Mastery&fn=Francis+Ronald&ln=Enterina&date=6+October+2026&cl=17",
      },
      {
        title: "Lovable",
        file: "Lovable Cert.png",
        image: "/certificates/Lovable Cert.png",
        thumb: "/certificates/thumbs/Lovable Cert.webp",
        preview: "/certificates/preview/Lovable Cert.webp",
        credentialUrl:
          "https://tixu.ai/certificate/fbfb99da-2a960c-bad0-53-00e203ac01ce",
      },
      {
        title: "Kling",
        file: "Kling Cert.png",
        image: "/certificates/Kling Cert.png",
        thumb: "/certificates/thumbs/Kling Cert.webp",
        preview: "/certificates/preview/Kling Cert.webp",
        credentialUrl:
          "https://tixu.ai/certificate/f4baea88-2a960c-6cbb-54-86076a5d2be0",
      },
      {
        title: "Nano Banana",
        file: "Nano Banana Cert.png",
        image: "/certificates/Nano Banana Cert.png",
        thumb: "/certificates/thumbs/Nano Banana Cert.webp",
        preview: "/certificates/preview/Nano Banana Cert.webp",
        credentialUrl:
          "https://tixu.ai/certificate/e4f70c15-2a960c-ef87-51-1077da3c8c8f",
      },
      {
        title: "ChatGPT",
        file: "ChatGPT Cert.png",
        image: "/certificates/ChatGPT Cert.png",
        thumb: "/certificates/thumbs/ChatGPT Cert.webp",
        preview: "/certificates/preview/ChatGPT Cert.webp",
        credentialUrl:
          "https://tixu.ai/certificate/17bea2c7-2a960c-28ab-4f-9c942ca4a3f7",
      },
      {
        title: "Claude",
        file: "Claude Cert.png",
        image: "/certificates/Claude Cert.png",
        thumb: "/certificates/thumbs/Claude Cert.webp",
        preview: "/certificates/preview/Claude Cert.webp",
        credentialUrl:
          "https://tixu.ai/certificate/15edc35d-2a960c-c8c2-50-74d73cd0bd31",
      },
      {
        title: "Claude Advanced Workflows",
        file: "Claude Advanced Workflows Cert.png",
        image: "/certificates/Claude Advanced Workflows Cert.png",
        thumb: "/certificates/thumbs/Claude Advanced Workflows Cert.webp",
        preview: "/certificates/preview/Claude Advanced Workflows Cert.webp",
        credentialUrl:
          "https://tixu.ai/certificate/9765b494-2a960c-c076-55-0eb88f3d69b4",
      },
      {
        title: "BSIS Diploma",
        file: "BSIS-Diploma.png",
        image: "/certificates/BSIS-Diploma.png",
        thumb: "/certificates/thumbs/BSIS-Diploma.webp",
        preview: "/certificates/preview/BSIS-Diploma.webp",
      },
      {
        title: "CCS Executive Council",
        file: "CCS-EC-Cert.png",
        image: "/certificates/CCS-EC-Cert.png",
        thumb: "/certificates/thumbs/CCS-EC-Cert.webp",
        preview: "/certificates/preview/CCS-EC-Cert.webp",
      },
      {
        title: "Anura Innovations",
        file: "AnuraInnovations-Cert.png",
        image: "/certificates/AnuraInnovations-Cert.png",
        thumb: "/certificates/thumbs/AnuraInnovations-Cert.webp",
        preview: "/certificates/preview/AnuraInnovations-Cert.webp",
      },
      {
        title: "Hues X Palette",
        file: "Hues X Palette-Cert.png",
        image: "/certificates/Hues X Palette-Cert.png",
        thumb: "/certificates/thumbs/Hues X Palette-Cert.webp",
        preview: "/certificates/preview/Hues X Palette-Cert.webp",
      },
      {
        title: "PPC Manager",
        file: "PPC Manager-Cert.png",
        image: "/certificates/PPC Manager-Cert.png",
        thumb: "/certificates/thumbs/PPC Manager-Cert.webp",
        preview: "/certificates/preview/PPC Manager-Cert.webp",
      },
      {
        title: "CCS Research Week",
        file: "CCS-ResearchWeek-Cert.png",
        image: "/certificates/CCS-ResearchWeek-Cert.png",
        thumb: "/certificates/thumbs/CCS-ResearchWeek-Cert.webp",
        preview: "/certificates/preview/CCS-ResearchWeek-Cert.webp",
      },
      {
        title: "Final Pitch",
        file: "FinalPitch-Cert.png",
        image: "/certificates/FinalPitch-Cert.png",
        thumb: "/certificates/thumbs/FinalPitch-Cert.webp",
        preview: "/certificates/preview/FinalPitch-Cert.webp",
      },
    ] satisfies Certificate[],
    additionalCertificates: [
      {
        title: "Elementary Diploma",
        file: "Elementary-Diploma.png",
        image: "/additionalCertificates/Elementary-Diploma.png",
        thumb: "/additionalCertificates/thumbs/Elementary-Diploma.webp",
        preview: "/additionalCertificates/preview/Elementary-Diploma.webp",
      },
      {
        title: "Football",
        file: "Football-Cert.png",
        image: "/additionalCertificates/Football-Cert.png",
        thumb: "/additionalCertificates/thumbs/Football-Cert.webp",
        preview: "/additionalCertificates/preview/Football-Cert.webp",
      },
      {
        title: "JHS Diploma",
        file: "JHS-Diploma.png",
        image: "/additionalCertificates/JHS-Diploma.png",
        thumb: "/additionalCertificates/thumbs/JHS-Diploma.webp",
        preview: "/additionalCertificates/preview/JHS-Diploma.webp",
      },
      {
        title: "Kiddie Crew",
        file: "KiddieCrew-Cert.png",
        image: "/additionalCertificates/KiddieCrew-Cert.png",
        thumb: "/additionalCertificates/thumbs/KiddieCrew-Cert.webp",
        preview: "/additionalCertificates/preview/KiddieCrew-Cert.webp",
      },
      {
        title: "Living Way Gospel",
        file: "LivingWayGospel-Cert.png",
        image: "/additionalCertificates/LivingWayGospel-Cert.png",
        thumb: "/additionalCertificates/thumbs/LivingWayGospel-Cert.webp",
        preview: "/additionalCertificates/preview/LivingWayGospel-Cert.webp",
      },
      {
        title: "SHS Diploma",
        file: "SHS-Diploma.png",
        image: "/additionalCertificates/SHS-Diploma.png",
        thumb: "/additionalCertificates/thumbs/SHS-Diploma.webp",
        preview: "/additionalCertificates/preview/SHS-Diploma.webp",
      },
      {
        title: "WASAR",
        file: "WASAR-Cert_1.png",
        image: "/additionalCertificates/WASAR-Cert_1.png",
        thumb: "/additionalCertificates/thumbs/WASAR-Cert_1.webp",
        preview: "/additionalCertificates/preview/WASAR-Cert_1.webp",
      },
      {
        title: "WASAR",
        file: "WASAR-Cert_2.png",
        image: "/additionalCertificates/WASAR-Cert_2.png",
        thumb: "/additionalCertificates/thumbs/WASAR-Cert_2.webp",
        preview: "/additionalCertificates/preview/WASAR-Cert_2.webp",
      },
    ] satisfies Certificate[],
  },
  contact: {
    eyebrow: "05 / Contact",
    title: "Have a vision? Let’s make it happen!",
    intro:
      "Looking to collaborate, hire, or ask a question? Send me a message or reach out via email.",
    emailLabel: "Email",
    email: "enterinaf@gmail.com",
    emailHref: "mailto:enterinaf@gmail.com",
    form: {
      endpoint: "https://formspree.io/f/xjygaqaa",
      title: "Send a message",
      requiredNote: "All fields are required.",
      nameLabel: "Your name",
      namePlaceholder: "Your name",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      messageLabel: "Your message",
      messageHint:
        "A few lines is plenty: what you have in mind and when you need it.",
      messagePlaceholder: "Tell me a little about your project...",
      submitLabel: "Send message",
      sendingLabel: "Sending...",
      successMessage: "Thanks - your message has been sent.",
      errorMessage:
        "Something went wrong. Please try again or email me directly.",
      successTitle: "Thanks, message received.",
      successBody:
        "I'll reply to your email as soon as I can. In the meantime, feel free to look through more of the work.",
      backToWorkLabel: "Back to the work",
      anotherMessageLabel: "Send another message",
    },
    location: "Based in Iligan City, Philippines",
    social: [
      {
        label: "LinkedIn",
        handle: "/in/fenterina",
        href: "https://www.linkedin.com/in/fenterina/",
      },
      {
        label: "GitHub",
        handle: "@fenterina",
        href: "https://github.com/fenterina",
      },
    ],
  },
  footer: {
    location: "ILIGAN CITY, PHILIPPINES - GMT+8",
    copyright: "FRANCIS RONALD BORJA ENTERINA © 2026",
    backToTop: "BACK TO TOP",
  },
} as const;

export type Locale = typeof en;