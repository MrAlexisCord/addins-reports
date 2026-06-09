# Plan 002 — Reporte PnP & PnA (Alertas de Detenciones)

> **Equipo:** React Expert · CSS/BEM Expert · Syncfusion Expert  
> **Regla:** Leer, planear, **no ejecutar** — cada fase es una unidad de trabajo autónoma.  
> **Referencia:** [Feature](../features/002-pnp-and-pna-report.md) · [CSV Columnas](../docs/Grilla%20de%20Detenciones%20%20-%20Hoja%201.csv) · [Prototipo](../docs/prototypes/alertas-de-detenciones-mockup.html) · [API Docs](../docs/routetrackingt2addinsv2api-v1.json)

---

## Contexto del DTO

```csharp
// Application.DTOs.Alerts.PnpAndPnaReportDto
public class PnpAndPnaReportDto {
    public int     Id              { get; set; }
    public int?    AlertaId        { get; set; }
    public int?    VehiculoId      { get; set; }
    public DateTime? FechaGenerado { get; set; }
    public float?  Latitud         { get; set; }
    public float?  Longitud        { get; set; }
    public float?  Velocidad       { get; set; }
    public float?  Duracion        { get; set; }   // null = alerta activa
    public DateTime? Fechainsercion{ get; set; }
    public bool?   Gestionada      { get; set; }
    public int?    IdRuta          { get; set; }
    public int?    IdViaje         { get; set; }
    public int?    Secuencia       { get; set; }
    public string? Version         { get; set; }
    public bool?   BlnNotificada   { get; set; }
    public string? Direccion       { get; set; }   // ← Ubicación en el grid
    public string? Ruta            { get; set; }
    // JOINs
    public string? Conductor       { get; set; }
    public string? TipoAlerta      { get; set; }   // ← Alerta en el grid
    public string? Transportista   { get; set; }
    public string? Placa           { get; set; }
    public string? CodigoViaje     { get; set; }
}
```

---

## ⚠️ Ambigüedad a confirmar antes de la ejecución

| Campo | Duda | Impacto |
|---|---|---|
| `Duracion` (unidad) | El CSV dice "expresado en minutos" pero los datos del prototipo (`1840`, `7795`) son coherentes solo si la unidad es **segundos** (1840s = ~30 min). En minutos sería más de 30 horas. | Afecta el formateo `mm:ss` |

**Decisión asumida en este plan:** `Duracion` está en **segundos** (float?). Si el backend devuelve minutos, solo hay que cambiar el divisor en el formateador.

- `Duracion === null` → alerta **activa** → mostrar ETA calculado en tiempo real desde `FechaGenerado`
- `Duracion !== null` → alerta **finalizada** → mostrar valor final en `HH:mm:ss`

---

## Equivalencia CSV → DTO → App Model

| Columna CSV | Campo DTO | App Model field | Formato en grid |
|---|---|---|---|
| Transportista | `Transportista` | `transportista` | Texto, Left, default "Desconocido" |
| Placa | `Placa` | `placa` | Texto, Left |
| Conductor | `Conductor` | `conductor` | Texto, Left, default "Desconocido" |
| Código de Viaje | `CodigoViaje` | `codigoViaje` | Texto, Left, ocultar si null |
| Alerta | `TipoAlerta` | `tipoAlerta` | StatusPill centrado |
| Latitud | `Latitud` | `latitud` | Decimal 8 cifras, Right |
| Longitud | `Longitud` | `longitud` | Decimal 8 cifras, Right |
| Ubicación | `Direccion` | `ubicacion` | Texto largo, Left, wrap |
| Fecha | `FechaGenerado` | `fechaGenerado` | dd/mm/aaaa hh:mm:ss 24h, Center |
| Duración (Minutos) | `Duracion` | `duracion` | HH:mm:ss o "ETA HH:mm:ss", Right |

---

## Estado actual de archivos a modificar

| Archivo | Estado actual |
|---|---|
| `src/models/service/pnpAndPna.service.model.ts` | Placeholder `{ [key: string]: unknown }` |
| `src/models/app/pnpAndPna.app.model.ts` | Placeholder `{ [key: string]: unknown }` |
| `src/adapters/pnpAndPna.adapter.ts` | Schema genérico `z.record` (sin campos reales) |
| `src/services/pnpAndPna.service.ts` | Funcional, sin refetchInterval |
| `src/hooks/usePnpAndPnaReport.ts` | Funcional, sin refetchInterval |
| `src/pages/PnpAndPnaReport/PnpAndPnaReportPage.tsx` | Columnas placeholder, usa AppShell |
| `src/config/router.tsx` | PnpAndPna bajo AppShell (con sidebar+topbar) |

