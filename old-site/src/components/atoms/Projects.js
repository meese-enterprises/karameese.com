import React from "react";
import Card from "./Card";
import Fade from "react-reveal/Fade";

const Projects = ({ projectsToRender }) => {
	// Will prevent the text from ever being too large for the alloted space
	const trimDesc = (desc) =>
		desc.length < 140 ?
			desc : desc.substring(0, 136) + "...";

	// TODO: Try to get the elements to fade in one-by-one
	return (
		<div className="grid">
			{projectsToRender.map((project, index) => (
				<Fade bottom distance={"50px"} key={index}>
					<Card
						heading={project.title}
						paragraph={trimDesc(project.desc)}
						thumbUrl={project.thumbUrl}
						fullUrl={project.fullUrl}
					></Card>
				</Fade>
			))}
		</div>
  )

	// IDEA: Create the image separate as a const, then add in based on which
	// side is supposed to be current using even index checker
};

export default Projects;