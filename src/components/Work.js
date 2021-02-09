import React from "react"
import Card from "./atoms/Card"
import Fade from "react-reveal/Fade"

import data from "../yourdata"

const Work = () => {
	return (
		<div className="section" id="work">
			<div className="container">
				<div className="work-wrapper">
					<Fade bottom>
						<h1>Work</h1>
					</Fade>

					<div className="grid">
						<Fade bottom cascade>
							{/* TODO: "Load More" button for > 6 projects, and order by date somehow. */}
							{data.projects.map((project, index) => (
								<Card
									key={index}
									heading={project.title}
									paragraph={
										// Will prevent the text from ever being too large for the alloted space
										project.desc.length < 140 ?
										project.desc : project.desc.substring(0, 136) + "..."
									}
									imgUrl={project.imageSrc}
									projectLink={project.url}
								></Card>
							))}
						</Fade>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Work
