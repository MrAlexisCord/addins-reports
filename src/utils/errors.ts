/**
 * Clases de error personalizadas para la capa API.
 *
 * ApiBusinessError — el backend respondió HTTP 2xx pero succeeded === false.
 * ApiHttpError     — error de red o código HTTP 4xx/5xx.
 */

export class ApiBusinessError extends Error {
  readonly errors: string[]

  constructor(message: string, errors: string[] = []) {
    super(message)
    this.name = 'ApiBusinessError'
    this.errors = errors
  }
}

export class ApiHttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiHttpError'
    this.status = status
  }
}
