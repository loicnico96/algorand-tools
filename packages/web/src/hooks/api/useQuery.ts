import { useCallback } from "react"
import useSWR from "swr"

export interface UseQueryOptions<T> {
  fallbackData?: T
  immutable?: boolean
  onError?: (error: Error) => void
  onSuccess?: (value: T) => void
}

export interface UseQueryResult<T> {
  data?: T
  error?: Error
  isLoading: boolean
  refetch: () => Promise<T>
}

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  { immutable, ...options }: UseQueryOptions<T> = {}
): UseQueryResult<T> {
  const { data, error, isValidating, mutate } = useSWR(key, fetcher, {
    ...options,
    revalidateIfStale: !immutable,
    revalidateOnFocus: !immutable,
    revalidateOnReconnect: !immutable,
  })

  const refetch = useCallback(async () => {
    const newData = await mutate(undefined, { revalidate: true })
    if (!newData) {
      throw Error("Failed to fetch")
    }

    return newData
  }, [mutate])

  return {
    data,
    error,
    isLoading: isValidating,
    refetch,
  }
}
