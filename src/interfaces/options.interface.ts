import { Options } from "json-schema-to-typescript";

/**
 * @export
 * @interface HandlerOptions
 */
export interface HandlerOptions {
  ymlPath?: string; // OpenAPI Yml Path, it should not be relative path.
  schemasOutDir?: string; // Directory to export generated Json Schemas.
  typesOutDir?: string; // Directory to export generated Types.
  typeCompileOptions?: Partial<Options>;
}
