import fs from "fs";
import path from "path";
import schemaGenerator from "@openapi-contrib/openapi-schema-to-json-schema";
import YAML from "yaml";
import { SCHEMAS_FOLDER } from "../constants";

const SCHEMAS_PATH = path.join(__dirname, "..", SCHEMAS_FOLDER);

/**
 * @class SchemaGenerator
 * @export
 */
export class SchemaGenerator {
  /**
   * @memberof SchemaGenerator
   * @param {Record<string | number, any>} generatedSchema
   * @param {string} name
   * @returns {any} {(Record<string | number, any>)}
   * @static
   */
  static schemaAdapter(
    generatedSchema: Record<string | number, any>,
    name: string
  ): Record<string | number, any> {
    delete generatedSchema.$schema;
    generatedSchema.title = name;
    generatedSchema.$id = `${name}.json`;
    if (generatedSchema.format?.includes("date")) {
      generatedSchema.tsType = "Date";
    }

    return generatedSchema;
  }

  /**
   * @memberof SchemaGenerator
   * @param {string} openapiYmlPath
   * @param {string} [outDir=SCHEMAS_PATH] Default is `SCHEMAS_PATH`
   * @returns {any} {Promise<void>}
   * @static
   */
  static async generateSchemas(
    openapiYmlPath: string,
    outDir: string = SCHEMAS_PATH
  ): Promise<void> {
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
    const openAPIContent = fs.readFileSync(openapiYmlPath, "utf8");
    const parsedOpenAPIContent = YAML.parse(openAPIContent);
    const COMPONENT_REF_REGEXP = /#\/components\/schemas\/[^"]+/g;
    Object.entries(parsedOpenAPIContent.components.schemas).forEach(
      ([name, schema]: any) => {
        const generatedSchema =
          schemaGenerator<Record<string | number, any>>(schema);
        SchemaGenerator.schemaAdapter(generatedSchema, name);
        let stringifiedSchema = JSON.stringify(generatedSchema, undefined, 2);
        const results = stringifiedSchema.match(COMPONENT_REF_REGEXP);
        (results || []).forEach((element) => {
          const refName = element.split("/").at(-1);
          stringifiedSchema = stringifiedSchema.replace(
            element,
            `${refName}.json`
          );
        });
        const destinationPath = path.join(outDir, `${name}.json`);
        fs.writeFileSync(destinationPath, stringifiedSchema);
      }
    );
  }
}
