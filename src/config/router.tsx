import { lazy, Suspense } from 'react'
import { createHashRouter } from 'react-router-dom'
import { AddinShell } from '@templates/AddinShell'

/**
 * Se usa createHashRouter (URLs con #) en lugar de createBrowserRouter
 * porque los addins de MyGeotab se ejecutan dentro de un iFrame y la
 * History API no está disponible. El hash router no requiere configuración
 * en el servidor para resolver rutas anidadas.
 *
 * AddinShell se usa como layout raíz — sin Sidebar ni Topbar —
 * ya que MyGeotab provee su propia navegación al incrustar el addin.
 *
 * IMPORTANTE: No usar <Navigate> redirect desde "/" hacia sub-rutas.
 * MyGeotab sincroniza el hash del iframe con la URL del padre (deep-linking).
 * Si el hash cambia de "#/" a "#/reports/pnp-and-pna", MyGeotab interpreta
 * "#/reports/pnp-and-pna" como una ruta interna propia y muestra 404 al recargar.
 * Solución: el reporte se monta directamente en el índice ("/") para que el
 * hash nunca cambie tras la carga inicial.
 */

const PnpAndPnaReportPage = lazy(
  () => import('@pages/PnpAndPnaReport/PnpAndPnaReportPage').then(m => ({ default: m.PnpAndPnaReportPage })),
)

const NotFoundPage = lazy(
  () => import('@pages/NotFound/NotFoundPage').then(m => ({ default: m.NotFoundPage })),
)

const Loading = () => <div className="sr-only" role="status">Cargando...</div>

export const router = createHashRouter([
  {
    path: '/',
    element: <AddinShell />,
    children: [
      {
        index: true,
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
