import createFragmentHandler from "../fragment-handler.js"

test("should replace any defined fragments in a query", () => {
    const fragmentHandler = createFragmentHandler()
    const fragmentOne = fragmentHandler.createFragment(
        `
        fragment on Test {
            name
        }
    `,
        "fragmentName"
    )
    const query = `
        {
            test {
                ...${fragmentOne}
            }
        }
    `
    const wrappedQuery = fragmentHandler.mixFragmentsIntoQuery(query)
    expect(wrappedQuery).toMatchSnapshot()
})
