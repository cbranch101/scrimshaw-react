import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import withRouter from "./decorators/with-router.js"
import WidgetList from "../components/widget-list"

storiesOf("WidgetList", module)
    .addDecorator(withRouter())
    .add("basic configuration", () => {
        const props = {
            widgetList: {
                edges: [
                    {
                        node: {
                            id: "1",
                            name: "One",
                            cost: 100
                        }
                    },
                    {
                        node: {
                            id: "2",
                            name: "Two",
                            cost: 100
                        }
                    }
                ],
                totalResults: 10
            },
            createWidget: action("creating widget"),
            updateWidget: action("updating widget"),
            company: {
                id: 1
            }
        }
        return <WidgetList {...props} />
    })
