import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AddinShell } from '@templates/AddinShell'

/**
 * REGLAS DE URL PARA ADDINS DE MYGEOTAB — leer antes de modificar:
 *
 * 1. NO usar query strings (?param=value) en la URL del addin.json.
 *    MyGeotab genera el ID del addin a partir del URL. Si el URL contiene `?`,
 *    el ID incluye el `?` y MyGeotab intenta cargar un archivo .html LOCAL de
 *    su propio servidor en vez de cargar el iframe externo → 404 garantizado.
 *
 * 2. NO usar sub-directorios profundos (/reports/pnp-and-pna).
 *    MyGeotab resuelve los assets concatenando el directorio del URL con los
 *    src del HTML. Con base:'./' los src son relativos (./assets/...).
 *    - URL /reports/pnp-and-pna → dir = /reports/ → /reports/./assets/ ❌
 *    - URL /pnp-and-pna         → dir = /         → /./assets/ = /assets/ ✓
 *
 * 3. Usar SIEMPRE un segmento único en la raíz: /nombre-reporte
 *    El directorio del URL es `/`, combinado con `./assets/` da `/assets/` ✓
 *    MyGeotab busca las traducciones en `/translations/es.json` ✓
 *    Addin ID generado es limpio: `addin-react_addins-nombre-reporte` ✓
 *
 * CÓMO AGREGAR UN NUEVO REPORTE:
 *   1. Agregar { path: '/nombre-reporte', element: <NuevoReportePage /> }
 *   2. Agregar ítem en addin.json con url: "https://addins-reports.vercel.app/nombre-reporte"
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
