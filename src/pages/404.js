import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

// TODO: Style this so there isn't the nav bar above it, and
// it's centered on the screen. Add a 'Go Back' button as well,
// maybe with a fun distraction.
const NotFoundPage = () => (
	<Layout>
		<SEO title="404: Not found" />
		<h1>404: Not Found</h1>
		<p>You just hit a route that doesn't exist... the sadness.</p>
	</Layout>
)

export default NotFoundPage
