import React from "react"
import uuid from "uuid-v4"

import { withQuery, withMutation, gql } from "../enhancers"
import { RESULTS_PER_PAGE } from "../components/pagination/pagination"
import App from "../components/app"
import Location from "../components/location"
import { createMutation } from "../components/create-widget"
import { addUpdatedWidgetsToWidgetList } from "../components/widget-list"

const appQuery = gql`
    query Viewer($first: Int, $after: String, $offset: Int) {
        viewer {
            company {
                ...${App.fragments.company}
                widgetList(first: $first, after: $after, offset: $offset) {
                    ...${App.fragments.widgetList}
                }
            }
        }
    }
`

export const updateWidgetMutation = gql`
    mutation($input: UpdateWidgetInput!) {
        updateWidget(input: $input) {
            name
            cost
            id
            clientMutationId
        }
    }
`

const CreateMutation = withMutation(createMutation, {})
const UpdateMutation = withMutation(updateWidgetMutation, {
    reducers: {
        app: (appData, updatedWidget) => {
            const updatedValue = {
                ...appData,
                viewer: {
                    ...appData.viewer,
                    company: {
                        ...appData.viewer.company,
                        widgetList: addUpdatedWidgetsToWidgetList(
                            appData.viewer.company.widgetList,
                            [updatedWidget]
                        )
                    }
                }
            }
            return updatedValue
        }
    }
})

const Query = withQuery(appQuery, {
    queryKey: "app",
    loadingComponent: <div>Loading</div>
})

const getVariables = ({ query: { page } }) => {
    const offset = (page - 1) * RESULTS_PER_PAGE
    return {
        offset,
        first: RESULTS_PER_PAGE
    }
}

const AppContainer = () => {
    return (
        <Location
            render={({ location }) => {
                return (
                    <Query
                        variables={getVariables(location)}
                        render={queryProps => {
                            const { viewer: { company }, refetch } = queryProps
                            const { widgetList, ...restOfCompany } = company
                            return (
                                <UpdateMutation
                                    render={({ mutate, mutating, inputs }) => {
                                        const updateWidget = input =>
                                            mutate({
                                                ...input,
                                                clientMutationId: uuid()
                                            })
                                        const optimisticWidgetList = mutating
                                            ? addUpdatedWidgetsToWidgetList(widgetList, inputs)
                                            : widgetList
                                        return (
                                            <CreateMutation
                                                render={({ mutate }) => {
                                                    const createWidget = widget =>
                                                        mutate(widget).then(() => refetch())
                                                    return (
                                                        <App
                                                            company={restOfCompany}
                                                            widgetList={optimisticWidgetList}
                                                            createWidget={createWidget}
                                                            updateWidget={updateWidget}
                                                        />
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                />
                            )
                        }}
                    />
                )
            }}
        />
    )
}

export default AppContainer
