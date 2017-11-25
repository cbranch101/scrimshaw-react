import withMutation from "./with-mutation"
import withQuery from "./with-query"
import withFragments from "./with-fragments"

export const gql = (literals, ...substitutions) => {
    let result = ""

    // run the loop only for the substitution count
    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i]
        result += substitutions[i]
    }

    // add the last literal
    result += literals[literals.length - 1]
    return result
}

export { withMutation, withQuery, withFragments }
