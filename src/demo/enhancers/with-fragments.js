import client from "../request-client"

export default fragmentMap => Component => {
    const updatedMap = Object.keys(fragmentMap).reduce((acc, propName) => {
        acc[propName] = client.createFragment(fragmentMap[propName])
        return acc
    }, {})
    Component.fragments = updatedMap
    return Component
}
