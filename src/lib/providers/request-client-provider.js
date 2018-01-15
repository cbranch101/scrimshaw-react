import React from "react"
import PropTypes from "prop-types"
class RequestClientProvider extends React.Component {
    static propTypes = {
        client: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired
    }
    getChildContext = () => ({
        requestClient: this.props.client
    })
    render = () => {
        return this.props.children
    }
}

RequestClientProvider.childContextTypes = {
    requestClient: PropTypes.object.isRequired
}

export default RequestClientProvider
