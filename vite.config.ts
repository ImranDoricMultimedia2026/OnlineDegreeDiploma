import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import prerender from 'vite-plugin-prerender-spa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      prerender({
        routes: [
          '/',
          '/about',
          '/contact',
          '/colleges',
          '/programs',
          '/apply',
          // Colleges (Slugs)
          '/colleges/lpu-online',
          '/colleges/cu-online',
          '/colleges/delhi-university-du-sol',
          '/colleges/amity-online',
          '/colleges/ignou',
          '/colleges/gla-university-online',
          '/colleges/ssodl',
          '/colleges/amu-online',
          '/colleges/online-manipal-university',
          '/colleges/online-mizoram-university',
          '/colleges/online-uttaranchal-university',
          '/colleges/jamia-hamdard-online',
          // Programs (Slugs)
          '/programs/mba',
          '/programs/mca',
          '/programs/bca',
          '/programs/bba',
          '/programs/ba',
          '/programs/mcom',
          '/programs/msc-it',
          '/programs/dca',
          '/programs/dba'
        ],
        rendererOptions: {
          renderAfterTime: 2000, // React Helmet load hone ka wait
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
