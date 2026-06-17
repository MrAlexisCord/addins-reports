import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AddinShell } from '@templates/AddinShell'

/**
 * COMPORTAMIENTO REAL DE MYGEOTAB CON ADDINS (documentado con errores reales):
 *
 * MyGeotab carga el iframe usando la URL del campo "url" del addin.json,
 * PERO el pathname dentro del iframe es SIEMPRE "/" (la raíz del origen).
 * El segmento de path (ej: /pnp-and-pna) se usa solo como IDENTIFICADOR del
 * addin en la navegación interna de MyGeotab (#addin-...), nunca llega al iframe.
 *
 * Por eso cada ruta tiene TANTO un `index` route en "/" como un child explícito:
 *   - MyGeotab carga iframe → pathname "/" → index route → reporte ✓
 *   - Acceso directo en browser a "/pnp-and-pna" → child route → reporte ✓
 *
 * REGLAS DE URL aprendidas con errores:
 *   1. Sin query strings (?param): MyGeotab trata el ? como parte del path local → 404.
 *   2. Sin sub-directorios (/reports/x): MyGeotab prefija el dir a los src de assets
 *      → doble slash → CORS error.
 *   3. Segmento único en raíz (/pnp-and-pna): dir = "/" → assets OK.
 *
 * PARA AGREGAR UN NUEVO REPORTE:
 *   1. Agregar { index: true, element: <NuevoReporte /> } (si se crea un nuevo despliegue)
 *      O manejar múltiples reportes con VITE_REPORT_ID en vercel.json.
 *   2. Agregar la ruta explícita { path: 'nuevo-reporte', element: <NuevoReporte /> }.
 *   3. Agregar ítem en addin.json: "url": "https://addins-reports.vercel.app/nuevo-reporte".
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
      // index: MyGeotab always loads the iframe at "/" regardless of the addin URL path.
      // This index route ensures the report renders when pathname is "/".
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <PnpAndPnaReportPage />
          </Suspense>
        ),
      },
      // Explicit path for direct browser access / bookmarks.
      {
        path: 'pnp-and-pna',
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
