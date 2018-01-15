/* eslint react/prop-types: 0 */
import React from "react"
import { mount } from "enzyme"
import { Provider } from "react-redux"

import withMutation from "../with-mutation"
import withQuery from "../with-query"
import RequestClientProvider from "../../providers/request-client-provider.js"
import configureStore from "../../../demo/configure-store"
import { getPromiseHandler } from "../../../demo/test-helpers"

const consoleMode = false

const PropContainer = props => {
    return (
        <div data-test="prop-container" data-props={props}>
            props
        </div>
    )
}

const sel = id => `[data-test="${id}"]`
const promiseHandler = getPromiseHandler()

const PropPasser = ({ store, client, component: Component, variables }) => {
    return (
        <Provider store={store}>
            <RequestClientProvider client={client}>
                <Component variables={variables} />
            </RequestClientProvider>
        </Provider>
    )
}

const testMutation = `
    mutation Test {
        name
    }
`

const getMountedTestComponent = options => {
    const client = {
        mutate: jest.fn(() => {
            return delay(5).then(() => {
                return promiseHandler.resolve()
            })
        }),
        query: () => Promise.resolve({ id: 1, count: 5 })
    }
    const store = configureStore()

    const Mutation = withMutation(testMutation, options)
    const Query = withQuery("query", {
        queryKey: "testQuery"
    })
    const RenderComponent = () => {
        return (
            <Query
                variables={{}}
                render={({ id, count }) => {
                    return (
                        <Mutation
                            render={mutationProps => {
                                return (
                                    <PropContainer
                                        propsFromQuery={{ id, count }}
                                        {...mutationProps}
                                    />
                                )
                            }}
                        />
                    )
                }}
            />
        )
    }

    const wrapper = mount(<PropPasser store={store} client={client} component={RenderComponent} />)
    return {
        wrapper,
        client
    }
}

const getPropsFromWrapper = wrapper => wrapper.find(sel("prop-container")).props()["data-props"]

const options = {
    reducers: {
        testQuery: (currentData, mutationResult) => {
            return {
                ...currentData,
                count: mutationResult.count
            }
        }
    }
}

const assertWrapperProps = (wrapper, snapshotName) =>
    consoleMode
        ? consoleWrapper(wrapper, snapshotName)
        : expect(getPropsFromWrapper(wrapper)).toMatchSnapshot(snapshotName)

const assertDuringPromise = (promise, wrapper, delayAmount, description) => {
    return Promise.all([
        promise(),
        delay(delayAmount).then(() => assertWrapperProps(wrapper, description))
    ])
}

test(`Should run the provided mutation`, async () => {
    const mutateInput = { count: 10 }
    promiseHandler.init([{ mutate: mutateInput }])
    const { wrapper, client } = getMountedTestComponent(options)
    const { mutate } = getPropsFromWrapper(wrapper)
    assertWrapperProps(wrapper, "before mutate")
    await assertDuringPromise(() => mutate(mutateInput), wrapper, 1, "during mutate")
    expect(client.mutate).toBeCalledWith(testMutation, { input: mutateInput })
    assertWrapperProps(wrapper, "after mutate")
})

const wrapMutation = mutate => ({
    mutate
})

const delay = t => {
    return new Promise(function(resolve) {
        setTimeout(resolve, t)
    })
}

const consoleWrapper = (wrapper, description) =>
    console.log(description, getPropsFromWrapper(wrapper)) //eslint-disable-line no-console

const assertStaggeredMutations = (wrapper, mutations, mutate) => {
    assertWrapperProps(wrapper, "before mutations")
    const firstMutation = async () => {
        await mutate(mutations[0])
        assertWrapperProps(wrapper, "first complete, second running")
        return true
    }

    const secondMutation = () =>
        assertDuringPromise(
            async () => {
                await delay(2)
                assertWrapperProps(wrapper, "first running")
                await mutate(mutations[1])
                assertWrapperProps(wrapper, "all complete")
                return true
            },
            wrapper,
            3,
            "Both running",
            true
        )

    return Promise.all([firstMutation(), secondMutation()])
}

test(`Should be able to handle multiple inflight mutations with different ids`, async () => {
    const mutations = [
        { id: 1, count: 10, clientMutationId: "one" },
        { id: 2, count: 15, clientMutationId: "two" }
    ]
    promiseHandler.init(mutations.map(mutation => wrapMutation(mutation)))
    const { wrapper } = getMountedTestComponent(options, 5)
    const { mutate } = getPropsFromWrapper(wrapper)
    await assertStaggeredMutations(wrapper, mutations, mutate)
})

test(`Should be able to handle multiple inflight mutations with the same id`, async () => {
    const mutations = [
        { id: 1, count: 10, clientMutationId: "one" },
        { id: 1, count: 15, clientMutationId: "two" }
    ]
    promiseHandler.init(mutations.map(mutation => wrapMutation(mutation)))
    const { wrapper } = getMountedTestComponent(options, 5)
    const { mutate } = getPropsFromWrapper(wrapper)
    await assertStaggeredMutations(wrapper, mutations, mutate)
})
