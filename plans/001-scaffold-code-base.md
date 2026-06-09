# Plan 001 — Scaffold Base del Proyecto

> **Equipo:** Frontend Architect · React Expert · CSS/BEM Expert · Syncfusion Expert  
> **Regla:** Leer, planear, **no ejecutar** — cada fase es una unidad de trabajo autónoma.  
> **Referencia:** [AGENTS.md](../AGENTS.md) · [Prototipo](../docs/prototypes/alertas-de-detenciones-mockup.html) · [API Docs](../docs/routetrackingt2addinsv2api-v1.json)

---

## Estado actual

| Elemento | Estado |
|---|---|
| React 19 + TypeScript 6 + Vite 8 | ✅ Instalado |
| ESLint flat config | ✅ |
| Redux / RTK | ❌ Falta |
| TanStack Query | ❌ Falta |
| Axios | ❌ Falta |
| React Router DOM | ❌ Falta |
| Syncfusion EJ2 React | ❌ Falta |
| Zod | ❌ Falta |
| React Toastify | ❌ Falta |
| Vitest + Testing Library | ❌ Falta |
| Estructura Atomic Design | ❌ Falta |
| CSS Design Tokens (variables) | ❌ Falta |
| Capa API (Axios + interceptores) | ❌ Falta |
| Adapter pattern (Zod) | ❌ Falta |
| MyGeotab Addin manifest | ❌ Falta |
| Variables de entorno | ❌ Falta |

---

## Fase 1 — Dependencias y entorno de desarrollo

**Rol principal:** Frontend Architect

### 1.1 Instalar dependencias de producción

```bash
npm install \
  react-router-dom \
  @reduxjs/toolkit react-redux \
  @tanstack/react-query \
  axios \
  zod \
  react-toastify \
  @syncfusion/ej2-react-grids \
  @syncfusion/ej2-react-navigations \
  @syncfusion/ej2-react-dropdowns \
  @syncfusion/ej2-react-buttons \
  @syncfusion/ej2-react-inputs \
  @syncfusion/ej2-react-popups \
  @syncfusion/ej2-base \
  @syncfusion/ej2-material-theme
```

### 1.2 Instalar dependencias de desarrollo

```bash
npm install -D \
  vitest \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  msw
```

### 1.3 Configurar path aliases en `tsconfig.app.json` y `vite.config.ts`

```json
// tsconfig.app.json — compilerOptions
"paths": {
  "@atoms/*":    ["src/components/atoms/*"],
  "@molecules/*":["src/components/molecules/*"],
  "@organisms/*":["src/components/organisms/*"],
  "@templates/*":["src/components/templates/*"],
  "@pages/*":    ["src/pages/*"],
  "@hooks/*":    ["src/hooks/*"],
  "@services/*": ["src/services/*"],
  "@store/*":    ["src/store/*"],
  "@models/*":   ["src/models/*"],
  "@adapters/*": ["src/adapters/*"],
  "@config/*":   ["src/config/*"],
  "@styles/*":   ["src/styles/*"],
  "@utils/*":    ["src/utils/*"]
}
```

```ts
// vite.config.ts — resolve.alias (mismo mapping)
```

### 1.4 Archivos de variables de entorno

Crear:
- `.env.example`  — plantilla documentada
- `.env.development` — valores para local
- `.env.production`  — variables de producción

Variables mínimas:
```
VITE_API_BASE_URL=https://localhost:7268
VITE_SYNCFUSION_LICENSE_KEY=
VITE_APP_FONT_FAMILY="Segoe UI, Roboto, sans-serif"
```

### 1.5 Actualizar `.gitignore`

Asegurar que `.env.development` y `.env.production` estén ignorados, solo `.env.example` en VCS.

---

## Fase 2 — Design System: tokens CSS + tipografía

**Rol principal:** CSS Expert · BEM Expert

### 2.1 Archivo de design tokens: `src/styles/tokens.css`

Extraídos del prototipo, estructura:

