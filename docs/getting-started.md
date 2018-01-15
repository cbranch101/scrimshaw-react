# Getting Started

## Install the dependencies
```
npm install --save scrimshaw-react
yarn add scrimshaw-react
```

## Set up Client
```js
import React from "react"
import ReactDOM from "react-dom"
import { Provider as ReduxProvider } from "react-redux"

import { Provider as ScrimshawProvider, Client } from "scrimshaw-react"
import App from "./components/app.js"
import configureStore from "./configure-store"

// Create the client by providing a valid URL
const client = new Client("http://api.example.com/graphql")

// create a redux store
const store = configureStore()


// Mount the providers
// Be sure that the ScrimshawProvider is above the ReduxProvider
ReactDOM.render(
    <ScrimshawProvider client={client}>
        <ReduxProvider store={store}>
            <App />
        </ReduxProvider>
    </RequestClientProvider>
    document.getElementById("root")
)
```

## Add the reducer
```js
import { combineReducers } from "redux"

import { reducer } from "scrimshaw"

// Mount the reducer at the root under 'scrimshaw'
export default combineReducers({
    scrimshaw: reducer,
    //...other reducers
})
```
