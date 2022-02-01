export enum ValueType {
  BYTE = 1,
  UINT = 2,
}

export const BYTE_ARRAY_MAX_LENGTH = 4096

export const UINT8_MIN_VALUE = 0n
export const UINT8_MAX_VALUE = 0xffn

export const UINT16_MIN_VALUE = 0n
export const UINT16_MAX_VALUE = 0xffffn

export const UINT32_MIN_VALUE = 0n
export const UINT32_MAX_VALUE = 0xffffffffn

export const UINT64_MIN_VALUE = 0n
export const UINT64_MAX_VALUE = 0xffffffffffffffffn

export type InternalValue<T extends ValueType> = {
  [ValueType.BYTE]: Uint8Array
  [ValueType.UINT]: bigint
}[T]

export class Value<T extends ValueType = ValueType> {
  public readonly value: InternalValue<T>

  public static bool(value: boolean): Value<ValueType.UINT> {
    return new Value(value ? 1n : 0n)
  }

  public static byte(value: Uint8Array): Value<ValueType.BYTE> {
    if (value.length > BYTE_ARRAY_MAX_LENGTH) {
      throw Error("Max length exceeded")
    }

    return new Value(value)
  }

  public static uint8(value: number): Value<ValueType.UINT> {
    if (value < UINT8_MIN_VALUE || value > UINT8_MAX_VALUE) {
      throw Error("Integer overflow")
    }

    return new Value(BigInt(value))
  }

  public static uint16(value: number): Value<ValueType.UINT> {
    if (value < UINT16_MIN_VALUE || value > UINT16_MAX_VALUE) {
      throw Error("Integer overflow")
    }

    return new Value(BigInt(value))
  }

  public static uint32(value: number): Value<ValueType.UINT> {
    if (value < UINT32_MIN_VALUE || value > UINT32_MAX_VALUE) {
      throw Error("Integer overflow")
    }

    return new Value(BigInt(value))
  }

  public static uint64(value: bigint): Value<ValueType.UINT> {
    if (value < UINT64_MIN_VALUE || value > UINT64_MAX_VALUE) {
      throw Error("Integer overflow")
    }

    return new Value(value)
  }

  private constructor(value: InternalValue<T>) {
    this.value = value
  }

  public get type(): T {
    if (this.value instanceof Uint8Array) {
      return ValueType.BYTE as T
    } else {
      return ValueType.UINT as T
    }
  }

  public get bool(): boolean {
    if (this.value instanceof Uint8Array) {
      throw Error("Invalid type")
    }

    return this.value !== 0n
  }

  public get byte(): Uint8Array {
    if (this.value instanceof Uint8Array) {
      return this.value
    }

    throw Error("Invalid type")
  }

  public get uint8(): number {
    if (this.value instanceof Uint8Array) {
      throw Error("Invalid type")
    }

    if (this.value < UINT8_MIN_VALUE || this.value > UINT8_MAX_VALUE) {
      throw Error("Integer overflow")
    }

    return Number(this.value)
  }

  public get uint16(): number {
    if (this.value instanceof Uint8Array) {
      throw Error("Invalid type")
    }

    if (this.value < UINT16_MIN_VALUE || this.value > UINT16_MAX_VALUE) {
      throw Error("Integer overflow")
    }

    return Number(this.value)
  }

  public get uint32(): number {
    if (this.value instanceof Uint8Array) {
      throw Error("Invalid type")
    }

    if (this.value < UINT32_MIN_VALUE || this.value > UINT32_MAX_VALUE) {
      throw Error("Integer overflow")
    }

    return Number(this.value)
  }

  public get uint64(): bigint {
    if (this.value instanceof Uint8Array) {
      throw Error("Invalid type")
    }

    if (this.value < UINT64_MIN_VALUE || this.value > UINT64_MAX_VALUE) {
      throw Error("Integer overflow")
    }

    return this.value
  }

  public toString(): string {
    return this.value.toString()
  }
}
