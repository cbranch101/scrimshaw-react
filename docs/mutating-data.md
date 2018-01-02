# Mutating Data
While a little bit more involved than queries, mutations in Scrimshaw are still very simple

## Basic Mutation example
```js
import React from "react"

import { withMutation, gql } from "scrimshaw-react"

export const mutation = gql`
    mutation($text: String) {
        createPost(text: $text) {
            text
            id
        }
    }
`

const CreateMutation = withMutation(mutation)

class CreatePost extends React.Component {
    state = {
        text: ""
    }
    render = () => {
        return (
            <CreateMutation
                // most of the time, the only argument you'll need in render is the actual mutation promise
                render={({ mutate }) => {
                    return (
                        <div>
                            <input
                                type="text"
                                value={this.state.text}
                                onChange={e => {
                                    this.setState({
                                        text: e.target.value
                                    })
                                }}
                            />
                            <button onClick={() => mutate({ text: this.state.text })} />
                        </div>
                    )
                }}
            />
        )
    }
}
```

## `withMutation` options
* `reducers`(optional) `{[queryKey]: (currentData, mutationResult) => updatedData}` An object where the keys are `queryKey`s of a query you want to update once this mutation completes, and the values are standard redux reducers that receive the data currently in the store and the data returned from the mutation, and returns the updated data for the store.  

## Arguments provided to render
* `mutate` A promise that receives the input specified in the mutation and then resolves with whatever the mutation returns
* `mutating` If this field is true, then there is at least one instance of this mutation currently inflight
* `inputs` An array of the inputs provided to all currently inflight mutations, in the order that they went out


## Optimistic Mutation example
```js
import React from "react"

import { withQuery, withMutation, gql } from "scrimshaw-react"
import CreatePost from "../components/create-post"
import PostList from "../components/post-list"

// define the query that will be mutated
const postQuery = gql`
    query Posts() {
      posts {
        text
        id
      }
    }
`

// define the mutation
export const mutation = gql`
    mutation($text: String) {
        createPost(text: $text) {
            text
            id
        }
    }
`

// create the Query component
const Query = withQuery(postQuery, {
    queryKey: "posts",
    loadingComponent: <div>Posts Loading</div>
})

// create the mutation component
const CreateMutation = withMutation(mutation, {
    // update the data stored for a given query once the mutation completes
    reducers: {
        // make sure this corresponds with the queryKey specified in the
        // query you want to update
        posts: (posts, newPost) => {
            // be sure to avoid mutating any objects in these reducers
            // as they are run within redux
            return [...posts, newPost]
        }
    }
})

const Posts = () => {
    return (
        <Query
            render={({ posts }) => {
                // Because the mutation needs to optimistically update posts
                // be sure to have the mutation inside of the query.
                // Otherwise, the order of the wrapping doesn't matter
                return (
                    <CreateMutation
                        render={({ mutate: createPost, mutating, inputs }) => {
                            // if we're mutating, use the currently inflight inputs
                            // to optimistically add new posts to the current post list
                            // once the mutation completes, posts will update, and we no longer
                            // need to deal with optimistic updates
                            const optimisticPosts = mutating
                                ? [
                                    ...posts,
                                    // iterate over the inflight inputs
                                    // and generate a shape that matches a valid post
                                    ...inputs.map((input, index) => ({
                                        text: input.text,
                                        id: `creating-${index}`
                                    }))
                                ]
                                : posts
                            return (
                                <div>
                                    <CreatePost onCreate={createPost} />
                                    <PostList posts={optimisticPosts} />
                                </div>
                            )
                        }}
                    />
                )
            }}
        />
    )
}
```
