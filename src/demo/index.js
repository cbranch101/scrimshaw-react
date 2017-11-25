import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"

import RequestClientProvider from "./providers/request-client-provider"
import App from "./containers/app.js"
import configureStore from "./configure-store"
import "./index.css"
import client from "./request-client"

const store = configureStore()

ReactDOM.render(
    <Router>
        <RequestClientProvider client={client}>
            <Provider store={store}>
                <App />
            </Provider>
        </RequestClientProvider>
    </Router>,
    document.getElementById("root")
)