```css
:root {
  /* Colores de fondo */
  --color-bg-app:        #f4f7fb;
  --color-bg-panel:      #ffffff;
  --color-bg-sidebar:    linear-gradient(180deg, #f9fbfd 0%, #eef3f7 100%);

  /* Bordes */
  --color-line-soft:     #d9e2ec;

  /* Marca */
  --color-brand-primary:      #0d77b8;
  --color-brand-primary-dark: #245f8f;
  --color-brand-primary-light:#ecf5fb;
  --color-brand-accent:       #1493dd;

  /* Texto */
  --color-text-main:     #2f4356;
  --color-text-muted:    #718295;
  --color-text-inverse:  #ffffff;

  /* Estado */
  --color-status-default-bg:  #eef4f8;
  --color-status-default-fg:  #48637a;

  /* Grid / Tabla */
  --color-grid-header-from:   #1d7ab5;
  --color-grid-header-to:     #245f8f;
  --color-grid-row-hover:     #f3f8fd;
  --color-grid-cell-border:   #e6edf4;
  --color-grid-selected-from: #2b88c5;
  --color-grid-selected-to:   #216ea5;

  /* Espaciado base */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  12px;
  --space-lg:  18px;
  --space-xl:  24px;
  --space-2xl: 32px;

  /* Radio de borde */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   10px;
  --radius-pill: 999px;

  /* Sombras */
  --shadow-panel: 0 8px 24px rgba(37, 67, 86, 0.06);

  /* Tipografía — variable para cambiar desde CSS */
  --font-family-base: var(--override-font, "Segoe UI", Roboto, sans-serif);
  --font-size-xs:   11px;
  --font-size-sm:   12px;
  --font-size-md:   13px;
  --font-size-base: 14px;
  --font-size-lg:   15px;
  --font-size-xl:   18px;
  --font-size-title: 38px;

  /* Z-index */
  --z-sidebar:  100;
  --z-topbar:   200;
  --z-modal:    300;
  --z-toast:    400;
}
```

### 2.2 Archivo de reset/base: `src/styles/base.css`

- `box-sizing: border-box` global
- Reset de márgenes/paddings
- Aplicación de `--font-family-base` al `body`
- Importa `tokens.css`

### 2.3 Archivo de utilidades BEM: `src/styles/utilities.css`

Clases de apoyo muy reducidas: `.visually-hidden`, `.sr-only`, `.text-truncate`.

### 2.4 Convención BEM para componentes

Cada componente `.tsx` tiene su propio `.css` colocado junto a él:

```
Button/
  Button.tsx
  Button.css       ← .button, .button--primary, .button__icon
  Button.test.tsx
  index.ts
```

Prefijo de bloque = nombre del componente en kebab-case.

### 2.5 Tema Syncfusion

- Importar `@syncfusion/ej2-material-theme/styles/material.css` en `src/styles/syncfusion.css`
- Sobreescribir variables de grid (header color, hover) usando las tokens CSS ya definidas

---

## Fase 3 — Arquitectura de carpetas (Atomic Design)

**Rol principal:** Frontend Architect

### 3.1 Estructura de directorios a crear

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Badge/
│   │   ├── StatusPill/
│   │   ├── Spinner/
│   │   └── index.ts
│   ├── molecules/
│   │   ├── NavItem/
│   │   ├── SearchBox/
│   │   ├── PageHeader/
│   │   └── index.ts
│   ├── organisms/
│   │   ├── Sidebar/
│   │   ├── Topbar/
│   │   ├── DataGrid/         ← wrapper Syncfusion
│   │   └── index.ts
│   └── templates/
│       ├── AppShell/         ← grid 240px + 1fr layout
│       └── PageLayout/
├── pages/
│   ├── PnpAndPnaReport/
│   └── NotFound/
├── hooks/
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   └── useSyncfusionLicense.ts
├── services/
│   ├── api.ts                ← instancia Axios
│   ├── diagnostic.service.ts
│   └── pnpAndPna.service.ts
├── store/
│   ├── index.ts              ← configureStore
│   └── slices/
│       └── uiSlice.ts
├── models/
│   ├── service/              ← shapes de respuesta backend
│   │   ├── wrapperResponse.model.ts
│   │   ├── healthCheck.service.model.ts
│   │   └── pnpAndPna.service.model.ts
│   └── app/                  ← modelos que usa el frontend
│       ├── healthCheck.app.model.ts
│       └── pnpAndPna.app.model.ts
├── adapters/
│   ├── wrapperResponse.adapter.ts
│   ├── healthCheck.adapter.ts
│   └── pnpAndPna.adapter.ts
├── config/
│   ├── env.ts                ← acceso tipado a variables VITE_*
│   └── queryClient.ts        ← instancia TanStack Query
├── styles/
│   ├── tokens.css
│   ├── base.css
│   ├── utilities.css
│   └── syncfusion.css
├── utils/
│   └── formatters.ts
├── App.tsx
└── main.tsx
```

---

## Fase 4 — Capa API: Axios + WrapperResponse + Interceptores

**Rol principal:** React Expert · Frontend Architect

### 4.1 Módulo `src/config/env.ts`

Exportar todas las variables `VITE_*` con tipos y validación de presencia.

```ts
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  SYNCFUSION_LICENSE: import.meta.env.VITE_SYNCFUSION_LICENSE_KEY as string,
  FONT_FAMILY: import.meta.env.VITE_APP_FONT_FAMILY as string,
}
```

### 4.2 Modelo genérico `WrapperResponse<T>` — `src/models/service/wrapperResponse.model.ts`

```ts
export interface WrapperResponse<T> {
  succeeded: boolean
  message:   string | null
  errors:    string[] | null
  data:       T | null
}
```

Zod schema genérico:

```ts
import { z } from 'zod'
export const wrapperResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    succeeded: z.boolean(),
    message:   z.string().nullable().optional(),
    errors:    z.array(z.string()).nullable().optional(),
    data:      dataSchema.nullable().optional(),
  })
