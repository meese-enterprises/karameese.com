/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
function SEO({ description, lang, meta, image, title }) {
	const { site } = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						url
						author
						image
					}
				}
			}
		`
	)

	const metaDescription = description || site.siteMetadata.description;
	const defaultTitle = site.siteMetadata?.title;
	const socialImage = site.siteMetadata?.image || image;
	const fullTitle = defaultTitle ? `${title} | ${defaultTitle}` : title;

	return (
		<Helmet
			htmlAttributes={{ lang }}
			title={title}
			titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
			meta={[
				{ property: `description`, content: metaDescription, },
				{ property: `og:title`, content: fullTitle, },
				{ property: `og:description`, content: metaDescription, },
				{ property: `og:url`, content: site.siteMetadata?.url || ``, },
				{ property: `og:type`, content: `website`, },
				{ property: `og:image`, content: socialImage, },
				{ property: `twitter:card`, content: socialImage, },
				{ property: `twitter:creator`, content: site.siteMetadata?.author || ``, },
				{ property: `twitter:title`, content: fullTitle, },
				{ property: `twitter:description`, content: metaDescription, },
			].concat(meta)}
		/>
	)
}

SEO.defaultProps = {
	lang: `en`,
	meta: [],
	image: null,
	description: ``,
}

SEO.propTypes = {
	description: PropTypes.string,
	lang: PropTypes.string,
	meta: PropTypes.arrayOf(PropTypes.object),
	image: PropTypes.string,
	title: PropTypes.string.isRequired,
}

export default SEO;
