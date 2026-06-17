import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // base: './' genera rutas relativas en el HTML de producción (src="./assets/...")
  // en lugar de rutas absolutas (src="/assets/...").
  //
  // MyGeotab extrae el path de la URL del addin y lo PREFIJA a cada src/href del HTML.
  // Con base '/', Vite genera src="/assets/index.js". MyGeotab concatena:
  //   path='/' + '/assets/index.js' = '//assets/index.js'  → 308 redirect → CORS error.
  // Con base './', Vite genera src="./assets/index.js". MyGeotab resuelve correctamente:
  //   'https://addins-reports.vercel.app/' + './assets/index.js' = '/assets/index.js' ✓
  base: './',
  plugins: [react()],
  server: {
    allowedHosts: true as true,
    cors: true,
    hmr: {
      protocol: 'wss',
      clientPort: 443,
    },
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors [https://my.geotab.com/](https://my.geotab.com/)",
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    alias: {
      '@atoms':     resolve(__dirname, 'src/components/atoms'),
      '@molecules': resolve(__dirname, 'src/components/molecules'),
      '@organisms': resolve(__dirname, 'src/components/organisms'),
      '@templates': resolve(__dirname, 'src/components/templates'),
      '@pages':     resolve(__dirname, 'src/pages'),
      '@hooks':     resolve(__dirname, 'src/hooks'),
      '@services':  resolve(__dirname, 'src/services'),
      '@store':     resolve(__dirname, 'src/store'),
      '@models':    resolve(__dirname, 'src/models'),
      '@adapters':  resolve(__dirname, 'src/adapters'),
      '@config':    resolve(__dirname, 'src/config'),
      '@styles':    resolve(__dirname, 'src/styles'),
      '@utils':     resolve(__dirname, 'src/utils'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines:      90,
        branches:   90,
        functions:  90,
        statements: 90,
      },
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/App.tsx',                             // archivo legacy del scaffold inicial
        'src/**/*.d.ts',
        'src/**/*.model.ts',                       // interfaces only
        'src/**/index.ts',                         // barrel re-exports
        'src/config/env.ts',                       // env vars wrapper
        'src/config/geotab.ts',                    // type declarations
        'src/config/router.tsx',                   // integración router
        'src/config/queryClient.ts',               // config instantiation
        'src/test/**',
        // Hooks delgados — solo re-exportan tipos/selectors de Redux y TanQuery
        'src/hooks/useAppDispatch.ts',
        'src/hooks/useAppSelector.ts',
        'src/hooks/usePnpAndPnaReport.ts',
        'src/components/organisms/DataGrid/DataGrid.tsx',
        'src/components/organisms/Sidebar/Sidebar.tsx',
        'src/components/templates/AppShell/AppShell.tsx',
        // Páginas (integración E2E)
        'src/pages/PnpAndPnaReport/PnpAndPnaReportPage.tsx',
      ],
    },
  },
})