```

### 4.3 Instancia Axios `src/services/api.ts`

- `baseURL` desde `ENV.API_BASE_URL`
- Header `Content-Type: application/json`
- **Request interceptor:** adjuntar token si existe en store
- **Response interceptor exitoso:** verificar `response.data.succeeded === false` → lanzar error con `message` y `errors`
- **Response interceptor error de red/HTTP:** lanzar error normalizado

```
Flujo del interceptor de respuesta:
  ┌─ HTTP 2xx ──► succeeded === true  ──► devolver data
                  succeeded === false ──► throw ApiBusinessError(message, errors)
  └─ HTTP 4xx/5xx ──────────────────────► throw ApiHttpError(status, message)
```

### 4.4 Clases de error en `src/utils/errors.ts`

- `ApiBusinessError` — error de negocio (`succeeded: false`)
- `ApiHttpError` — error HTTP

### 4.5 CORS / Seguridad

Documentar en `src/services/api.ts` que el backend debe tener CORS configurado para el origen del frontend. El cliente no envía credenciales por defecto; si se requieren cookies: `withCredentials: true`.

---

## Fase 5 — Estado global: Redux Toolkit + TanStack Query

**Rol principal:** React Expert

### 5.1 Store Redux `src/store/index.ts`

```ts
configureStore({
  reducer: {
    ui: uiReducer,
    // futuras features aquí
  }
})
```

Exportar tipos `RootState`, `AppDispatch`.

### 5.2 `uiSlice.ts`

Estado inicial:
- `sidebarCollapsed: boolean`
- `activeReport: string | null`

### 5.3 Hooks tipados

- `useAppDispatch` — `() => AppDispatch`
- `useAppSelector` — `TypedUseSelectorHook<RootState>`

### 5.4 TanStack Query — `src/config/queryClient.ts`

```ts
new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  }
})
```

### 5.5 Providers en `main.tsx`

```tsx
<Provider store={store}>
  <QueryClientProvider client={queryClient}>
    <ToastContainer ... />
    <RouterProvider router={router} />
  </QueryClientProvider>
</Provider>
```

---

## Fase 6 — Adapter Pattern con Zod

**Rol principal:** React Expert · Frontend Architect

### 6.1 Patrón a aplicar en cada entidad

Para cada entidad del backend:

```
src/models/service/X.service.model.ts   → interface XServiceModel (shape exacta del backend)
src/models/app/X.app.model.ts           → interface XAppModel (shape para el frontend)
src/adapters/X.adapter.ts               → función toXAppModel(raw: unknown): XAppModel
                                           usa Zod para parse + transforma al app model
