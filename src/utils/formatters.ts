/**
 * Formatea segundos a HH:mm:ss.
 * - ss y mm siempre con 2 dígitos.
 * - HH mínimo 2 dígitos, crece sin límite superior.
 *
 * @example
 *   formatDuration(90)      // "00:01:30"
 *   formatDuration(3661)    // "01:01:01"
 *   formatDuration(86400)   // "24:00:00"
 *   formatDuration(360000)  // "100:00:00"
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.floor(Math.abs(seconds))
  const ss = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const mm = totalMinutes % 60
  const hh = Math.floor(totalMinutes / 60)

  const pad2 = (n: number) => String(n).padStart(2, '0')
  return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`
}

/**
 * Formatea un número decimal con exactamente 8 cifras decimales.
 *
 * @example
 *   formatCoordinate(23.75935)  // "23.75935000"
 */
export function formatCoordinate(value: number): string {
  return value.toFixed(8)
}

/**
 * Formatea una fecha a dd/mm/aaaa hh:mm:ss en hora local (reloj 24h).
 *
 * @example
 *   formatDateLocal(new Date('2026-04-28T21:25:26'))  // "28/04/2026 21:25:26"
 */
export function formatDateLocal(date: Date): string {
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const dd   = pad2(date.getDate())
  const mo   = pad2(date.getMonth() + 1)
  const yyyy = date.getFullYear()
  const hh   = pad2(date.getHours())
  const mm   = pad2(date.getMinutes())
  const ss   = pad2(date.getSeconds())
  return `${dd}/${mo}/${yyyy} ${hh}:${mm}:${ss}`
}
