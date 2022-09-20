import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"

import { GET_SNAPSHOT_SPACE_QUERY } from "../queries"

const useSpace = (id: string) => {
  const [data, setData] = useState<any | undefined>(undefined)

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_SNAPSHOT_SPACE_QUERY,
    variables: { id },
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.space)
    } else {
      setData(undefined)
    }
  }, [result])

  return { loading, data, refetch, executeQuery }
}

export default useSpace
