import JSONRequest from "algosdk/dist/types/src/client/v2/jsonrequest"
import { toCamelCaseDeep } from "lib/utils/toCamelCase"

export async function queryIndexer<T>(request: JSONRequest): Promise<T> {
  return toCamelCaseDeep((await request.do()) as T)
}
