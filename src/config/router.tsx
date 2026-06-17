import { lazy, Suspense } from 'react'
import { createBrowserRouter, useSearchParams } from 'react-router-dom'
import { AddinShell } from '@templates/AddinShell'

/**
 * Usa createBrowserRouter (History API / pushState).
 *
 * Por qué NO sub-rutas para los reportes:
 *   MyGeotab extrae el "directorio" de la URL del addin y lo usa como prefijo
 *   al cargar recursos del iframe. Con URL `/reports/pnp-and-pna`, MyGeotab
 *   prefija `/reports/` a cada asset → `/reports//assets/index.js` (doble slash)
 *   → Vercel emite 308 Redirect → CORS bloquea la redirección → página en blanco.
 *
 * Solución: la URL del addin vive en la raíz del origen sin sub-rutas.
 *   https://addins-reports.vercel.app/?report=pnp-and-pna
 *   https://addins-reports.vercel.app/?report=otro-reporte
 *
 * El parámetro `?report` selecciona qué componente renderizar.
 * Cada entrada en addin.json de MyGeotab apunta a la raíz con un ?report distinto.
 * Vercel ya tiene el rewrite `/(.*) → /index.html` para el SPA.
 */

const PnpAndPnaReportPage = lazy(
  () => import('@pages/PnpAndPnaReport/PnpAndPnaReportPage').then(m => ({ default: m.PnpAndPnaReportPage })),
)

const NotFoundPage = lazy(
  () => import('@pages/NotFound/NotFoundPage').then(m => ({ default: m.NotFoundPage })),
)

const Loading = () => <div className="sr-only" role="status">Cargando...</div>

/**
 * Dispatcher: lee `?report` de la query string y renderiza el componente
 * correspondiente. Añadir nuevos reportes = añadir un case aquí + un ítem
 * en addin.json con la URL `https://addins-reports.vercel.app/?report=<key>`.
 */
function ReportDispatcher() {
  const [params] = useSearchParams()
  const report = params.get('report')

  switch (report) {
    case 'pnp-and-pna':
      return (
        <Suspense fallback={<Loading />}>
          <PnpAndPnaReportPage />
        </Suspense>
      )
    default:
      return (
        <Suspense fallback={<Loading />}>
          <NotFoundPage />
        </Suspense>
      )
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AddinShell />,
    children: [
      {
        index: true,
        element: <ReportDispatcher />,
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
