module.exports = {
	// Set this to `/karameese.com/old-site/public` on localhost for testing
	pathPrefix: "/old-site/public",
	siteMetadata: {
		title: "Kara Meese",
		description:
			"I'm an artist, graphic designer, and a creative for hire! Contact me for all your art, photography, therapy, and poetry needs.",
		url: "https://www.karameese.com",
		author: "@ajmeese7",
		image: "https://www.karameese.com/logo.png",
	},
	plugins: [
		"gatsby-plugin-react-helmet",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: `${__dirname}/src/images`,
			},
		},
		"gatsby-transformer-sharp",
		"gatsby-plugin-sharp",
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				name: "Kara Meese",
				short_name: "Kara",
				start_url: "/",
				background_color: "#ffffff",
				theme_color: "#F0B0D2",
				display: "minimal-ui",
				// TODO: Find/make a better image for this
				icon: "static/logo.png", // This path is relative to the root of the site.
			},
		},
		"gatsby-plugin-sass",
		"gatsby-plugin-smoothscroll",
	],
}
