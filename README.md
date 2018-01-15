# <a href='https://cbranch101.github.io/scrimshaw-react/'><img src='https://image.ibb.co/gXwwpw/image_360.png' height='200' alt='Scrimshaw Logo' aria-label='cbranch101.github.io/scrimshaw-react' /></a>

Scrimshaw is a framework that streamlines the process of getting GraphQL data into React components.

Get started with the docs [here](https://cbranch101.github.io/scrimshaw-react/).

[![npm version](https://img.shields.io/npm/v/scrimshaw-react.svg?style=flat-square)](https://www.npmjs.com/package/scrimshaw-react)
[![npm downloads](https://img.shields.io/npm/dm/scrimshaw-react.svg?style=flat-square)](https://www.npmjs.com/package/scrimshaw-react)

## Why Scrimshaw
Scrimshaw arose from our internal experiments with the different available frameworks for getting GraphQL data into React components.  Both Apollo and Relay worked well, but had relatively complicated APIs with a lot of internal moving parts that can be difficult to debug(even with the provided dev tools).  In the search for a simpler alternative, the next step down is something like `graphql-request`, which was very easy to debug, but lacked a lot of the core features necessary to integrate with React.  Scrimshaw attempts to bridge that gap.  We identified what we thought were the core features of React GraphQL client, and implemented those and nothing else.

Scrimshaw is a good fit for small scale React GraphQL apps, users who are looking to get started as quickly as possible, or anyone who wants more control over their GraphQL functionality, but without having to implement everything in React from scratch.

## Comparison
| Feature | Scrimshaw | Relay | Apollo | Graphql Request |
| ------- | --------- | ----- | ------ | --------------- |
| Basic queries | &check; | &check; | &check; | &check; |
| Basic mutations | &check; | &check; | &check; | &check; |
| Query/Mutation components | &check; | &check; | &check; | |
| Data Cache | &check; | &check; | &check; | |
| Optimistic mutations | &check; | &check; | &check; | |
| Co-located fragments | &check; | &check; | &check; | |
| Schema Linting | &check; | &check;  | &check; |  |
| Full `create-react-app` support | &check; |  | &check; | &check; |
| Avoids usage of HOCs | &check; |  |  | &check; |
| Custom dev tools | | | &check; | |
| Subscriptions | | &check; | &check; |  |
| Built in connection based pagination |  | &check; |  |  |
| # of core Components / functions | 4 | 6 | 11 | 2 |
| # unique arguments / provided props | 12 | 51 | 65 | 2 |
