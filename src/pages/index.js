import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
// Components
import Header from "../components/Header"
import Work from "../components/Work"
import About from "../components/About"
import Skills from "../components/Skills"
//import Promotion from "../components/Promotion"
import Footer from "../components/Footer"

const IndexPage = () => (
	<Layout>
		<SEO title="Home" />
		<Header />
		<About />
		<Skills />
		<Work />
		{/*<Promotion />*/}
		<Footer />
	</Layout>
)

export default IndexPage
