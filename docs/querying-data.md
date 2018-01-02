# Querying Data

Fetching data in Scrimshaw is straightforward.  Initialize a `Query` component with a valid GraphQL query string and a couple of configuration options, and then render the component where ever you need to use the data.

## Basic example
```js
import React from "react"

import { withQuery, gql } from "scrimshaw-react"

// A standard graphQL query
// gql is only needed if using eslint-plugin-graphql
// to ensure all GraphQL is valid
const query = gql`
    query UserList($offset: Int) {
        userList {
            name
            email
        }
    }
`


const Query = withQuery(query, {
    // a unique identifier for this query
    queryKey: "users",
    // the component that will load until the data has returned
    // if this isn't included, you can manage loading yourself
    // using the loading prop
    loadingComponent: <div>Loading</div>
})

const UserList = () => {
    return (
        <Query
            // changing these variables will trigger a new fetch
            variables={{ offset: 1 }}
            render={renderArguments => {
                // all the fields the fields in the root of the queryProps
                // are passed into the arguments of the render function
                const { userList } = renderArguments
                return (
                    <ul>
                        {userList.map(user => (
                            <li>
                                {user.name} {user.email}
                            </li>
                        ))}
                    </ul>
                )
            }}
        />
    )
}
```
## `withQuery` options
There are a couple of options that are need to configure a query before it can be rendered

* `queryKey`(required) This is a identifier for the query that should be unique across the entire app. This is the key where the data for the query will be stored in the redux store.
* `loadingComponent`(optional) A component that will render instead of running the render function until the data is returned the first time.  If this isn't provided, the render function will always run, and loading can be managed using the provided `loading` argument

## Managing variables
As long as the object passed into variables matches with the input arguments expected in the query, managing variables should be straightforward, as soon as the variables change, the query will refetch

## Arguments provided to render
In addition to the root field in the query, a few more arguments are provided

* `refetch` A promise than can be called to refetch the data for this query
* `loading` If this field is true, then the initial load hasn't completed yet. This will remain true after calling refetch
