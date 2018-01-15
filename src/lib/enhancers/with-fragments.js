import fragmentHandler from "../fragment-handler"

export default fragmentMap => Component => {
    const updatedMap = Object.keys(fragmentMap).reduce((acc, propName) => {
        acc[propName] = fragmentHandler.createFragment(fragmentMap[propName])
        return acc
    }, {})
    Component.fragments = updatedMap
    return Component
}
