export type Tool = {
  name: string;
  short: string;
  color: string;
  lightColor?: string;
  logo: string;
  category: string;
};

export const tools: Tool[] = [
  // Development
  { name: 'Flutter', short: 'Fl', color: '#42a5f5', lightColor: '#0284c7', logo: '', category: 'Development' },
  { name: 'React', short: 'Re', color: '#61dafb', lightColor: '#087ea4', logo: '', category: 'Development' },
  { name: 'React Native', short: 'RN', color: '#61dafb', lightColor: '#0284c7', logo: '', category: 'Development' },
  { name: 'Astro', short: 'As', color: '#ff5d01', lightColor: '#ea580c', logo: '', category: 'Development' },
  { name: 'Node.js', short: 'No', color: '#68a063', lightColor: '#2f6f2b', logo: '', category: 'Development' },
  { name: 'Motion', short: 'Mo', color: '#a78bfa', lightColor: '#7c3aed', logo: '', category: 'Development' },
  { name: 'Expo / EAS Build', short: 'Ex', color: '#ffffff', lightColor: '#1e293b', logo: '', category: 'Development' },
  { name: 'WordPress', short: 'Wp', color: '#21759b', lightColor: '#1d5f80', logo: '', category: 'Development' },

  // Languages
  { name: 'TypeScript', short: 'TS', color: '#3178c6', lightColor: '#2563eb', logo: '', category: 'Languages' },
  { name: 'JavaScript', short: 'JS', color: '#f7df1e', lightColor: '#b45309', logo: '', category: 'Languages' },
  { name: 'Luau', short: 'Lu', color: '#38bdf8', lightColor: '#0284c7', logo: '', category: 'Languages' },
  { name: 'Dart', short: 'Dt', color: '#42a5f5', lightColor: '#0284c7', logo: '', category: 'Languages' },
  { name: 'PHP', short: 'Ph', color: '#8892be', lightColor: '#4f5b93', logo: '', category: 'Languages' },
  { name: 'HTML & CSS', short: 'HC', color: '#f97316', lightColor: '#dc2626', logo: '', category: 'Languages' },

  // Game Dev & 3D
  { name: 'Roblox Studio', short: 'RS', color: '#38bdf8', lightColor: '#0369a1', logo: '', category: 'Game Dev & 3D' },
  { name: 'Blender', short: 'Bl', color: '#fb923c', lightColor: '#ea580c', logo: '', category: 'Game Dev & 3D' },
  { name: 'Rojo', short: 'Rj', color: '#f87171', lightColor: '#dc2626', logo: '', category: 'Game Dev & 3D' },
  { name: 'Wally', short: 'Wa', color: '#60a5fa', lightColor: '#2563eb', logo: '', category: 'Game Dev & 3D' },

  // AI & Agentic Tools
  { name: 'Antigravity', short: 'AG', color: '#60a5fa', lightColor: '#4169e1', logo: '', category: 'AI & Agentic Tools' },
  { name: 'Claude Code', short: 'CC', color: '#e68a6a', lightColor: '#c25735', logo: '', category: 'AI & Agentic Tools' },
  { name: 'Claude', short: 'Cl', color: '#d97757', lightColor: '#c25735', logo: '', category: 'AI & Agentic Tools' },
  { name: 'ChatGPT', short: 'CG', color: '#10a37f', lightColor: '#0f766e', logo: '', category: 'AI & Agentic Tools' },
  { name: 'Gemini', short: 'Ge', color: '#8ab4f8', lightColor: '#2563eb', logo: '', category: 'AI & Agentic Tools' },
  { name: 'OpenAI API', short: 'AI', color: '#10a37f', lightColor: '#0f766e', logo: '', category: 'AI & Agentic Tools' },
  { name: 'MCP', short: 'MC', color: '#818cf8', lightColor: '#4f46e5', logo: '', category: 'AI & Agentic Tools' },
  { name: 'Lovable', short: 'Lo', color: '#fb7185', lightColor: '#e11d48', logo: '', category: 'AI & Agentic Tools' },
  { name: 'Nano Banana', short: 'NB', color: '#facc15', lightColor: '#b45309', logo: '', category: 'AI & Agentic Tools' },
  { name: 'Kling', short: 'Ki', color: '#a78bfa', lightColor: '#7c3aed', logo: '', category: 'AI & Agentic Tools' },

  // Backend & Data
  { name: 'Supabase', short: 'Su', color: '#3ecf8e', lightColor: '#059669', logo: '', category: 'Backend & Data' },
  { name: 'Firebase', short: 'Fb', color: '#ffca28', lightColor: '#d97706', logo: '', category: 'Backend & Data' },
  { name: 'PostgreSQL', short: 'Pg', color: '#4169e1', lightColor: '#1d4ed8', logo: '', category: 'Backend & Data' },
  { name: 'MySQL', short: 'My', color: '#4479a1', lightColor: '#2b5d82', logo: '', category: 'Backend & Data' },
  { name: 'REST APIs', short: 'RE', color: '#75c7b7', lightColor: '#0f766e', logo: '', category: 'Backend & Data' },

  // Dev & Hosting
  { name: 'Git', short: 'Gt', color: '#f05032', lightColor: '#dc2626', logo: '', category: 'Dev & Hosting' },
  { name: 'GitHub', short: 'GH', color: '#ffffff', lightColor: '#1f2937', logo: '', category: 'Dev & Hosting' },
  { name: 'GitHub Actions', short: 'GA', color: '#38bdf8', lightColor: '#1d4ed8', logo: '', category: 'Dev & Hosting' },
  { name: 'VS Code', short: 'VS', color: '#23a8f2', lightColor: '#0284c7', logo: '', category: 'Dev & Hosting' },
  { name: 'Android Studio', short: 'AS', color: '#3ddc84', lightColor: '#15803d', logo: '', category: 'Dev & Hosting' },
  { name: 'Vite', short: 'Vi', color: '#818cf8', lightColor: '#6d28d9', logo: '', category: 'Dev & Hosting' },
  { name: 'Google Search Console', short: 'SC', color: '#4285f4', lightColor: '#1d4ed8', logo: '', category: 'Dev & Hosting' },

  // Design & Creative
  { name: 'Figma', short: 'Fi', color: '#f24e1e', lightColor: '#dc2626', logo: '', category: 'Design & Creative' },
  { name: 'Canva', short: 'Ca', color: '#00c4cc', lightColor: '#0e7490', logo: '', category: 'Design & Creative' },
  { name: 'CapCut', short: 'CC', color: '#ffffff', lightColor: '#1f2937', logo: '', category: 'Design & Creative' },

  // Marketing & Analytics
  { name: 'Amazon Ads / PPC', short: 'AZ', color: '#fbbf24', lightColor: '#d97706', logo: '', category: 'Marketing & Analytics' },
  { name: 'Helium 10', short: 'H10', color: '#ff6b35', lightColor: '#c2410c', logo: '', category: 'Marketing & Analytics' },
  { name: 'Google Analytics', short: 'GA', color: '#f9ab00', lightColor: '#b45309', logo: '', category: 'Marketing & Analytics' },
  { name: 'Meta Ads Manager', short: 'MA', color: '#0866ff', lightColor: '#0866ff', logo: '', category: 'Marketing & Analytics' },
  { name: 'Meta Business Suite', short: 'MB', color: '#0866ff', lightColor: '#0866ff', logo: '', category: 'Marketing & Analytics' },

  // Productivity & Collaboration
  { name: 'Google Sheets', short: 'GS', color: '#34a853', lightColor: '#15803d', logo: '', category: 'Productivity & Collaboration' },
  { name: 'Google Docs', short: 'GD', color: '#4285f4', lightColor: '#1d4ed8', logo: '', category: 'Productivity & Collaboration' },
  { name: 'Microsoft Excel', short: 'Ex', color: '#217346', lightColor: '#166534', logo: '', category: 'Productivity & Collaboration' },
  { name: 'Microsoft PowerPoint', short: 'PP', color: '#d24726', lightColor: '#c2410c', logo: '', category: 'Productivity & Collaboration' },
  { name: 'Trello', short: 'Tr', color: '#0c66e4', lightColor: '#0c66e4', logo: '', category: 'Productivity & Collaboration' },
  { name: 'Loom', short: 'Lm', color: '#625df5', lightColor: '#4f46e5', logo: '', category: 'Productivity & Collaboration' },
  { name: 'Discord', short: 'Dc', color: '#818cf8', lightColor: '#4f46e5', logo: '', category: 'Productivity & Collaboration' },
  { name: 'Google Meet', short: 'GM', color: '#00897b', lightColor: '#0f766e', logo: '', category: 'Productivity & Collaboration' },
  { name: 'Zoom', short: 'Zo', color: '#2d8cff', lightColor: '#1d4ed8', logo: '', category: 'Productivity & Collaboration' },
];
