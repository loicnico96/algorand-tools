import { useNetworkContext } from "context/NetworkContext"
import { queryIndexer } from "lib/api/query"
import { AccountInfo } from "lib/api/types"
import { useQuery, UseQueryResult } from "./useQuery"

export function useAccountInfo(address: string): UseQueryResult<AccountInfo> {
  const { indexer, network } = useNetworkContext()

  return useQuery(
    `${network}:accounts/${address}`,
    async () => {
      const query = indexer.lookupAccountByID(address)
      const data = await queryIndexer<{ account: AccountInfo }>(query)
      return data.account
    },
    {
      immutable: true,
    }
  )
}
