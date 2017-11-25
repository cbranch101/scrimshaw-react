import React from "react"
import PropTypes from "prop-types"

import Switch from "./switch"
import { withFragments, gql } from "../enhancers"

const pathMap = {
    "exact /": "Widgets",
    "/widgets/:id": "Widget",
    "/widgets": "Widgets"
}

const Header = ({ company }) => {
    return (
        <Switch
            pathMap={pathMap}
            render={pathText => {
                return (
                    <h1>
                        {pathText} for {company.name}
                    </h1>
                )
            }}
        />
    )
}

Header.propTypes = {
    company: PropTypes.shape({
        name: PropTypes.string
    })
}

const enhance = withFragments({
    company: gql`
            fragment on Company {
                name
            }
        `
})

export default enhance(Header)
