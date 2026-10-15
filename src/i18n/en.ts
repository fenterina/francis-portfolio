export type Certificate = {
  title: string;
  file: string;
  credentialUrl?: string;
};

export const en = {
  language: "en",
  metadata: {
    title: "Francis - Creative frontend developer",
    description:
      "Francis is a creative frontend developer making thoughtful digital experiences.",
    themeColor: "#4169E1",
  },
  images: {
    brandMark: "/images/Logo.png",
    brandMarkAlt: "Francis Enterina logo mark",
    brandLogo: "/images/Logo_with_name.png",
    brandLogoAlt: "Francis Enterina logo",
    heroPortrait: "/images/picture%20bilyard.png",
    aboutPortrait: "/images/picture%20bilyard.png",
  },
  nav: {
    homeLabel: "Francis home",
    openLabel: "Open navigation",
    closeLabel: "Close navigation",
    about: "About",
    projects: "Projects",
    skills: "Skills",
    contact: "Let's Connect!",
  },
  hero: {
    brandTitle: "Francis Enterina",
    brandPhrase: "Welcome to the portfolio of Francis Enterina.",
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
        href: "#redcarpet-case-study",
        linkLabel: "View more details",
      },
    ],
  },
  skills: {
    eyebrow: "How I work",
    title: "Tools I use.",
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
    certificates: [
      {
        title: "AI Mastery",
        file: "AI Mastery Cert.png",
        credentialUrl:
          "https://tixu.ai/certificate/5d8df00b-2a960c-4f6b-40000005-7b57b76937ac?type=roadmap&name=AI+Mastery&fn=Francis+Ronald&ln=Enterina&date=6+October+2026&cl=17",
      },
      {
        title: "Lovable",
        file: "Lovable Cert.png",
        credentialUrl:
          "https://tixu.ai/certificate/fbfb99da-2a960c-bad0-53-00e203ac01ce",
      },
      {
        title: "Kling",
        file: "Kling Cert.png",
        credentialUrl:
          "https://tixu.ai/certificate/f4baea88-2a960c-6cbb-54-86076a5d2be0",
      },
      {
        title: "Nano Banana",
        file: "Nano Banana Cert.png",
        credentialUrl:
          "https://tixu.ai/certificate/e4f70c15-2a960c-ef87-51-1077da3c8c8f",
      },
      {
        title: "ChatGPT",
        file: "ChatGPT Cert.png",
        credentialUrl:
          "https://tixu.ai/certificate/17bea2c7-2a960c-28ab-4f-9c942ca4a3f7",
      },
      {
        title: "Claude",
        file: "Claude Cert.png",
        credentialUrl:
          "https://tixu.ai/certificate/15edc35d-2a960c-c8c2-50-74d73cd0bd31",
      },
      {
        title: "Claude Advanced Workflows",
        file: "Claude Advanced Workflows Cert.png",
        credentialUrl:
          "https://tixu.ai/certificate/9765b494-2a960c-c076-55-0eb88f3d69b4",
      },
      { title: "BSIS Diploma", file: "BSIS-Diploma.png" },
      { title: "CCS Executive Council", file: "CCS-EC-Cert.png" },
      { title: "Anura Innovations", file: "AnuraInnovations-Cert.png" },
      { title: "Hues X Palette", file: "Hues X Palette-Cert.png" },
      { title: "PPC Manager", file: "PPC Manager-Cert.png" },
      { title: "CCS Research Week", file: "CCS-ResearchWeek-Cert.png" },
      { title: "Final Pitch", file: "FinalPitch-Cert.png" },
    ] satisfies Certificate[],
    additionalCertificates: [
      { title: "Elementary Diploma", file: "Elementary-Diploma.png" },
      { title: "Football", file: "Football-Cert.png" },
      { title: "JHS Diploma", file: "JHS-Diploma.png" },
      { title: "Kiddie Crew", file: "KiddieCrew-Cert.png" },
      { title: "Living Way Gospel", file: "LivingWayGospel-Cert.png" },
      { title: "SHS Diploma", file: "SHS-Diploma.png" },
      { title: "WASAR", file: "WASAR-Cert_1.png" },
      { title: "WASAR", file: "WASAR-Cert_2.png" },
    ] satisfies Certificate[],
  },
  contact: {
    eyebrow: "05 / Contact",
    title: "Have a vision? Let’s make it happen!",
    intro:
      "Looking to collaborate, hire, or ask a question? Send me a message or reach out via email.",
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
