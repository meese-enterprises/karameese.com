import React, { useState, useEffect } from "react";
import Fade from "react-reveal/Fade";
import data from "../yourdata";

import Projects from "./atoms/Projects";
const projectsPerPage = 6;
let visibleProjects = [];
let showLoadMoreButton = true;

const Work = () => {
	// https://dev.to/debosthefirst/how-to-create-a-load-more-button-in-react-1lab
	const [projectsToShow, setProjectsToShow] = useState([]);
	const [next, setNext] = useState(projectsPerPage);

	const loopWithSlice = (start, end) => {
		// If out of projects to display
		if (end >= data.projects.length) {
			end = data.projects.length;
			showLoadMoreButton = false;
			// TODO: Try to move this condition to directly in the button,
			// to prevent flash on re-render
		}

		const slicedProjects = data.projects.slice(start, end);
		visibleProjects = [...visibleProjects, ...slicedProjects];
		setProjectsToShow(visibleProjects);
	}

	useEffect(() => {
		loopWithSlice(0, projectsPerPage);
	}, [])

	const handleShowMoreProjects = () => {
		loopWithSlice(next, next + projectsPerPage);
		setNext(next + projectsPerPage);
	}

	return (
		<div className="section" id="work">
			<div className="container">
				<div className="work-wrapper">
					<Fade bottom>
						<h1>Work</h1>
					</Fade>

					<Projects projectsToRender={projectsToShow} />
					<button
						className="primary-btn"
						onClick={handleShowMoreProjects}
						style={{ display: showLoadMoreButton ? 'block' : 'none' }}
					>
						Load more
					</button>
				</div>
			</div>
		</div>
	)
}

export default Work;