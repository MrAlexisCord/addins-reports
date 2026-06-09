import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Hook genérico para sincronizar query parameters con la URL del frontend.
 *
 * REGLA (AGENTS.md — Reglas adicionales 1):
 * Cada vez que un endpoint del backend use query parameters, esos mismos
 * parámetros deben estar presentes en la URL del frontend como query string,
 * lo que permite bookmarking, navegación con el botón Atrás y deep linking
 * desde el addin de MyGeotab.
 *
 * @example
 * // Endpoint: GET /api/v1/Reports?startDate=2024-01&endDate=2024-03
 * // URL frontend: #/reports/name?startDate=2024-01&endDate=2024-03
 *
 * const { params, setParam, setParams, resetParams } = useQueryParams({
 *   startDate: '',
 *   endDate:   '',
 * })
 *
 * - `params`       — valores actuales (leídos de la URL, fallback a defaults)
 * - `setParam`     — actualiza un parámetro (replace: true para no crear historial)
 * - `setParams`    — batch update de múltiples parámetros
 * - `resetParams`  — restaura todos los defaults
 */
export function useQueryParams<T extends Record<string, string>>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams(defaults)

  const params = Object.fromEntries(
    Object.keys(defaults).map((key) => [
      key,
      searchParams.get(key) ?? defaults[key as keyof T],
    ]),
  ) as T

  const setParam = useCallback(
    (key: keyof T & string, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(key, value)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setParams = useCallback(
    (updates: Partial<T>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [k, v] of Object.entries(updates)) {
            if (v !== undefined) next.set(k, v as string)
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const resetParams = useCallback(() => {
    setSearchParams(defaults, { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSearchParams])

  return { params, setParam, setParams, resetParams } as const
}
