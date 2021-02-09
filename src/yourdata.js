// Skills Icons
import brushIcon from "./images/skills/brush.png"
import adobeIcon from "./images/skills/xd.png"
import cameraIcon from "./images/skills/camera.png"
import therapyIcon from "./images/skills/therapy.png"
import tattooIcon from "./images/skills/tattoo_gun.svg"
import poetryIcon from "./images/skills/poetry.svg"

// Social Icon
import twitterIcon from "./images/social/twitter.png"
import linkedinIcon from "./images/social/linkedin.png"
import instagramIcon from "./images/social/instagram.svg"

// Artwork
import bee from "./images/artwork/bee.jpg"
import skull from "./images/artwork/skull.jpg"
import flower from "./images/artwork/flower.jpg"
import fish from "./images/artwork/fish.jpg"
import mask from "./images/artwork/mask.jpg"
import card from "./images/artwork/card.jpg"
import demon from "./images/artwork/demon.jpg"
import leaf from "./images/artwork/leaf.jpg"

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
			title: "Bee",
			desc:
				"The bee symbolizes community, brightness and personal power. Follow the bee to discover your new destination.",
			imageSrc: bee,
			url: bee,
		},
		{
			title: "Skull",
			desc:
				"Peonies symbolize bashfulness, wealth, bravery, honor, and good fortune in different cultures around the world.",
			imageSrc: skull,
			url: skull,
		},
		{
			title: "Peony",
			desc:
				"Peonies symbolize bashfulness, wealth, bravery, honor, and good fortune in different cultures around the world.",
			imageSrc: flower,
			url: flower,
		},
		{
			title: "Coi Fish",
			desc:
				"In Japan, Koi fish are associated with perseverance in adversity and strength of purpose. They symbolize good luck and abundance.",
			imageSrc: fish,
			url: fish,
		},
		{
			title: "Oni Mask",
			desc:
				"This piece was inspired by the traditional Japanese Oni mask, a symbol of protection for those who believe in the spiritual world.",
			imageSrc: mask,
			url: mask,
		},
		{
			title: "Bust of Venus",
			desc:
				"In Roman mythology, Venus was the goddess of love, sex, beauty, and fertility, and she had many abilities beyond the Greek Aphrodite.",
			imageSrc: card,
			url: card,
		},
		{
			title: "Demon",
			desc:
				"A demon is a supernatural being, typically associated with evil, prevalent historically in religion, occultism, literature, fiction, mythology, and folklore.",
			imageSrc: demon,
			url: demon,
		},
		{
			title: "Leaf",
			desc:
				"Green leaves depict hope, renewal, and revival. Leaves are symbolic of fertility and growth, and in Chinese tradition represent all the beings of the universe.",
			imageSrc: leaf,
			url: leaf,
		},
	],
	// End Work Section -----------------------

	// About Secton --------------
	aboutImage: aboutImage,
	// End About Section ---------------------

	// Skills Section ---------------
	// Import Icons from the top and link it here
	skills: [
		{
			id: 1,
			img: brushIcon,
			desc: `
				Skilled with pencil, pen, watercolor, oil painting, and almost anything else your heart
				could desire. Reach out with the details and we can rap about it.
				`,
		},
		{
			id: 2,
			img: adobeIcon,
			desc: `
				Experienced in application design and prototyping with Adobe XD. Extensive
				experience communicating with developers to turn their creative vision into reality.
				`,
		},
		{
			id: 3,
			img: cameraIcon,
			desc: `
				I've practiced semi-professional photography for a number of years, and I'm usually available
				for bookings a few times a month. I specialize in landscapes and people.
				`,
		},
		{
			id: 4,
			img: therapyIcon,
			desc: `
				Great at listening to life's problems, providing validation, and offering solutions if and
				when they are welcome. Contact me to schedule an appointment.
				`,
		},
		{
			id: 5,
			img: tattooIcon,
			desc: `
				Black and white or colored tattoos designed to fit your specifications, with pricing based 
				on the design's complexity. Reach out with your ideas so we can figure something out.
				`,
		},
		{
			id: 6,
			img: poetryIcon,
			desc: `
				Poetry specializing in powerful emotions, ranging from love to sadness and pain.
				Contact me to see my previous works or to discuss your particular request.
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
