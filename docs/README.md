# <a href='https://cbranch101.github.io/scrimshaw-react/'><img src='https://image.ibb.co/gXwwpw/image_360.png' height='200' alt='Scrimshaw Logo' aria-label='cbranch101.github.io/scrimshaw-react' /></a>

Scrimshaw is a series of render prop components for querying GraphQL Data in react.

[![npm version](https://img.shields.io/npm/v/scrimshaw-react.svg?style=flat-square)](https://www.npmjs.com/package/scrimshaw-react)
[![npm downloads](https://img.shields.io/npm/dm/scrimshaw-react.svg?style=flat-square)](https://www.npmjs.com/package/scrimshaw-react)

## Installation

### Install the dependencies
```
npm install --save scrimshaw-react
yarn add scrimshaw-react
```

### Set up Client
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

### Add the reducer
```js
import { combineReducers } from "redux"

import { reducer } from "scrimshaw"

// Mount the reducer at the root under 'scrimshaw'
export default combineReducers({
    scrimshaw: reducer,
    //...other reducers
})
```
