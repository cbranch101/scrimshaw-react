import React from "react"
import PropTypes from "prop-types"

import BasePagination from "../pagination"
import Location from "../location"
import { withFragments, gql } from "../../enhancers"
const enhance = withFragments({
    widgetList: gql`
        fragment on WidgetConnection {
            totalResults
        }
    `
})

const Pagination = ({ widgetList }) => {
    return (
        <Location
            render={({ location: { query: { page } }, push }) => {
                const handlePageClick = page =>
                    push(location => ({
                        pathname: "/widgets",
                        query: {
                            ...location.query,
                            page
                        }
                    }))
                return (
                    <BasePagination
                        page={page}
                        resultCount={widgetList.totalResults}
                        handlePageClick={handlePageClick}
                    />
                )
            }}
        />
    )
}

Pagination.propTypes = {
    location: PropTypes.shape({
        query: PropTypes.shape({
            page: PropTypes.number.isRequired
        })
    }),
    widgetList: PropTypes.shape({
        totalResults: PropTypes.number.isRequired
    })
}

export default enhance(Pagination)
