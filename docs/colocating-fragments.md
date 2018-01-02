# Colocating Fragments

Keeping the fragments describing the specific data needs of a component in the same file as the component makes it much easier to ensure that component's data requirements stay up to date.  For example, when paired with `eslint-plugin-graphql` using colocated fragments ensures that if you have changes to your GraphQL schema, every component that needs to have its props updated will be flagged by the linter.

## Example

In this example, we'll have three different components, each with different data requirements.
`Post` renders the `text` and `likes` fields for a post, `PostList` renders the list of post along with the name of the user the posts are for, and `User` ties everything together.  

### `Post`
```js
import { withFragments } from "scrimshaw-react"

const Post = ({ post }) => {
    return (
        <li>
            <span>{post.text}</span>
            <span>{post.likes}</span>
        </li>
    )
}

export default withFragments({
    // this tag is only needed if you want to do linting
    post: gql`
      fragment on Post {
        text
        likes
      }
    `
})(Post)
```

While `withFragments` looks like an HOC here, it's doesn't require jumping through a lot of the hoops that HOCs require, as all its doing is assigning a static `fragments` property to the component.  The only thing worth noting is that, by convention, the fragments in the object provided to with fragments are indexed by the props that they correspond with

### `PostList`

```js
import React from "react"
import Post from "./post"
import { withFragments } from "scrimshaw-react"

const PostList = ({ user }) => {
    return (
        <div>
            <span>Posts for {user.name}</span>
            <ul>{user.posts.map(post => <Post post={post} />)}</ul>
        </div>
    )
}

export default withFragments({
    user: gql`
      fragment on User {
        name
        posts {
          ...${Post.fragments.post}
        }
      }
  `
})(PostList)
```

Going one level up, we follow the same structure, while adding the fragments from further down the tree into this fragment. To make it as easy as possible to keep fragments up to date, make sure that only fields actually used in this component are specified at this level

### `User`

```js
import React from "react"

import { withQuery, gql } from "scrimshaw-react"
import PostList from "./post-list"

const query = gql`
    query User {
        ...${PostList.fragments.user}
    }
`

const Query = withQuery(query, {
    queryKey: "user",
    loadingComponent: <div>Loading</div>
})

const User = () => {
    return (
        <Query
            render={({ user }) => {
                return (
                    <div>
                        <PostList user={user} />
                    </div>
                )
            }}
        />
    )
}
export default User
```

Finally, we actually provide the fragments to a query and everything works. Bundling fragments this way makes it much easier to ensure that components stay in sync with a schema changes, and that new data requirements get added correctly to fragments.  For example, let's say we wanted to add a `title` field to our `Post` component.  Instead of needing to remember to update a field in some other file, we simple add `title` to the fragment in `Post` and the changes cascade all the way up the tree.
