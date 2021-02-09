// Skills Icons
import brushIcon from "./images/skills/brush.png"
import cssIcon from "./images/skills/css.svg"
import reactIcon from "./images/skills/react.svg"
import jsIcon from "./images/skills/javascript.svg"
//import designIcon from "./images/skills/design.svg"
import tattooIcon from "./images/skills/tattoo_gun.svg"
import codeIcon from "./images/skills/code.svg"

// Social Icon
import twitterIcon from "./images/social/twitter.png"
import linkedinIcon from "./images/social/linkedin.png"
import instagramIcon from "./images/social/instagram.svg"

// Artwork
import flower from "./images/artwork/flower_signed.jpg"
import fish from "./images/artwork/fish.jpg"
import face from "./images/artwork/face.jpg"
import card from "./images/artwork/card.jpg"
import deer from "./images/artwork/deer.jpg"
import bookmark from "./images/artwork/bookmark.jpg"

// About image
import aboutImage from "./images/presentationPic.jpg"

export default {
	// Header Details ---------------------
	name: "Kara Meese",
	headerTagline: [
		"Building digital",
		"products, brands,",
		"and experience",
	],
	headerParagraph:
		"If you want a unique style of work, you came to the right place.",
	contactEmail: "me@karameese.com",
	// End Header Details -----------------------

	// Work Section ------------------------
	projects: [
		{
			id: 1,
			title: "",
			desc:
				"",
			imageSrc: flower,
			url: flower,
		},
		{
			id: 2,
			title: "Coi Fish",
			desc:
				"In Japan, Koi fish are associated with perseverance in adversity and strength of purpose. They symbolize good luck and abundance.",
			imageSrc: fish,
			url: fish,
		},
		{
			id: 3,
			title: "Oni Mask",
			desc:
				"This piece was inspired by the traditional Japanese Oni mask, a symbol of protection for those who believe in the spiritual world.",
			imageSrc: face,
			url: face,
		},
		{
			id: 4,
			title: "",
			desc:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
			imageSrc: card,
			url: card,
		},
		{
			id: 5,
			title: "Deer",
			desc:
				"Deer are symbols of majesty and beauty and have roots in ancient history. Deer represent the embodiment of peace, grace, and gentleness.",
			imageSrc: deer,
			url: deer,
		},
		{
			id: 6,
			title: "",
			desc:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
			imageSrc: bookmark,
			url: bookmark,
		},

		/*
		If You Want To Add More Project just Copy and Paste This At The End (Update the id Respectively)
		,{
				id: 7,
				title: 'Project Five',
				desc: 'Something Amazing',
				imageSrc: "",
				url: ''
		}
		*/
	],
	// End Work Section -----------------------

	// About Secton --------------
	aboutParaOne:
		`I'm an artist, graphic designer, and a creative. In high school my artwork won 2nd in the state of North Carolina,
		and I've continued to hone my craft in the years since.`,
	aboutParaTwo:
		"",
	aboutParaThree:
		"",
	aboutImage: aboutImage,
	// End About Section ---------------------

	// Skills Section ---------------
	// Import Icons from the top and link it here
	skills: [
		{
			id: 1,
			img: brushIcon,
			desc: `
				I can design black and white or colored tattoos to fit your specifications, 
				with pricing based on the design's complexity.
				`,
		},
		{
			id: 2,
			img: cssIcon,
			desc: `
				I can design black and white or colored tattoos to fit your specifications, 
				with pricing based on the design's complexity.
				`,
		},
		{
			id: 3,
			img: jsIcon,
			desc: `
				I can design black and white or colored tattoos to fit your specifications, 
				with pricing based on the design's complexity.
				`,
		},
		{
			id: 4,
			img: reactIcon,
			desc: `
				I can design black and white or colored tattoos to fit your specifications, 
				with pricing based on the design's complexity.
				`,
		},
		{
			id: 5,
			img: tattooIcon,
			desc: `
				I can design black and white or colored tattoos to fit your specifications, 
				with pricing based on the design's complexity.
				`,
		},
		{
			id: 6,
			img: codeIcon,
			desc: `
				I can design black and white or colored tattoos to fit your specifications, 
				with pricing based on the design's complexity.
				`,
		},
	],
	// End Skills Section --------------------------

	//   Promotion Section --------------------------
	promotionHeading: "Heading",
	promotionPara:
		"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
	// End Promotion Section -----------------

	//   Contact Section --------------
	contactSubHeading: "Let's create your next experience together",
	social: [
		// NOTE: Link destinations can be updated on Rebrandly
		{
			img: twitterIcon,
			url: "https://link.karameese.com/twitter"
		},
		{
			img: linkedinIcon,
			url: "https://link.karameese.com/linkedin",
		},
		{
			img: instagramIcon,
			url: "https://link.karameese.com/instagram",
		},
	],
	// End Contact Section ---------------
}
