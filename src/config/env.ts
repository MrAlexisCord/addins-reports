/**
 * Acceso tipado y seguro a las variables de entorno VITE_*
 * Todas las variables requeridas se validan aquí.
 */

function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value) {
    console.warn(`[env] Variable de entorno faltante: ${key}`)
  }
  return (value as string) ?? ''
}

export const ENV = {
  API_BASE_URL:       requireEnv('VITE_API_BASE_URL'),
  SYNCFUSION_LICENSE: requireEnv('VITE_SYNCFUSION_LICENSE_KEY'),
  FONT_FAMILY:        (import.meta.env.VITE_APP_FONT_FAMILY as string) ?? '"Segoe UI", Roboto, sans-serif',
  PAGE_SIZE:          Number(import.meta.env.VITE_PAGE_SIZE) || 10,
} as const
