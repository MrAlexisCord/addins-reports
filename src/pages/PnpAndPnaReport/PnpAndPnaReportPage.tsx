import { useMemo } from 'react'
import type { ColumnModel } from '@syncfusion/ej2-react-grids'
import { PageLayout } from '@templates/PageLayout'
import { DataGrid } from '@organisms/DataGrid'
import { StatusPill } from '@atoms/StatusPill'
import type { StatusPillVariant } from '@atoms/StatusPill'
import { DurationCell } from '@atoms/DurationCell'
import { useGeotabApi } from '@hooks/useGeotabApi'
import { usePnpAndPnaReport } from '@hooks/usePnpAndPnaReport'
import { formatCoordinate, formatDateLocal } from '@utils/formatters'
import type { PnpAndPnaAppModel } from '@models/app/pnpAndPna.app.model'

// ---------------------------------------------------------------------------
// Helpers de variant para StatusPill de tipo de alerta
// ---------------------------------------------------------------------------
function alertaVariant(tipoAlerta: string): StatusPillVariant {
  const lower = tipoAlerta.toLowerCase()
  if (lower.includes('no autorizada')) return 'unauthorized'
  if (lower.includes('prolongada'))    return 'prolonged'
  return 'default'
}

// ---------------------------------------------------------------------------
// Templates de celda (React elements — Syncfusion soporta JSX en template)
// ---------------------------------------------------------------------------
const alertaTemplate = (row: PnpAndPnaAppModel) => (
  <StatusPill label={row.tipoAlerta} variant={alertaVariant(row.tipoAlerta)} />
)

const latitudTemplate  = (row: PnpAndPnaAppModel) => (
  <span className="coords">{formatCoordinate(row.latitud)}</span>
)

const longitudTemplate = (row: PnpAndPnaAppModel) => (
  <span className="coords">{formatCoordinate(row.longitud)}</span>
)

const fechaTemplate = (row: PnpAndPnaAppModel) => (
  <span>{formatDateLocal(row.fechaGenerado)}</span>
)

const duracionTemplate = (row: PnpAndPnaAppModel) => (
  <DurationCell duracion={row.duracion} fechaGenerado={row.fechaGenerado} />
)

// ---------------------------------------------------------------------------
// Definición de columnas — alineación tipo Excel según CSV
// ---------------------------------------------------------------------------
const COLUMNS: ColumnModel[] = [
  {
    field: 'transportista',
    headerText: 'Transportista',
    textAlign: 'Left',
    width: 150,
  },
  {
    field: 'placa',
    headerText: 'Placa',
    textAlign: 'Left',
    width: 110,
  },
  {
    field: 'conductor',
    headerText: 'Conductor',
    textAlign: 'Left',
    width: 145,
  },
  {
    field: 'codigoViaje',
    headerText: 'Código de Viaje',
    textAlign: 'Left',
    width: 150,
  },
  {
    field: 'tipoAlerta',
    headerText: 'Alerta',
    textAlign: 'Center',
    width: 220,
    template: alertaTemplate,
  },
  {
    field: 'latitud',
    headerText: 'Latitud',
    textAlign: 'Right',
    width: 130,
    template: latitudTemplate,
  },
  {
    field: 'longitud',
    headerText: 'Longitud',
    textAlign: 'Right',
    width: 130,
    template: longitudTemplate,
  },
  {
    field: 'ubicacion',
    headerText: 'Ubicación',
    textAlign: 'Left',
    width: 320,
  },
  {
    field: 'fechaGenerado',
    headerText: 'Fecha',
    textAlign: 'Center',
    width: 175,
    template: fechaTemplate,
  },
  {
    field: 'duracion',
    headerText: 'Duración',
    textAlign: 'Right',
    width: 145,
    template: duracionTemplate,
  },
]

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------
export function PnpAndPnaReportPage() {
  const { database }        = useGeotabApi()
  const { data, isLoading } = usePnpAndPnaReport(database)

  const rows = useMemo(() => data ?? [], [data])

  return (
    <PageLayout
      title="Alertas de Detenciones"
      subtitle={`Base de datos: ${database}`}
    >
      <DataGrid
        columns={COLUMNS}
        dataSource={rows}
        loading={isLoading}
        caption="Datos exportables a Excel"
      />
    </PageLayout>
  )
}

