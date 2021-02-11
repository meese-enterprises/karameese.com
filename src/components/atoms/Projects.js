import React from "react";
import Card from "./Card";
import Fade from "react-reveal/Fade";

const Projects = ({ projectsToRender }) => {
	// Will prevent the text from ever being too large for the alloted space
	const trimDesc = (desc) =>
		desc.length < 140 ?
			desc : desc.substring(0, 136) + "..."

	// TODO: Try to get the elements to fade in one-by-one
	return (
		<div className="grid">
			{projectsToRender.map((project, index) => (
				<Fade bottom distance={"50px"} key={index}>
					<Card
						heading={project.title}
						paragraph={trimDesc(project.desc)}
						imgUrl={project.imageSrc}
						projectLink={project.url}
					></Card>
				</Fade>
			))}
		</div>
  )
};

export default Projects;