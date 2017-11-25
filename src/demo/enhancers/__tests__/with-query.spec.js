/* eslint react/prop-types: 0 */
import React from "react"
import { mount } from "enzyme"
import { Provider } from "react-redux"

import withQuery from "../with-query"
import RequestClientProvider from "../../providers/request-client-provider.js"
import configureStore from "../../configure-store"
import { getPromiseHandler } from "../../test-helpers"

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

const testQuery = `
    query Test {
        name
    }
`

const getMountedTestComponent = (query, options, variables) => {
    promiseHandler.init([{ bar: "boo", foo: "test" }])
    const client = {
        query: jest.fn(() => {
            return Promise.resolve(promiseHandler.resolve())
        })
    }
    const store = configureStore()

    const Query = withQuery(query, options)
    const RenderComponent = ({ variables }) => {
        return (
            <Query
                variables={variables}
                render={queryProps => {
                    return <PropContainer {...queryProps} />
                }}
            />
        )
    }

    const wrapper = mount(
        <PropPasser
            store={store}
            client={client}
            component={RenderComponent}
            variables={variables}
        />
    )
    return {
        wrapper,
        client
    }
}

const getPropsFromWrapper = wrapper => wrapper.find(sel("prop-container")).props()["data-props"]

test(`Should run the provided query`, async () => {
    const options = {
        queryKey: "test",
        mapProps: props => ({ ...props, addedProp: true }),
        loadingComponent: <div data-test="loading">Loading</div>
    }

    const variables = { page: 1 }

    const { wrapper, client } = getMountedTestComponent(testQuery, options, {
        page: 1
    })

    expect(client.query).toBeCalledWith(testQuery, variables)
    expect(wrapper.find(sel("loading")).length).toBe(1)

    await promiseHandler.execute(0)
    expect(getPropsFromWrapper(wrapper)).toMatchSnapshot("after loaded props")
})

test("Changing query variables should trigger another fetch", async () => {
    const options = { queryKey: "test" }

    const variables = { page: 1 }

    const { wrapper } = getMountedTestComponent(testQuery, options, variables)
    await promiseHandler.execute

    expect(getPropsFromWrapper(wrapper)).toMatchSnapshot("first load")
    promiseHandler.init([{ updatedData: true }])
    wrapper.setProps({ variables: { page: 2 } })
    await promiseHandler.execute(0)
    expect(getPropsFromWrapper(wrapper)).toMatchSnapshot("second load")
})

test("Calling the provided refetch prop should trigger another query fetch", async () => {
    const options = { queryKey: "test" }

    const variables = { page: 1 }

    const { wrapper } = getMountedTestComponent(testQuery, options, variables)
    await promiseHandler.execute(0)

    promiseHandler.init([{ refetched: true }])
    const { refetch } = getPropsFromWrapper(wrapper)
    refetch()

    await promiseHandler.execute(0)

    expect(getPropsFromWrapper(wrapper)).toMatchSnapshot("refetched props")
})

test("Calling update prop should apply an optimistic update", async () => {
    const options = {
        queryKey: "test"
    }

    const variables = { page: 1 }

    const { wrapper } = getMountedTestComponent(testQuery, options, variables)
    await promiseHandler.execute(0)

    const { update, clearUpdate } = getPropsFromWrapper(wrapper)
    update({ one: "optimisticValue" })
    expect(getPropsFromWrapper(wrapper)).toMatchSnapshot("optmistically updated props")
    promiseHandler.init([{ foo: "refetched", bar: "refetched" }])
    clearUpdate()
    await promiseHandler.execute(0)
    expect(getPropsFromWrapper(wrapper)).toMatchSnapshot("refetched after update")
})