---

## Fase 1 — Actualizar Service Model

**Archivo:** `src/models/service/pnpAndPna.service.model.ts`

Reemplazar el placeholder por el mapeo 1:1 del DTO de C# (camelCase por convención JSON de .NET):

```ts
export interface PnpAndPnaServiceModel {
  id:             number
  alertaId:       number | null
  vehiculoId:     number | null
  fechaGenerado:  string | null     // ISO 8601
  latitud:        number | null
  longitud:       number | null
  velocidad:      number | null
  duracion:       number | null     // segundos; null = alerta activa
  fechainsercion: string | null     // ISO 8601
  gestionada:     boolean | null
  idRuta:         number | null
  idViaje:        number | null
  secuencia:      number | null
  version:        string | null
  blnNotificada:  boolean | null
  direccion:      string | null
  ruta:           string | null
  // JOINs
  conductor:      string | null
  tipoAlerta:     string | null
  transportista:  string | null
  placa:          string | null
  codigoViaje:    string | null
}
```

---

## Fase 2 — Actualizar App Model

**Archivo:** `src/models/app/pnpAndPna.app.model.ts`

Solo los campos que la UI consume (sin los internos de BD):

```ts
export interface PnpAndPnaAppModel {
  id:           number
  transportista: string        // "Desconocido" si null
  placa:         string
  conductor:     string        // "Desconocido" si null
  codigoViaje:   string | null // null cuando no hay viaje asignado
  tipoAlerta:    string
  latitud:       number
  longitud:      number
  ubicacion:     string | null // no aplica para detenciones no autorizadas
  fechaGenerado: Date
  duracion:      number | null // segundos; null = activa → ETA en tiempo real
}
```

---

## Fase 3 — Actualizar Adapter y Schema Zod

**Archivo:** `src/adapters/pnpAndPna.adapter.ts`

Reemplazar el schema genérico por el schema real:

```ts
// Zod schema — refleja PnpAndPnaServiceModel
export const pnpAndPnaItemSchema = z.object({
  id:             z.number(),
  alertaId:       z.number().nullable(),
  vehiculoId:     z.number().nullable(),
  fechaGenerado:  z.string().nullable(),
  latitud:        z.number().nullable(),
  longitud:       z.number().nullable(),
  velocidad:      z.number().nullable(),
  duracion:       z.number().nullable(),
  fechainsercion: z.string().nullable(),
  gestionada:     z.boolean().nullable(),
  idRuta:         z.number().nullable(),
  idViaje:        z.number().nullable(),
  secuencia:      z.number().nullable(),
  version:        z.string().nullable(),
  blnNotificada:  z.boolean().nullable(),
  direccion:      z.string().nullable(),
  ruta:           z.string().nullable(),
  conductor:      z.string().nullable(),
  tipoAlerta:     z.string().nullable(),
  transportista:  z.string().nullable(),
  placa:          z.string().nullable(),
  codigoViaje:    z.string().nullable(),
})

export const pnpAndPnaListSchema = z.array(pnpAndPnaItemSchema)
```

Función de transformación service → app:

```ts
function toAppModel(raw: z.infer<typeof pnpAndPnaItemSchema>): PnpAndPnaAppModel {
  return {
    id:            raw.id,
    transportista: raw.transportista ?? 'Desconocido',
    placa:         raw.placa ?? '',
    conductor:     raw.conductor ?? 'Desconocido',
    codigoViaje:   raw.codigoViaje ?? null,
    tipoAlerta:    raw.tipoAlerta ?? '',
    latitud:       raw.latitud ?? 0,
    longitud:      raw.longitud ?? 0,
    ubicacion:     raw.direccion,
    fechaGenerado: raw.fechaGenerado ? new Date(raw.fechaGenerado) : new Date(0),
    duracion:      raw.duracion,
  }
}

export function toPnpAndPnaAppModelList(raw: unknown): PnpAndPnaAppModel[] {
  const items = unwrapResponse(pnpAndPnaListSchema, raw)
  return items.map(toAppModel)
}
```

