import { combineReducers } from "redux"
import _ from "lodash"

import { FETCHED, FETCHING, UPDATED, UPDATE_CLEARED, MUTATION_COMPLETED } from "../actions/graphql"

const queries = (state = {}, action) => {
    const currentData = state[action.queryKey]
    switch (action.type) {
        case FETCHED:
            return {
                ...state,
                [action.queryKey]: {
                    fetching: false,
                    data: action.data,
                    variables: action.variables
                }
            }
        case FETCHING:
            return {
                ...state,
                [action.queryKey]: {
                    fetching: true,
                    data: null
                }
            }
        case UPDATED:
            const { optimisticUpdate = {} } = currentData
            return {
                ...state,
                [action.queryKey]: {
                    ...currentData,
                    optimisticUpdate: {
                        ...optimisticUpdate,
                        ...action.update
                    }
                }
            }
        case UPDATE_CLEARED:
            return {
                ...state,
                [action.queryKey]: {
                    ...currentData,
                    optimisticUpdate: _.omit(currentData, "optimisticUpdate")
                }
            }
        case MUTATION_COMPLETED:
            return {
                ...state,
                [action.queryKey]: {
                    ...currentData,
                    data: action.reducer(currentData.data, action.mutationResult)
                }
            }
        default:
            return state
    }
}

export default combineReducers({
    queries
})
