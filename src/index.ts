import { SchemaGenerator } from './helpers/schema.generator'
import { type HandlerOptions } from './interfaces/options.interface'
import { compile, type Options } from 'json-schema-to-typescript'
import { writeFile, opendir } from 'fs/promises'
import $RefParser from '@apidevtools/json-schema-ref-parser'
import path from 'path'
import { TYPES_BANNER_COMMENT } from './constants'

/**
 * @class ApiHandler
 * @export
 */
export class ApiHandler {
  options: HandlerOptions

  /**
   * Creates an instance of ApiHandler.
   *
   * @memberof ApiHandler
   * @param {HandlerOptions} options
   */
  constructor (options: HandlerOptions) {
    this.options = options
  }

  /**
   * Create JSON Schemas from given Open API YML File
   *
   * @memberof ApiHandler
   * @param {string} [openapiYmlPath=this.options.ymlPath] Default is
   *   `this.options.ymlPath`.
   * @param {string} [outDir=thid.options.schemasOutDir] Default is
   *   `thid.options.schemasOutDir`. Default is `thid.options.schemasOutDir`
   */
  async createJSONSchemas (
    openapiYmlPath: string | undefined = this.options.ymlPath,
    outDir: string | undefined = this.options.schemasOutDir
  ): Promise<void> {
    (openapiYmlPath != null) &&
      (await SchemaGenerator.generateSchemas(openapiYmlPath, outDir))
  }

  /**
   * @memberof ApiHandler
   * @param {string | undefined} [jsonSchemasDir=this.options.schemasOutDir]
   *   Default is `this.options.schemasOutDir`
   * @param {string | undefined} [typesOutDir=this.options.typesOutDir] Default
   *   is `this.options.typesOutDir`.
   * @param {Partial<Options>} [typeCompileOptions=this.options.typeCompileOptions]
   *   Default is `this.options.typeCompileOptions`
   * @returns {any} {Promise<void>}
   */
  async createTypes (
    jsonSchemasDir: string | undefined = this.options.schemasOutDir,
    typesOutDir: string | undefined = this.options.typesOutDir,
    typeCompileOptions: Partial<Options> | undefined = this.options.typeCompileOptions
  ): Promise<void> {
    if (jsonSchemasDir == null) {
      throw new Error('No JsonSchema Provided')
    }

    if (typesOutDir == null) {
      throw new Error('No typesOutDir Provided')
    }

    const dir = await opendir(jsonSchemasDir)
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        const schema = await $RefParser.dereference(
          path.join(jsonSchemasDir, dirent.name)
        )
        const ts = await compile(schema as any, dirent.name, {
          bannerComment: TYPES_BANNER_COMMENT,
          cwd: jsonSchemasDir,
          ...typeCompileOptions ?? { }
        })
        await writeFile(
          path.join(typesOutDir, dirent.name.replace('.json', '.d.ts')),
          ts
        )
      }
    }
  }
}

export * from './validator'
export default ApiHandler
