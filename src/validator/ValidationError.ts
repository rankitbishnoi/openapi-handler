/**
 * Validation Error
 *
 * @class ValidationError
 * @extends {Error}
 */
export class ValidationError extends Error {
  validationErrors: Record<string, unknown>

  constructor (validationErrors: Record<string, unknown>) {
    super()
    this.name = 'JsonSchemaValidationError'
    this.validationErrors = validationErrors
  }
}
