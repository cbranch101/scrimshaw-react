# Linting GraphQL

## Installation
### Add [`eslint-plugin-graphql`](https://github.com/apollographql/eslint-plugin-graphql)

```
npm install eslint-plugin-graphql --save-dev
yarn add --dev eslint-plugin-graphql
```

### Add [`save-graphql-schema`](https://www.npmjs.com/package/save-graphql-schema)
This downloads the most up to date version of the introspection introspection query for your schema

```
npm install save-graphql-schema --save-dev
yarn add --dev save-graphql-schema
```

### Add new scripts

Add the following to `scripts` in your `package.json` to actually download the schema and run it every
time your app starts
```
"get-schema": "save-graphql-schema [url to your graphql server] --json",
"start": "npm run get-schema && node scripts/start.js",
```

### Configure `eslint` config
Add the following to your eslint config
```
{
  "graphql/template-strings": [
      "error",
      {
          env: "lokka",
          tagName: "gql",
          schemaJson: require("./schema.json")
      }
  ],
  plugins: ["graphql"]
}
```

### Wrap GraphQL in `gql` tag

Finally, wrap all Queries, Mutations, and Fragments in the provided `gql` tag and everything should be linted against your schema

```js
import { gql } from 'scrimshaw-react'

export default withFragments({
    post: gql`
      fragment on Post {
        text
        likes
      }
    `
})(Post)
```
