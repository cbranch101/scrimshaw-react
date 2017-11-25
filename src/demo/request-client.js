import { GraphQLClient } from "graphql-request"

import createFragmentHandler from "./fragment-handler"

const fragmentHandler = createFragmentHandler()

const client = new GraphQLClient("http://localhost:3000/graphql")

export default {
    query: (query, vars) => {
        return client.request(
            fragmentHandler.mixFragmentsIntoQuery(query),
            vars
        )
    },
    createFragment: fragmentHandler.createFragment,
    mutate: (query, vars) => {
        return client.request(
            fragmentHandler.mixFragmentsIntoQuery(query),
            vars
        )
    }
}
