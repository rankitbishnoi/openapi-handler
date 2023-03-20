import FastJson from 'fast-json-stringify'
import type { AnySchema } from 'fast-json-stringify'

/**
 * Express Validator to validate and serialize response
 *
 * @class Response Validator
 */
class ResponseValidator {
  private schemas: Record<string, AnySchema> = {}

  // cache all schemas on app start to validate faster
  addSchema (name: string, schema: AnySchema): void {
    this.schemas[name] = schema
  }

  // validate and seriealize data using schema Name
  validateAddSerialize (
    schemaName: string,
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const fastJson = FastJson(this.schemas[schemaName])

    return JSON.parse(fastJson(data))
  }
}

export const responseValidator = new ResponseValidator()
