// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://francisenterina.work',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  }
});