---

## Fase 4 — Layout AddinShell (sin sidebar ni topbar)

La feature indica que para el addin de MyGeotab **no se necesita** sidebar ni navbar, ya que MyGeotab provee su propia navegación al incrustar el addin en un iFrame.

**Archivo nuevo:** `src/components/templates/AddinShell/AddinShell.tsx`

Layout minimalista — solo envuelve el contenido con el área de la página:

```tsx
import { Outlet } from 'react-router-dom'
import './AddinShell.css'

export function AddinShell() {
  return (
    <div className="addin-shell">
      <Outlet />
    </div>
  )
}
```

```css
/* AddinShell.css */
.addin-shell {
  min-height: 100vh;
  background: var(--color-bg-app);
  font-family: var(--font-family-base);
}
```

**Actualizar barrel:** `src/components/templates/index.ts` → exportar `AddinShell`

---

## Fase 5 — Actualizar Router

**Archivo:** `src/config/router.tsx`

Mover la ruta de PnpAndPna fuera de `AppShell` y bajo el nuevo `AddinShell`:

```ts
export const router = createHashRouter([
  // Rutas de addins — sin sidebar ni topbar
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
```

> **Nota:** `AppShell` queda en el codebase para futuros reportes internos (no addin). Por ahora ninguna ruta activa lo usa.

---

## Fase 6 — Hook `useEtaTimer`

**Archivo nuevo:** `src/hooks/useEtaTimer.ts`

Hook que calcula el tiempo transcurrido desde `startDate` en intervalos de 1 segundo.
Solo activo cuando `isActive === true` (i.e., `duracion === null`).

```ts
/**
 * Devuelve los segundos transcurridos desde `startDate`.
 * Se actualiza cada segundo mientras `isActive` sea true.
 * Cuando `isActive` es false devuelve null (sin timer activo).
 */
export function useEtaTimer(startDate: Date | null, isActive: boolean): number | null
```

Implementación:
- `useState<number | null>(null)`
- `useEffect` con `setInterval(1000)` que calcula `(Date.now() - startDate.getTime()) / 1000`
- Limpia el interval en el cleanup
- Si `!isActive`, retorna `null` directamente sin montar el interval

---

## Fase 7 — Formateadores y Templates de celda

**Archivo nuevo:** `src/utils/formatters.ts` (ya existe; agregar las siguientes funciones)

### `formatDuration(seconds: number): string`

Formato: `HH:mm:ss` donde:
- **ss** — siempre 2 dígitos (`00`–`59`)
- **mm** — siempre 2 dígitos (`00`–`59`)
- **HH** — mínimo 2 dígitos, puede crecer si la duración supera 99 horas

```
90       →  "00:01:30"
3661     →  "01:01:01"
86400    →  "24:00:00"
360000   → "100:00:00"   (HH crece a 3 dígitos)
```

### `formatCoordinate(value: number): string`
```
23.75935000 → "23.75935000"   (8 decimales fijos)
```

### `formatDateLocal(date: Date): string`
```
Date → "28/04/2026 21:25:26"  (dd/mm/aaaa hh:mm:ss 24h)
```

---

## Fase 8 — Componente `DurationCell`

**Archivo nuevo:** `src/components/atoms/DurationCell/DurationCell.tsx`

Átomo específico para la celda de Duración. Usa `useEtaTimer` internamente:

```tsx
interface DurationCellProps {
  duracion:      number | null   // segundos finales, null si activa
  fechaGenerado: Date
}

// Si duracion === null → alerta activa → monta timer local y muestra "ETA HH:mm:ss"
// Si duracion !== null → muestra valor final "mm:ss"
```

Estilos BEM: `.duration-cell`, `.duration-cell--active` (badge de color diferente para ETA activo)

```
Ejemplo visual:
  Finalizada: "01:30:40"
  Activa:     "ETA 00:12:03"  ← se incrementa cada segundo
```

---

## Fase 9 — Actualizar `usePnpAndPnaReport`

**Archivo:** `src/hooks/usePnpAndPnaReport.ts`

Agregar `refetchInterval: 60_000` para re-fetch automático cada minuto:

