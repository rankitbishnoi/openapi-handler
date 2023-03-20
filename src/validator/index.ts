/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { type NextFunction, type Request, type Response } from 'express'
import $RefParser from '@apidevtools/json-schema-ref-parser'
import { join } from 'path'
import fs from 'fs'
import { ValidationError } from './ValidationError'
import { responseValidator } from './responseValidator'
import { type AnyValidateFunction } from 'ajv/dist/core'
import type { AnySchema } from 'fast-json-stringify'
import { type List, type AllowedSchema, type OptionKey } from './types'

/**
 * Express middleware for validating requests
 *
 * @class Validator
 */
class Validator {
  ajv: Ajv
  validateFunctions: Record<string, AnyValidateFunction<unknown>> = {}

  constructor (ajv = new Ajv({ strict: false })) {
    this.ajv = ajv
    addFormats(this.ajv)
  }

  // initialize the validator
  async initialize (baseApiSchemasDir: string[]): Promise<void> {
    await this.addOpenApiSchemas(baseApiSchemasDir)
  }

  // load Schemas in cache
  async loadAjvSchemas (baseDir: string, schemaFileName: string): Promise<void> {
    const schemaPath = join(baseDir, schemaFileName)
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')
    try {
      const schemaParsedContent = JSON.parse(schemaContent)
      this.ajv.addSchema(schemaParsedContent)
      const schema = await $RefParser.dereference(schemaPath)
      responseValidator.addSchema(
        schemaFileName.replace('.json', '#'),
        schema as AnySchema
      )
    } catch (e) {
      console.log(e)
      console.log(`Error while parsing schema: ${schemaPath}`)
    }
  }

  // loop on all the available schemas and load them in cache
  async addOpenApiSchemas (baseApiSchemasDir: string[]): Promise<void> {
    const schemas = []

    for (const schemaPath of baseApiSchemasDir) {
      schemas.push(
        ...fs
          .readdirSync(schemaPath)
          .map(async schemaFileName => { await this.loadAjvSchemas(schemaPath, schemaFileName) }
          )
      )
    }

    await Promise.all(schemas)
  }

  // get validate function for a schema
  getValidationFunction (schemaName: string): AnyValidateFunction<unknown> {
    schemaName = schemaName.replace('#', '.json')
    if (this.validateFunctions[schemaName]) {
      return this.validateFunctions[schemaName]
    }

    const schema = this.ajv.getSchema(schemaName)
    if (schema) {
      this.validateFunctions[schemaName] = schema
    }
    return this.validateFunctions[schemaName]
  }

  // Cache validate functions
  cacheValidateFunction (schemaNames: string[]): void {
    schemaNames.forEach(name => {
      name = name.replace('#', '.json')
      const schema = this.ajv.getSchema(name)
      if (schema) {
        this.validateFunctions[name] = schema
      }
    })
  }

  /**
     * Validator method to be used as middleware
     *
     * @param {Object} options Options in format { request_property: schema }
     * @returns
     */
  validate (options: List<AllowedSchema>) {
    // The actual middleware function
    return (req: Request, _: Response, next: NextFunction) => {
      const validationErrors: Record<string, unknown> = {}
      const validateFunctions = Object.keys(options).map(
        requestProperty => ({
          requestProperty,
          validateFunction: this.getValidationFunction(
            options[requestProperty as OptionKey] as string
          )
        })
      )

      for (const {
        requestProperty,
        validateFunction
      } of validateFunctions) {
        // Test if property is valid
        const valid = validateFunction(
          req[requestProperty as OptionKey]
        )
        if (!valid) {
          validationErrors[requestProperty] = validateFunction.errors
        }
      }

      if (Object.keys(validationErrors).length !== 0) {
        next(new ValidationError(validationErrors))
      } else {
        next()
      }
    }
  }
}

export const validator = new Validator()
export * from './types'
export * from './ValidationError'
export * from './responseValidator'

export default Validator
