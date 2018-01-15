import { GraphQLClient } from "graphql-request"

import fragmentHandler from "./fragment-handler"

const Client = url => {
    const client = new GraphQLClient(url)
    return {
        query: (query, vars) => {
            return client.request(fragmentHandler.mixFragmentsIntoQuery(query), vars)
        },
        createFragment: fragmentHandler.createFragment,
        mutate: (query, vars) => {
            return client.request(fragmentHandler.mixFragmentsIntoQuery(query), vars)
        }
    }
}

export default Client