```ts
export const usePnpAndPnaReport = (database: string) =>
  useQuery({
    queryKey:        ['pnpAndPna', database],
    queryFn:         () => getPnpAndPnaReport(database),
    enabled:         !!database,
    refetchInterval: 60_000,   // ← nuevo
  })
```

---

## Fase 10 — Actualizar `PnpAndPnaReportPage`

**Archivo:** `src/pages/PnpAndPnaReport/PnpAndPnaReportPage.tsx`

### Columnas del grid

```ts
const COLUMNS: ColumnModel[] = [
  { field: 'transportista', headerText: 'Transportista',      textAlign: 'Left',   width: 150 },
  { field: 'placa',         headerText: 'Placa',              textAlign: 'Left',   width: 110 },
  { field: 'conductor',     headerText: 'Conductor',          textAlign: 'Left',   width: 145 },
  { field: 'codigoViaje',   headerText: 'Código de Viaje',   textAlign: 'Left',   width: 150 },
  { field: 'tipoAlerta',    headerText: 'Alerta',             textAlign: 'Center', width: 210, template: alertaTemplate },
  { field: 'latitud',       headerText: 'Latitud',            textAlign: 'Right',  width: 130, template: coordTemplate('latitud') },
  { field: 'longitud',      headerText: 'Longitud',           textAlign: 'Right',  width: 130, template: coordTemplate('longitud') },
  { field: 'ubicacion',     headerText: 'Ubicación',          textAlign: 'Left',   width: 320 },
  { field: 'fechaGenerado', headerText: 'Fecha',              textAlign: 'Center', width: 175, template: fechaTemplate },
  { field: 'duracion',      headerText: 'Duración (Minutos)', textAlign: 'Right',  width: 145, template: duracionTemplate },
]
```

### Templates de columna

- **`alertaTemplate`** — renderiza `<StatusPill label={tipoAlerta} />` con variante según "prolongada" | "no autorizada"
- **`coordTemplate(field)`** — `formatCoordinate(row[field])` con clase `.coords` (fuente tabular)
- **`fechaTemplate`** — `formatDateLocal(row.fechaGenerado)`
- **`duracionTemplate`** — renderiza `<DurationCell duracion={row.duracion} fechaGenerado={row.fechaGenerado} />`

### Comportamiento de `CodigoViaje`

Si `codigoViaje === null` (vehículo sin viaje asignado) → la celda queda vacía. No mostrar "-" ni texto de reemplazo.

### `geotabDatabase` fallback

Ya implementado en `useGeotabApi`: `window.geotab.getSession()` en producción, `VITE_DEV_DATABASE ?? 'demo'` en desarrollo. No requiere cambios.

### Layout

Usa `PageLayout` (sin sidebar ni topbar, ya resuelto en Fase 5 con `AddinShell`). El `PageLayout` solo muestra el header de título + `content-card`:

```tsx
<PageLayout title="Alertas de Detenciones">
  <DataGrid
    columns={COLUMNS}
    dataSource={rows}
    loading={isLoading}
    caption="Datos exportables a Excel"
  />
</PageLayout>
```

---

## Fase 11 — `StatusPill` extendido para tipos de alerta

El átomo `StatusPill` actual soporta un `variant` genérico. Para los tipos de alerta se necesitan dos variantes nuevas:

| Valor `tipoAlerta` | Variante | Color sugerido |
|---|---|---|
| Contiene "prolongada" | `prolonged` | Amarillo/naranja (alerta moderada) |
| Contiene "no autorizada" | `unauthorized` | Rojo (alerta crítica) |
| Otros | `default` | Gris (estado actual) |

Actualizar `StatusPill.tsx` y `StatusPill.css` para soportar estas nuevas variantes.

---

## Fase 12 — Tests

### Tests a actualizar

| Archivo | Cambio |
|---|---|
| `src/adapters/pnpAndPna.adapter.test.ts` | Reemplazar fixtures genéricos por datos reales del DTO |
| `src/services/pnpAndPna.service.test.ts` | Verificar que el mock retorna la estructura del DTO real |
| `src/models/service/wrapperResponse.schema.test.ts` | Sin cambios (genérico) |

### Tests nuevos a crear

