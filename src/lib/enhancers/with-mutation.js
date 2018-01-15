import React from "react"
import PropTypes from "prop-types"
import _ from "lodash"

import State from "../components/state"
import withConnect from "./with-connect"
import { mutationCompleted } from "../actions"

const Connect = withConnect(() => ({}), { mutationCompleted })

// complete the mutation and update the redux if
//  this is the active active mutation
//  or if this is the last active mutation that matches the id of the
// completed mutation
const shouldCompleteMutation = (inputs, mutationResult) => {
    if (inputs.length === 0) return false
    if (inputs.length === 1) return true
    const idCount = inputs.reduce((count, input) => {
        if (input.id !== mutationResult.id) return count
        return input.id !== mutationResult.id ? count : count + 1
    }, 0)
    return idCount === 1
}

const withMutation = (mutation, options) => {
    const { reducers = {} } = options
    const Mutation = ({ render }, context) => {
        return (
            <Connect
                render={({ mutationCompleted }) => {
                    return (
                        <State
                            initialState={{
                                inputs: []
                            }}
                            handlers={{
                                setMutationInput: newInput => ({ inputs }) => {
                                    const existingIndex = _.findIndex(
                                        inputs,
                                        input =>
                                            input.clientMutationId === newInput.clientMutationId
                                    )
                                    if (!existingIndex)
                                        return inputs.splice(existingIndex, 1, newInput)
                                    return {
                                        inputs: [...inputs, newInput]
                                    }
                                },
                                completeMutation: (completedInput, mutationResult) => ({
                                    inputs
                                }) => {
                                    if (shouldCompleteMutation(inputs, mutationResult)) {
                                        Object.keys(reducers).forEach(name =>
                                            mutationCompleted(name, mutationResult, reducers[name])
                                        )
                                    }
                                    return {
                                        inputs: inputs.filter(
                                            input =>
                                                completedInput.clientMutationId !==
                                                input.clientMutationId
                                        )
                                    }
                                }
                            }}
                            render={({ setMutationInput, completeMutation, inputs }) => {
                                const mutate = input => {
                                    setMutationInput(input)
                                    return context.requestClient
                                        .mutate(mutation, { input: input })
                                        .then(response => {
                                            const mutationResult =
                                                response[Object.keys(response)[0]]
                                            completeMutation(input, mutationResult)
                                            return mutationResult
                                        })
                                }
                                return render({
                                    mutate,
                                    mutating: inputs.length > 0,
                                    inputs
                                })
                            }}
                        />
                    )
                }}
            />
        )
    }
    Mutation.contextTypes = {
        reducers: PropTypes.objectOf(PropTypes.func),
        requestClient: PropTypes.object.isRequired
    }
    Mutation.propTypes = {
        render: PropTypes.func.isRequired
    }
    return Mutation
}

export default withMutation
