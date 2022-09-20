import { gql } from "urql"

export const GET_SNAPSHOT_SPACE_QUERY = gql`
  query getSnapshotSpace($id: String!) {
    space(id: $id) {
      id
      name
    }
  }
`
