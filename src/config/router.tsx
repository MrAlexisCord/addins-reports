import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AddinShell } from '@templates/AddinShell'

/**
 * Usa createBrowserRouter (History API / pushState) en lugar de createHashRouter.
 *
 * Razones para NO usar HashRouter en este proyecto:
 * - MyGeotab escucha eventos `hashchange` del iframe y los sincroniza con su
 *   propia URL del padre. Cualquier cambio de hash dentro del addin contamina la
 *   URL de MyGeotab y provoca un 404 al recargar (Ctrl+Shift+R).
 * - BrowserRouter usa pushState; MyGeotab NO intercepta `popstate` en iframes,
 *   por lo que la navegación interna del addin es completamente transparente.
 *
 * Vercel ya tiene el rewrite `/(.*) → /index.html` configurado en vercel.json,
 * lo que permite que cualquier ruta profunda funcione tras un refresh.
 *
 * Ventaja para múltiples reportes:
 *   Cada reporte tiene su propia URL limpia sin `#`:
 *     https://addins-reports.vercel.app/reports/pnp-and-pna
 *     https://addins-reports.vercel.app/reports/otro-reporte
 *   Cada entrada en addin.json de MyGeotab apunta directamente a esa URL.
 */

const PnpAndPnaReportPage = lazy(
  () => import('@pages/PnpAndPnaReport/PnpAndPnaReportPage').then(m => ({ default: m.PnpAndPnaReportPage })),
)

const NotFoundPage = lazy(
  () => import('@pages/NotFound/NotFoundPage').then(m => ({ default: m.NotFoundPage })),
)

const Loading = () => <div className="sr-only" role="status">Cargando...</div>

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AddinShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/reports/pnp-and-pna" replace />,
      },
      {
        path: 'reports/pnp-and-pna',
        element: (
          <Suspense fallback={<Loading />}>
            <PnpAndPnaReportPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Loading />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])
