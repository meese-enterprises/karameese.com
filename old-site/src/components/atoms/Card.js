import React from "react";

const Card = ({ heading, paragraph, thumbUrl, fullUrl }) => {
	return (
		<div
			className="card"
			// TODO: Extract this style to a stylesheet; 204, 204, 202
			style={{
				backgroundImage:
					"linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(0, 0, 0, 0.2)),url(" +
					thumbUrl +
					")",
			}}
		>
			{/*
				TODO: optimize images to increase site performance/SEO:
				https://using-gatsby-image.gatsbyjs.org/prefer-webp/
				https://www.gatsbyjs.com/plugins/gatsby-image/#how-to-use
			*/}
			<div className="content">
				<h1 className="header">{heading}</h1>
				<p className="text">{paragraph}</p>
				<a
					href={fullUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="btn"
				>
					View Full Image
				</a>
			</div>
		</div>
	)
}

export default Card;