```

### 6.2 Adapter de `WrapperResponse`

`wrapperResponse.adapter.ts` — función utilitaria que:
1. Parsea con Zod el schema genérico
2. Si `!succeeded` → lanza `ApiBusinessError`
3. Si `data == null` → lanza error de contrato
4. Retorna el `data` ya parseado

### 6.3 Adapters específicos a crear en esta fase

| Entidad | Schema Zod | App Model |
|---|---|---|
| HealthCheckDto | `healthCheckSchema` | `HealthCheckAppModel` |
| PnpAndPnaReport | `pnpAndPnaSchema` (se definirá cuando llegue el contrato) | `PnpAndPnaAppModel` |

---

## Fase 7 — Routing con React Router DOM

**Rol principal:** Frontend Architect

### 7.1 Estructura de rutas

```
/                     → redirect → /reports/pnp-and-pna
/reports/pnp-and-pna  → PnpAndPnaReportPage   (lazy)
/*                    → NotFoundPage
```

### 7.2 Router con `createBrowserRouter`

- Usar `createBrowserRouter` (Data Router API)
- Layout route: `AppShell` como elemento raíz con `<Outlet />`
- Lazy loading: `React.lazy` + `Suspense` con `Spinner` como fallback
- Manejo de errores de ruta: `errorElement` con `ErrorBoundaryPage`

### 7.3 Consideración MyGeotab Addin

MyGeotab addins se ejecutan dentro de un iFrame en la plataforma. Usar `createHashRouter` en lugar de `createBrowserRouter` para evitar problemas de base URL cuando el addin está embebido. Documentar esta decisión en comentario.

---

## Fase 8 — Componentes UI: Átomos y Moléculas

**Rol principal:** React Expert · CSS/BEM Expert

### Átomo: `Button`

Props: `variant` (primary | secondary | ghost), `size` (sm | md), `loading`, `disabled`, `onClick`, `children`.  
BEM: `.button`, `.button--primary`, `.button--loading`, `.button__icon`.

### Átomo: `Badge`

Props: `label`, `color` (brand | neutral | success | danger).  
BEM: `.badge`, `.badge--brand`.

### Átomo: `StatusPill`

Extraído del prototipo. Props: `label`, `variant`.  
BEM: `.status-pill`, `.status-pill--active`, `.status-pill--inactive`.

### Átomo: `Spinner`

Loading circular animado en CSS puro.  
BEM: `.spinner`, `.spinner--sm`, `.spinner--lg`.

### Molécula: `NavItem`

Props: `icon`, `label`, `active`, `badge`, `onClick`.  
Extraído del prototipo (`nav-item`, `nav-item--active`).

### Molécula: `SearchBox`

Props: `placeholder`, `value`, `onChange`.  
BEM: `.search-box`, `.search-box__icon`, `.search-box__input`.

### Molécula: `PageHeader`

Props: `title`, `subtitle`, `actions?: ReactNode`.  
Incluye la regla de degradado (`.page-header__rule`).

---

## Fase 9 — Organismos: Sidebar, Topbar, DataGrid

**Rol principal:** React Expert · Syncfusion Expert · CSS/BEM Expert

### Organismo: `Sidebar`

- Layout `240px` fijo, colapsable con Redux (`uiSlice.sidebarCollapsed`)
- Gradiente de fondo desde tokens CSS
- Renderiza `NavItem` basado en configuración de rutas
- BEM: `.sidebar`, `.sidebar--collapsed`, `.sidebar__brand`, `.sidebar__nav`

### Organismo: `Topbar`

- Alto `56px`, `z-index` desde tokens
- Selects de contexto (database, filtros) — componentes Syncfusion DropDownList
- Íconos de acciones
- BEM: `.topbar`, `.topbar__left`, `.topbar__right`, `.topbar__select`

### Organismo: `DataGrid`

**Requiere Syncfusion Expert:**

Wrapper sobre `GridComponent` de `@syncfusion/ej2-react-grids` con las siguientes features forzadas:

```
Características obligatorias:
  - ExcelExport    (ExcelExportService)
  - Filter         (modo: Excel — FilterType.Excel)
  - Resize         (allowResizing: true)
  - Reorder        (allowReordering: true)
  - Sort           (allowSorting: true)
  - Page           (Paginator Syncfusion)
```

Alineación tipo Excel:
- Números y montos → `textAlign: 'Right'`
- Fechas → `textAlign: 'Center'`
- Texto → `textAlign: 'Left'` (default)

Estilo de header: gradiente de `--color-grid-header-from` a `--color-grid-header-to`, texto blanco.

Props del wrapper:
```ts
interface DataGridProps<T> {
  columns:    ColumnModel[]
  dataSource: T[]
  loading?:   boolean
  height?:    string | number
  onExportExcel?: () => void
}
```

BEM: `.data-grid`, `.data-grid--loading`, `.data-grid__caption`, `.data-grid__export-btn`

---

## Fase 10 — Templates: AppShell y PageLayout

**Rol principal:** Frontend Architect · CSS Expert

### Template: `AppShell`

- CSS Grid: `grid-template-columns: var(--sidebar-width, 240px) minmax(0, 1fr)`
- `min-height: 100vh`
- Contiene `Sidebar` + zona main con `Topbar` arriba y `<Outlet>` abajo
- Cuando sidebar colapsado: `--sidebar-width: 60px` via clase BEM

BEM: `.app-shell`, `.app-shell__sidebar`, `.app-shell__main`, `.app-shell__topbar`, `.app-shell__content`

### Template: `PageLayout`

- Contenedor para el contenido de cada página
- Props: `title`, `subtitle`, `actions`, `children`
- Usa `PageHeader` + `.content-card` (del prototipo)

BEM: `.page-layout`, `.page-layout__header`, `.page-layout__body`

---

## Fase 11 — Primera página: PnpAndPnaReport

**Rol principal:** React Expert · Syncfusion Expert

### 11.1 Servicio `src/services/pnpAndPna.service.ts`

Endpoint: `GET /api/v1/PnpAndPnaReport/pnp-and-pna-report/{database}`

```ts
export const getPnpAndPnaReport = (database: string): Promise<PnpAndPnaAppModel[]> =>
  api.get(`/api/v1/PnpAndPnaReport/pnp-and-pna-report/${encodeURIComponent(database)}`)
     .then(r => pnpAndPnaAdapter.fromServiceList(r.data))
```

### 11.2 Hook TanStack Query `src/hooks/usePnpAndPnaReport.ts`

```ts
export const usePnpAndPnaReport = (database: string) =>
  useQuery({
    queryKey: ['pnpAndPna', database],
    queryFn: () => getPnpAndPnaReport(database),
    enabled: !!database,
  })
```

### 11.3 Página `src/pages/PnpAndPnaReport/PnpAndPnaReportPage.tsx`

- Usa `PageLayout` con title "PnP & PnA Report"
- Usa `DataGrid` con columnas derivadas del contrato API
- Muestra `Spinner` mientras carga
- Errores disparados por el interceptor → toast automático (no manejar localmente)

### 11.4 Columnas del grid

Definir en `pnpAndPna.columns.ts` separado. Alineación según tipo de dato (Excel criteria).

---

## Fase 12 — MyGeotab Addin Compatibility

**Rol principal:** Frontend Architect

### 12.1 ¿Qué necesita un MyGeotab Addin?

Un addin de MyGeotab es una SPA embebida en un iFrame dentro de la plataforma Geotab. Requiere:

1. **Archivo de manifiesto** `addin.json` (o declarado en `config.js`)  
   ```json
   {
     "name": "RouteTracking Reports",
     "supportEmail": "dev@example.com",
     "items": [
       {
         "page": "map",
         "title": "RT Reports",
         "noView": false,
         "url": "dist/index.html"
       }
     ]
   }
   ```

2. **API de Geotab** inyectada como `window.geotab` (o `api` pasado por el SDK)  
   El addin recibe un objeto `api` al inicializar: `initialize(freshApi, state, callback)`

3. **Hash Router** — No se puede usar History API dentro del iframe; usar `createHashRouter`.

4. **Tamaño de bundle** — El iframe tiene restricciones. Asegurar code splitting y lazy loading.

### 12.2 Archivos a crear

```
public/
  addin.json          ← manifiesto para MyGeotab
src/
  config/
    geotab.ts         ← tipado del objeto `api` de Geotab y hook `useGeotabApi`
  hooks/
    useGeotabApi.ts   ← acceso al contexto Geotab (database, credentials)
```

### 12.3 Hook `useGeotabApi`

Expone `database: string` obtenido del contexto Geotab, para pasarlo como parámetro al report endpoint.

---

## Fase 13 — Notificaciones y Error Boundary

**Rol principal:** React Expert

### 13.1 React Toastify

Configuración en `main.tsx`:
```tsx
<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  theme="colored"
/>
```

### 13.2 `errorNotifier.ts` — utilitario centralizado

```ts
export const notifyError = (error: unknown) => {
  if (error instanceof ApiBusinessError) {
    const lines = [error.message, ...(error.errors ?? [])].filter(Boolean)
    toast.error(lines.join('\n'))
  } else if (error instanceof ApiHttpError) {
    toast.error(`Error HTTP ${error.status}: ${error.message}`)
  } else {
    toast.error('Ocurrió un error inesperado.')
  }
}
```

### 13.3 Error Boundary React

`src/components/organisms/ErrorBoundary/ErrorBoundary.tsx`  
- Clase component (requisito de React para Error Boundaries)
- En `componentDidCatch`: llama a `notifyError`
- Render de fallback UI: mensaje amigable + botón "Recargar"

### 13.4 Integración en interceptor Axios

El interceptor de error en `api.ts` llama a `notifyError` antes de rechazar la promesa. Las páginas no necesitan manejar `catch` para mostrar toasts — ya está centralizado.

---

## Fase 14 — Testing con Vitest

**Rol principal:** React Expert · Frontend Architect

### 14.1 Configurar Vitest en `vite.config.ts`

```ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov', 'html'],
    thresholds: {
      lines:    90,
      branches: 90,
      functions:90,
      statements:90,
    },
    include: ['src/**/*.{ts,tsx}'],
    exclude: ['src/main.tsx', 'src/**/*.d.ts', 'src/config/env.ts'],
  }
}
```

### 14.2 `src/test/setup.ts`

```ts
import '@testing-library/jest-dom'
// Mock MSW para interceptar llamadas API en tests
```

### 14.3 Prioridad de tests (para alcanzar 90%)

| Capa | Tipo de test | Prioridad |
|---|---|---|
| Adapters (Zod) | Unit — parse válido e inválido | 🔴 Alta |
| Custom hooks | Unit con `renderHook` | 🔴 Alta |
| Servicios API | Unit con MSW mock | 🔴 Alta |
| Redux slices | Unit puro | 🟡 Media |
| Componentes átomos | Component con Testing Library | 🟡 Media |
| Componentes organismos | Component con mocks | 🟢 Normal |
| Páginas | Integration con MSW | 🟢 Normal |

### 14.4 Scripts de package.json a agregar

```json
"test":          "vitest",
"test:coverage": "vitest run --coverage",
"test:ui":       "vitest --ui"
```

---

## Fase 15 — Reglas adicionales 1: Sincronización de Query Params en URL

**Rol principal:** React Expert · Frontend Architect

**Origen:** AGENTS.md — Reglas adicionales 1  
> *"Cada vez que se consuma un endpoint que tenga parámetros por query, en el frontend se debe tener en cuenta que en la url del frontend, debe tener esos parámetros en la query de la url."*

### Rationale

Cuando un endpoint recibe query parameters (ej. `?startDate=X&endDate=Y&database=Z`), el estado de esos filtros debe ser visible en la URL del frontend para:
- **Bookmarking** — el usuario puede guardar/compartir el enlace con el estado exacto de la vista.
- **Navegación con botón Atrás** — el historial del browser refleja los cambios de filtros.
- **Deep linking** — el addin de MyGeotab puede recibir una URL con parámetros pre-cargados.

> **Nota sobre la implementación actual:** El endpoint `PnpAndPnaReport` usa `{database}` como **path parameter**, no query parameter, por lo que la regla no aplica directamente. El hook `useQueryParams` queda como infraestructura lista para los próximos endpoints que sí usen query params.

### 15.1 Hook `src/hooks/useQueryParams.ts`

Wrapper tipado sobre `useSearchParams` de React Router:

```ts
const { params, setParam, setParams, resetParams } = useQueryParams({
  startDate: '',
  endDate:   '',
  pageSize:  '20',
})
// URL resultante: #/reports/name?startDate=2024-01&endDate=2024-03&pageSize=20
```

Contrato del hook:
- `params` — objeto tipado con todos los query params (con fallback a defaults si no están en URL)
- `setParam(key, value)` — actualiza un param; usa `replace: true` para no crear historial por cada pulsación de tecla
- `setParams(partial)` — batch update de múltiples params
- `resetParams()` — restaura todos los defaults

### 15.2 Patrón de uso en una página con filtros

```
// Endpoint: GET /api/v1/Reports/algun-reporte?startDate=X&endDate=Y
// URL frontend: #/reports/algun-reporte?startDate=X&endDate=Y

