// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://francisenterina.work',

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },

  integrations: [react()],
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-dev-runtime', 'react/jsx-runtime', 'motion', 'motion/react']
    }
  }
});