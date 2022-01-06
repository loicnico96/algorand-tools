import { isObject } from "./types"

export function toCamelCase(key: string): string {
  return key.replace(/[-_]./g, m => m[1].toUpperCase())
}

export function toCamelCaseDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(toCamelCaseDeep) as T & unknown[]
  }

  if (isObject(value)) {
    return Object.keys(value).reduce((result, key) => {
      result[toCamelCase(key)] = toCamelCaseDeep(value[key])
      return result
    }, {} as Record<string, unknown>) as T
  }

  return value
}
