import React from "react";
import Fade from "react-reveal/Fade";
import data from "../yourdata";

const Skills = () => {
	return (
		<div className="section">
			<div className="container">
				<div className="skills-container">
					<h1>Skills</h1>
					<div className="skills-grid">
						{data.skills.map((skill, index) => (
							<Fade bottom distance={"50px"} key={index}>
								<div className="skill">
									<img src={skill.img} alt="css"></img>
									<p>{skill.desc}</p>
								</div>
							</Fade>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Skills;
