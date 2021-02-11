import React from "react"
import scrollTo from "gatsby-plugin-smoothscroll"
const Navbar = () => {
	// TODO: Add a mobile nav with a style of Kara's choosing
	return (
		<div className="section">
			<div className="container">
				<div className="navbar-wrapper">
					<div
						role="button"
						onClick={() => scrollTo("#home")}
						onKeyDown={() => scrollTo("#home")}
						className="name"
						tabIndex={0}
					>
						Welcome to my Portfolio.
					</div>
					<div className="links-wrapper">
						<button onClick={() => scrollTo("#work")}>Work</button>
						<button onClick={() => scrollTo("#about")}>About</button>
						<button onClick={() => scrollTo("#contact")}>Contact</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Navbar
