import React from "react"
import Fade from "react-reveal/Fade"
import data from "../yourdata"

const Header = () => {
	return (
		<div className="section" id="home">
			<div className="container">
				<div className="header-wrapper">
					<Fade bottom>
						<p>Hello! I am</p>
						{/* NOTE: Need to come back and use actual lines here, not characters */}
						<h1>― {data.name} ―</h1>
					</Fade>
				</div>
			</div>
		</div>
	)
}

export default Header
