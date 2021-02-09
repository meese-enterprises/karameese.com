module.exports = {
	siteMetadata: {
		title: `Kara Meese`,
		description: `I'm an artist, graphic designer, and a creative for hire! Contact me for all your art, photography, therapy, and poetry needs.`,
		author: `@ajmeese7`,
	},
	plugins: [
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `gatsby-starter-default`,
				short_name: `starter`,
				start_url: `/`,
				background_color: `#663399`,
				theme_color: `#663399`,
				display: `minimal-ui`,
				// TODO: Find/make a better image for this
				icon: `src/images/favicon.png`, // This path is relative to the root of the site.
			},
		},
		`gatsby-plugin-sass`,
		`gatsby-plugin-smoothscroll`,
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	],
}