| Archivo | Qué probar |
|---|---|
| `src/utils/formatters.test.ts` | `formatDuration`, `formatCoordinate`, `formatDateLocal` |
| `src/hooks/useEtaTimer.test.ts` | Timer activo/inactivo, cleanup al desmontar, incremento por segundo |
| `src/components/atoms/DurationCell/DurationCell.test.tsx` | Render con `duracion !== null`, render con `duracion === null` (ETA), incremento |
| `src/components/templates/AddinShell/AddinShell.test.tsx` | Renderiza `<Outlet />` sin sidebar ni topbar |

### Cobertura objetivo

Mantener ≥ 90% en branches, lines, statements, functions tras todos los cambios.

---

## Fase 13 — Consideraciones MyGeotab Addin

Para que el addin funcione correctamente cuando se publique en MyGeotab:

1. **`public/addin.json`** — ya existe; revisar que `"url"` apunte a `"dist/index.html"`.
2. **`window.geotab`** — `useGeotabApi` ya maneja el fallback a `"demo"`.
3. **Hash Router** — ya configurado con `createHashRouter`.
4. **CSS aislado** — el addin corre en un iFrame; no hay conflictos de estilos con MyGeotab.
5. **Sin sidebar/topbar** — resuelto en Fase 4 y 5 con `AddinShell`.

---

## Dependencias entre fases

```
Fase 1  (Service Model)
  └── Fase 2  (App Model)
        └── Fase 3  (Adapter + Zod)
              └── Fase 9  (usePnpAndPnaReport con refetchInterval)
                    └── Fase 10 (PnpAndPnaReportPage — columnas reales)

Fase 4  (AddinShell)
  └── Fase 5  (Router actualizado)
        └── Fase 10 (PnpAndPnaReportPage usa AddinShell como contexto)

Fase 6  (useEtaTimer)
  └── Fase 8  (DurationCell — usa useEtaTimer)
        └── Fase 10 (template de columna Duración)

Fase 7  (formatters)
  └── Fase 10 (templates de columnas Fecha, Coord)

Fase 11 (StatusPill extendido)
  └── Fase 10 (template de columna Alerta)

Fase 12 (Tests) — después de todas las demás
```

---

## Resumen de archivos nuevos / modificados

| Acción | Archivo |
|---|---|
| **Modificar** | `src/models/service/pnpAndPna.service.model.ts` |
| **Modificar** | `src/models/app/pnpAndPna.app.model.ts` |
| **Modificar** | `src/adapters/pnpAndPna.adapter.ts` |
| **Modificar** | `src/hooks/usePnpAndPnaReport.ts` |
| **Modificar** | `src/pages/PnpAndPnaReport/PnpAndPnaReportPage.tsx` |
| **Modificar** | `src/config/router.tsx` |
| **Modificar** | `src/components/atoms/StatusPill/StatusPill.tsx` + `.css` |
| **Modificar** | `src/utils/formatters.ts` |
| **Crear** | `src/components/templates/AddinShell/AddinShell.tsx` + `.css` + `index.ts` |
| **Crear** | `src/hooks/useEtaTimer.ts` |
| **Crear** | `src/components/atoms/DurationCell/DurationCell.tsx` + `.css` + `index.ts` |
| **Crear** | `src/utils/formatters.test.ts` |
| **Crear** | `src/hooks/useEtaTimer.test.ts` |
| **Crear** | `src/components/atoms/DurationCell/DurationCell.test.tsx` |
| **Crear** | `src/components/templates/AddinShell/AddinShell.test.tsx` |
| **Modificar** | `src/adapters/pnpAndPna.adapter.test.ts` |
| **Modificar** | `src/services/pnpAndPna.service.test.ts` |

---

## Punto de atención antes de ejecutar

> **`Duracion` — unidad pendiente de confirmar:** el CSV dice "expresado en minutos" pero los valores del prototipo (`1840`, `7795`) solo tienen sentido en **segundos**. El plan asume segundos. Si el backend confirma minutos, solo cambia el divisor en el formateador `formatDuration`.

> **Formato de duración confirmado:** `HH:mm:ss`
> - `ss` — siempre 2 dígitos
> - `mm` — siempre 2 dígitos
> - `HH` — mínimo 2 dígitos, crece sin límite superior
>
> Ejemplos: `90s → "00:01:30"` · `3661s → "01:01:01"` · `360000s → "100:00:00"`  
> ETA activa: `"ETA 00:12:03"` (mismo formato, prefijo "ETA ")
