import React from "react"
import PropTypes from "prop-types"
import deepEqual from "deep-equal"

import {
    fetch as fetchQuery,
    queryUpdated as updateQuery,
    queryUpdateCleared as clearQueryUpdate
} from "../actions"
import withConnect from "./with-connect"
import TrackedProps from "../components/tracked-props"

const unpackCurrentData = (currentData, updatedVariables) => {
    if (!currentData)
        return {
            loading: true,
            optimisticUpdate: {},
            data: null,
            shouldFetch: true
        }

    const { data, optimisticUpdate, fetching, variables } = currentData

    return {
        loading: fetching,
        shouldFetch: !deepEqual(variables, updatedVariables) && !fetching,
        optimisticUpdate: optimisticUpdate || {},
        data: data || null
    }
}

const withQuery = (query, options) => {
    const Connect = withConnect(
        state => ({
            currentData: state.scrimshaw.queries[options.queryKey]
        }),
        { fetchQuery, updateQuery, clearQueryUpdate }
    )
    class Query extends React.Component {
        renderTrackedProps = ({ startFetch, shouldFetch, variables }) => {
            return (
                <TrackedProps
                    values={{
                        shouldFetch,
                        variables
                    }}
                    hasChanged={(prev, next) => {
                        return prev.shouldFetch !== next.shouldFetch && next.shouldFetch
                    }}
                    onMount={() => {
                        startFetch(variables)
                    }}
                    onChange={({ variables }) => startFetch(variables)}
                />
            )
        }
        renderWithReduxData = variables => ({ currentData, ...actions }) => {
            const { loading, shouldFetch, data, optimisticUpdate } = unpackCurrentData(
                currentData,
                variables
            )
            const startFetch = variables => {
                actions.fetchQuery(options.queryKey, query, variables, this.context.requestClient)
            }

            const renderArguments = {
                update: content => {
                    actions.updateQuery(options.queryKey, content)
                },
                refetch: () => startFetch(variables),
                clearUpdate: () => {
                    actions.clearQueryUpdate()
                    startFetch(variables)
                },
                loading,
                ...data,
                ...optimisticUpdate
            }

            return (
                <div>
                    {this.renderTrackedProps({
                        startFetch,
                        shouldFetch,
                        variables
                    })}
                    {options.loadingComponent && loading
                        ? options.loadingComponent
                        : this.props.render(renderArguments)}
                </div>
            )
        }
        render = () => {
            const { variables } = this.props
            return <Connect render={this.renderWithReduxData(variables)} />
        }
    }

    Query.propTypes = {
        render: PropTypes.func.isRequired,
        variables: PropTypes.object.isRequired
    }

    Query.contextTypes = {
        requestClient: PropTypes.object.isRequired
    }

    return Query
}

export default withQuery
