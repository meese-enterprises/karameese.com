import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Header from "../components/Header"
import Work from "../components/Work"
import About from "../components/About"
import Skills from "../components/Skills"
import Footer from "../components/Footer"

const IndexPage = () => (
	<Layout>
		<SEO title="Home" />
		<Header />
		<About />
		<Skills />
		<Work />
		<Footer />
	</Layout>
)

export default IndexPage
