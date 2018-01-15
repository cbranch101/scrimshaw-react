const Chance = require("chance");
const getDb = require("./db.js");
const _ = require("lodash");

const {
    connectionFromArray,
    fromGlobalId,
    toGlobalId
} = require("graphql-relay");

const { makeExecutableSchema } = require("graphql-tools");

const SchemaDefinition = `
    interface Node {
        # The id of the object.
        id: ID!
    }

    type Viewer {
        user : User
        company: Company
    }

    type Query {
        node(id: ID): Node
        viewer: Viewer
    }

    type Mutation {
        addWidget(input: AddWidgetInput): AddWidgetPayload
        updateWidget(input: UpdateWidgetInput): Widget
    }

    input UpdateWidgetInput {
        cost: Int
        name: String
        id: ID!
        clientMutationId: String!
    }

    input AddWidgetInput {
        cost: Int!
        name: String!
        clientMutationId: String
    }

    type AddWidgetPayload {
        widgetEdge: WidgetEdge

    }

    type PageInfo {
      # When paginating forwards, are there more items?
      hasNextPage: Boolean!

      # When paginating backwards, are there more items?
      hasPreviousPage: Boolean!

      # When paginating backwards, the cursor to continue.
      startCursor: String

      # When paginating forwards, the cursor to continue.
      endCursor: String
    }

    schema {
        query: Query
        mutation: Mutation
    }
    type User {
        name: String!
    }
    type Widget implements Node {
        id: ID!
        name: String!
        cost: Int!
        clientMutationId: String
    }
    type WidgetConnection {
        totalResults: Int!
        pageInfo: PageInfo!
        edges: [WidgetEdge]
    }

    type WidgetEdge {
        node: Widget
        cursor: String!
    }

    type Company {
        id: String!
        name: String!
        averageCost: Int!
        widgetList(
            first: Int,
            before: String,
            after: String,
            last: Int,
            offset: Int
        ): WidgetConnection
    }
`;

const globalIdField = type => obj => toGlobalId(type, obj.id);

const db = getDb();

const getConnection = async args => {
    const widgets = await db.widgets.find(widgets =>
        widgets.sort((a, b) => a > b ? 1 : -1)
    );

    const droppedWidgets = _.drop(widgets, args.offset || 0);
    const connection = connectionFromArray(droppedWidgets, args);
    const updated = Object.assign(
        {
            totalResults: widgets.length
        },
        connection
    );
    return updated;
};

const resolvers = {
    Query: {
        viewer: () => Promise.resolve({}),
        node: (query, args) => {
            const { type, id } = fromGlobalId(args.id);
            return db.widgets.findById(id);
        }
    },
    Viewer: {
        user: () => db.users.findById("1"),
        company: () => db.companies.findById("1")
    },
    Mutation: {
        addWidget: (mutation, args) => {
            const { clientMutationId, name, cost } = args.input;
            return db.widgets.insert({ name, cost }).then(newItem => {
                return {
                    widgetEdge: {
                        node: newItem,
                        cursor: toGlobalId("Widget", newItem.id)
                    },
                    clientMutationId
                };
            });
        },
        updateWidget: (mutation, args) => {
            const { name, cost, clientMutationId } = args.input
            const { id, type } = fromGlobalId(args.input.id)
            return db.widgets.update(id, { name, cost }).then(
                widget => {
                    return Object.assign(
                        {
                            clientMutationId
                        },
                        widget
                    )
                }
            )
        }
    },
    Company: {
        widgetList: (query, args) => getConnection(args)
    },
    Widget: {
        id: globalIdField("Widget")
    },
    Node: {
        __resolveType: (obj, context, info) =>
            fromGlobalId(info.variableValues.id).type
    }
};

module.exports = makeExecutableSchema({
    typeDefs: [SchemaDefinition],
    resolvers
});
