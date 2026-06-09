import { useRef } from 'react'
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Filter,
  Sort,
  Resize,
  Reorder,
  Page,
  ExcelExport,
  type GridModel,
  type ColumnModel,
  type GridComponent as GridComponentType,
} from '@syncfusion/ej2-react-grids'
import { Spinner } from '@atoms/Spinner'
import { Button } from '@atoms/Button'
import { ENV } from '@config/env'
import './DataGrid.css'

export interface DataGridProps<T extends object> {
  columns:         ColumnModel[]
  dataSource:      T[]
  loading?:        boolean
  height?:         string | number
  pageSize?:       number
  allowExcelExport?: boolean
  caption?:        string
}

export function DataGrid<T extends object>({
  columns,
  dataSource,
  loading = false,
  height = 'auto',
  pageSize = ENV.PAGE_SIZE,
  allowExcelExport = true,
  caption,
}: DataGridProps<T>) {
  const gridRef = useRef<GridComponentType | null>(null)

  const handleExport = () => {
    gridRef.current?.excelExport()
  }

  const gridSettings: GridModel = {
    allowFiltering:  true,
    allowSorting:    true,
    allowResizing:   true,
    allowReordering: true,
    allowPaging:     true,
    allowExcelExport: true,
    filterSettings:  { type: 'Excel' },
    pageSettings:    { pageSize },
    height,
  }

  return (
    <div className={`data-grid${loading ? ' data-grid--loading' : ''}`}>
      {loading && (
        <div className="data-grid__loading-overlay">
          <Spinner size="lg" />
        </div>
      )}

      {(caption || allowExcelExport) && (
        <div className="data-grid__caption">
          {caption && (
            <>
              <span className="data-grid__excel-chip" aria-hidden="true">E</span>
              <span>{caption}</span>
            </>
          )}
          {allowExcelExport && (
            <div className="data-grid__toolbar">
              <Button variant="ghost" size="sm" onClick={handleExport}>
                Exportar Excel
              </Button>
            </div>
          )}
        </div>
      )}

      <GridComponent
        ref={gridRef}
        dataSource={dataSource}
        {...gridSettings}
      >
        <ColumnsDirective>
          {columns.map((col) => (
            <ColumnDirective key={col.field as string} {...col} />
          ))}
        </ColumnsDirective>
        <Inject services={[Filter, Sort, Resize, Reorder, Page, ExcelExport]} />
      </GridComponent>
    </div>
  )
}
