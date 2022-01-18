import React from "react"
import Fade from "react-reveal/Fade"
import data from "../yourdata"

const Skills = () => {
	// TODO: Change this from mouseLeave to only when another image is selected
	function selectSkill(e, desc) {
		e.currentTarget.className = "skill selected"

		// Replace the new line characters from `yourdata` with spaces
		document.getElementById("skill-description").innerText = desc.replace(
			/\n/g,
			" "
		)
	}
	function deselectSkill(e) {
		e.currentTarget.className = "skill"
	}

	return (
		<div className="section">
			<div className="container">
				<div className="skills-container">
					<h1>skills</h1>
					<hr />

					<div className="skills-grid">
						{data.skills.map((skill, index) => (
							// TODO: Reduce the opacity of non-selected elements
							<Fade bottom distance="50px" key={index}>
								<div
									className="skill"
									onMouseEnter={e => selectSkill(e, skill.desc)}
									onMouseLeave={deselectSkill}
									aria-hidden="true"
								>
									<img src={skill.img} alt={skill.name} />
								</div>
							</Fade>
						))}
					</div>

					<p id="skill-description" />
				</div>
			</div>
		</div>
	)
}

export default Skills
