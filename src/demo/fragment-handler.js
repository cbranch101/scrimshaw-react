import uuid from "uuid"
export default () => {
    const currentFragments = {}
    const createFragment = (fragment, fragmentName) => {
        if (!fragment) {
            throw new Error("fragment is required!")
        }

        const name = fragmentName || "f" + uuid.v4().replace(/-/g, "")

        const fragmentWithName = fragment.replace(
            "fragment",
            `fragment ${name}`
        )
        if (currentFragments[name])
            throw new Error(`fragment ${name} is already defined`)
        currentFragments[name] = fragmentWithName
        return name
    }

    const findFragments = (queryOrFragment, fragmentsMap = {}) => {
        const matched = queryOrFragment.match(/\.\.\.[A-Za-z0-9]+/g)
        if (matched) {
            const fragmentNames = matched.map(name => name.replace("...", ""))
            fragmentNames.forEach(name => {
                const fragment = currentFragments[name]
                if (!fragment) {
                    throw new Error(`There is no such fragment: ${name}`)
                }
                fragmentsMap[name] = fragment
                findFragments(fragment, fragmentsMap)
            })
        }

        const fragmentsArray = Object.keys(fragmentsMap).map(key => {
            return fragmentsMap[key]
        })

        return fragmentsArray
    }

    const mixFragmentsIntoQuery = query => {
        const foundFragments = findFragments(query)
        const queryWithFragments = `${query}\n${foundFragments.join("\n")}`
        return queryWithFragments
    }

    return {
        createFragment,
        findFragments,
        mixFragmentsIntoQuery
    }
}
