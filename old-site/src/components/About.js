import React from "react";
import Fade from "react-reveal/Fade";
import data from "../yourdata";

const About = () => {
	return (
		<div className="secion" id="about">
			<div className="container">
				<div className="about-section">
					<Fade bottom cascade>
						<h2>about</h2>
					</Fade>
					<Fade bottom>
						<p id="summary">{data.summary}</p>
					</Fade>
					<hr />
					
					<p id="description">{data.description}</p>
				</div>
			</div>
		</div>
	)
}

export default About;
