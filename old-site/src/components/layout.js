/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from 'prop-types'

// import Navbar from "./Navbar";
import "../styles/mains.scss"

const Layout = ({ children }) => {
	return (
		<>
			{/* <Navbar /> */}
			<main>{children}</main>
		</>
	)
}

Layout.propTypes = {
	children: PropTypes.any.isRequired
}

export default Layout
