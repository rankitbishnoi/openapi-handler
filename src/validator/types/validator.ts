import { type JSONSchema4, type JSONSchema6, type JSONSchema7 } from 'json-schema'

export type OptionKey = 'body' | 'params' | 'query'

export type List<T> = {
  [K in OptionKey]?: T;
}

export type AllowedSchema = JSONSchema4 | JSONSchema6 | JSONSchema7 | string
