import React from "react"
import Fade from "react-reveal/Fade"
import data from "../yourdata"

const About = () => {
	return (
		<div className="secion" id="about">
			<div className="container">
				<div className="about-section">
					<div className="content">
						<Fade bottom cascade>
							<h1>About Me</h1>
						</Fade>
						<p>
							I'm an artist, graphic designer, and a creative. In high school my artwork won 2<sup>nd</sup> in the state of North Carolina,
							and I've continued to hone my craft in the years since. What makes my work unique compared to all the other
							talented artists you could hire is that I lack the ability to visualize. I have a rare condition known as 
							{" "}<a href="https://www.sciencefocus.com/the-human-body/aphantasia-life-with-no-minds-eye/">aphantasia</a>,
							which is the inability to recall images to my 'mind's eye.' That means your piece won't be completed in my mind before
							I begin work, there won't be a step-by-step breakdown of my process before I begin. I'll just start working and
							figure it out as I go, which is something you won't find anywhere else.
							<br></br>
							<br></br>
							Others often describe me as a polymath, due to my diverse array of interests and hobbies. Almost all of them
							link back to art and creativity, with my passion being the introduction of beauty into the world. Few things
							make me happier than capturing a moment in my camera lens that will never be repeated, because I enjoy sharing
							such things with others. The world has far too much hate and hurt, because people allow themselves to get caught
							up in the bad rather than seek out the beauty in seemingly ordinary moments. I seek to remind others that 
							giving into negativity is a choice, which you can change at any point in your life.
							<br></br>
							<br></br>
							I've experienced acute trauma in ways that most people will never understand or relate to, which is why I've chosen
							helping others as my career path. Artwork and creation is my hobby, but my true purpose in life is to ease the 
							suffering of others by making them feel heard and suggesting ways to begin their healing process. My areas of
							specialty are veterans and victims of sexual assault, and all conversations with clients are now and will
							forever remain confidential. I know what it's like to need someone to talk to, so don't be afraid to reach out
							if you feel the need.
						</p>
					</div>
					<div className="image-wrapper">
						<img src={data.aboutImage} alt="about"></img>
					</div>
				</div>
			</div>
		</div>
	)
}

export default About