const { params, setParam } = useQueryParams({ startDate: '', endDate: '' })

useQuery({
  queryKey: ['report', params.startDate, params.endDate],
  queryFn:  () => getReport(params.startDate, params.endDate),
  enabled:  !!params.startDate,
})
```

### 15.3 Tests

- Verificar defaults cuando la URL no tiene params
- Verificar `setParam` actualiza la URL
- Verificar `setParams` hace batch update sin borrar otros params
- Verificar `resetParams` restaura los defaults

---

---

## Fase 16 — Reglas adicionales 2: Paginado por env y colores Syncfusion

**Rol principal:** React Expert · CSS Expert · Syncfusion Expert

**Origen:** AGENTS.md — Reglas adicionales 2

### 16.1 Tamaño de paginado desde variable de entorno

> *"El tamaño del paginado de las grillas/tablas debe tener una variable de entorno, si la variable no existe el valor por defecto es 10."*

**Variable a agregar:**
```
VITE_PAGE_SIZE=10
```
Archivos a actualizar: `.env.example`, `.env.development`.

**`src/config/env.ts`** — Nueva propiedad:
```ts
PAGE_SIZE: Number(import.meta.env.VITE_PAGE_SIZE) || 10,
```
El `|| 10` garantiza el fallback cuando la variable no está definida o viene vacía.

**`src/components/organisms/DataGrid/DataGrid.tsx`** — Cambiar el default hardcodeado:
```diff
- pageSize = 20,
+ pageSize = ENV.PAGE_SIZE,
```

**`src/pages/PnpAndPnaReport/PnpAndPnaReportPage.tsx`** — Quitar prop explícita `pageSize={20}` para que el DataGrid use el ENV por defecto.

### 16.2 Componentes Syncfusion obedecen colores CSS

> *"Los componentes de syncfusion, deben obedecer a los colores del css."*

**`src/styles/syncfusion.css`** — Ampliar overrides para todos los componentes Syncfusion usados:

| Componente | Propiedades a sobrescribir |
|---|---|
| Grid header | Degradado de marca (ya hecho) |
| Grid pager | Color de botón activo, hover, focus ring |
| Grid filtros (Excel) | Background del dropdown de filtro, checkboxes |
| DropDownList | Border, focus ring, fondo del popup |
| TextBox / Inputs | Border, focus color, placeholder |
| Buttons EJ2 | Color primario, hover, estados |
| Scrollbar | Colores del thumb/track con tokens |

Todas las propiedades de color deben referenciar las custom properties de `tokens.css`. Nunca valores hexadecimales directos en `syncfusion.css`.

### 16.3 Textos de Syncfusion

> *"Si es posible dejar los textos de Syncfusion."*

No se sobrescriben los textos/labels por defecto de los componentes Syncfusion (placeholders de paginador, botones de filtro, etc.). Solo se sobrescriben colores y estilos visuales.

---

## Resumen de fases y dependencias

```
Fase 1  (deps + env)
  └── Fase 2  (design tokens)
        └── Fase 3  (estructura carpetas)
              ├── Fase 4  (capa API)
              │     └── Fase 5  (Redux + TanQuery)
              │           └── Fase 6  (Adapters Zod)
              │                 └── Fase 7  (Routing)
              │                       └── Fase 11 (Primera página)
              └── Fase 8  (Átomos + Moléculas)
                    └── Fase 9  (Organismos — Sidebar, Topbar, DataGrid)
                          └── Fase 10 (Templates — AppShell, PageLayout)
                                └── Fase 11 (Primera página)
Fase 12 (MyGeotab) — paralelo a Fase 7
Fase 13 (Error Boundary + Toastify) — paralelo a Fase 4/5
Fase 14 (Testing) — contínuo, empieza en Fase 4
```

---

## Notas del equipo

- **Syncfusion:** La licencia se registra en `main.tsx` con `registerLicense(ENV.SYNCFUSION_LICENSE)` antes del `ReactDOM.createRoot`. Sin esto, aparece banner de trial.
- **BEM:** Nunca usar clases utilitarias de terceros en los componentes propios. Solo tokens CSS y clases BEM propias.
- **Zod:** Siempre usar `.safeParse` en adapters para capturar errores de contrato y loguearlos sin romper la UI.
- **TanQuery + Redux:** TanQuery gestiona el estado del servidor (cache, loading, error). Redux gestiona estado UI/cliente.
- **MyGeotab:** Probar siempre con el SDK de Geotab en modo desarrollo (`api.call` mock) antes de desplegar.
