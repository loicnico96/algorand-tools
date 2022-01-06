export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

export function isError(value: unknown): value is Error {
  return value instanceof Error
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function"
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}
