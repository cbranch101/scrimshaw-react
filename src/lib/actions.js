const prefix = "@SCRIMSHAW_"
export const FETCHED = `${prefix}QUERY_FETCHED`
export const FETCHING = `${prefix}QUERY_FETCHING`
export const UPDATED = `${prefix}QUERY_UPDATED`
export const UPDATE_CLEARED = `${prefix}QUERY_UPDATE_CLEARED`
export const MUTATION_COMPLETED = `${prefix}MUTATION_COMPLETED`

export const queryFetched = (queryKey, data, variables) => ({
    type: FETCHED,
    queryKey,
    data,
    variables
})

export const queryFetching = queryKey => ({
    type: FETCHING,
    queryKey
})

export const queryUpdated = (queryKey, update) => ({
    type: UPDATED,
    queryKey,
    update
})

export const queryUpdateCleared = queryKey => ({
    type: UPDATE_CLEARED,
    queryKey
})

export const mutationCompleted = (queryKey, mutationResult, reducer) => ({
    type: MUTATION_COMPLETED,
    queryKey,
    mutationResult,
    reducer
})

export const fetch = (queryKey, query, variables = {}, client) => dispatch => {
    dispatch(queryFetching(queryKey))
    client.query(query, variables).then(data => dispatch(queryFetched(queryKey, data, variables)))
}
