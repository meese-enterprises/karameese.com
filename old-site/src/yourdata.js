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

// TODO: Look into something like this for dymanic image imports,
// or write my own lib if it doesn't work: https://javascript.info/modules-dynamic-imports
// https://www.npmjs.com/package/babel-plugin-dynamic-import-node-babel-7

// TODO: Find a way to make this dynamic
// Artwork
// --- Thumbnails ---
import bee_thumbnail from "../static/thumbnails/bee.jpg"
import skull_thumbnail from "../static/thumbnails/skull.jpg"
import flower_thumbnail from "../static/thumbnails/flower.jpg"
import fish_thumbnail from "../static/thumbnails/fish.jpg"
import mask_thumbnail from "../static/thumbnails/mask.jpg"
import card_thumbnail from "../static/thumbnails/card.jpg"
import demon_thumbnail from "../static/thumbnails/demon.jpg"
import leaf_thumbnail from "../static/thumbnails/leaf.jpg"
// --- Full Images ---
import bee_full from "../static/watermarked/bee.jpg"
import skull_full from "../static/watermarked/skull.jpg"
import flower_full from "../static/watermarked/flower.jpg"
import fish_full from "../static/watermarked/fish.jpg"
import mask_full from "../static/watermarked/mask.jpg"
import card_full from "../static/watermarked/card.jpg"
import demon_full from "../static/watermarked/demon.jpg"
import leaf_full from "../static/watermarked/leaf.jpg"

export default {
	// Header Details ---------------------
	name: "Kara Meese",
	headerTagline: ["Building digital", "products, brands,", "and experience"],
	headerParagraph:
		"If you want a unique style of work, you came to the right place.",
	contactEmail: "me@karameese.com",
	// End Header Details -----------------------

	// About Section ---------------
	summary: "dreamer, artist, graphic designer.",
	description: `
		Kara is a North Carolina bred, digitally based artist. An expert of honing 
		her craft along with discovering new methods to express her internal 
		monologue. Heavily inspired by mythology, the occult, and neo-traditional 
		tattooing styles her work is best described as alternative and intriguing. 
		Her passions include advocating for sexual abuse survivors, finding beauty 
		in negative spaces, and finding new things to worry over. Her story doesn’t 
		start with a once upon a time but she has been steadily working toward her 
		happily ever after by being a self-made first generation college student, 
		U.S. Army veteran, artist, and most recently web developer.
		`,
	// End About Section ---------------

	// Skills Section ---------------
	// Import icons from the top and link them here
	skills: [
		{
			name: "Artwork",
			img: brushIcon,
			desc: `
				Skilled with pencil, pen, watercolor, oil painting, and almost anything else your heart
				could desire. Reach out with the details and we can rap about it.
				`,
		},
		{
			name: "Digital Design",
			img: adobeIcon,
			desc: `
				Experienced in application design and prototyping with Adobe XD. Extensive
				experience communicating with developers to turn their creative vision into reality.
				`,
		},
		{
			name: "Photography",
			img: cameraIcon,
			desc: `
				I've practiced semi-professional photography for a number of years, and I'm usually available
				for bookings a few times a month. I specialize in landscapes and people.
				`,
		},
		{
			name: "Therapy",
			img: therapyIcon,
			desc: `
				Great at listening to life's problems, providing validation, and offering solutions if and
				when they are welcome. Contact me to schedule an appointment.
				`,
		},
		{
			name: "Tattoos",
			img: tattooIcon,
			desc: `
				Black and white or colored tattoos designed to fit your specifications, with pricing based 
				on the design's complexity. Reach out with your ideas so we can figure something out.
				`,
		},
		{
			name: "Poetry",
			img: poetryIcon,
			desc: `
				Poetry specializing in powerful emotions, ranging from love and romance to sadness and pain.
				Contact me to see my previous works or to discuss your particular request.
				`,
		},
	],
	// End Skills Section --------------------------

	// Work Section ------------------------
	projects: [
		{
			title: "Bee",
			desc: "The bee symbolizes community, brightness and personal power. Follow the bee to discover your new destination.",
			thumbUrl: bee_thumbnail,
			fullUrl: bee_full,
		},
		{
			title: "Skull",
			desc: "Skulls are a representation of death, mortality and the unachievable nature of immortality.",
			thumbUrl: skull_thumbnail,
			fullUrl: skull_full,
		},
		{
			title: "Peony",
			desc: "Peonies symbolize bashfulness, wealth, bravery, honor, and good fortune in different cultures around the world.",
			thumbUrl: flower_thumbnail,
			fullUrl: flower_full,
		},
		{
			title: "Koi Fish",
			desc: "In Japan, Koi fish are associated with perseverance in adversity and strength of purpose. They symbolize good luck and abundance.",
			thumbUrl: fish_thumbnail,
			fullUrl: fish_full,
		},
		{
			title: "Oni Mask",
			desc: "This piece was inspired by the traditional Japanese Oni mask, a symbol of protection for those who believe in the spiritual world.",
			thumbUrl: mask_thumbnail,
			fullUrl: mask_full,
		},
		{
			title: "Bust of Venus",
			desc: "In Roman mythology, Venus was the goddess of love, sex, beauty, and fertility, and she had many abilities beyond the Greek Aphrodite.",
			thumbUrl: card_thumbnail,
			fullUrl: card_full,
		},
		{
			title: "Demon",
			desc: "A demon is a supernatural being, typically associated with evil, prevalent historically in religion, occultism, literature, fiction, mythology, and folklore.",
			thumbUrl: demon_thumbnail,
			fullUrl: demon_full,
		},
		{
			title: "Leaf",
			desc: "Green leaves depict hope, renewal, and revival. Leaves are symbolic of fertility and growth, and in Chinese tradition represent all the beings of the universe.",
			thumbUrl: leaf_thumbnail,
			fullUrl: leaf_full,
		},
	],
	// End Work Section -----------------------

	//   Contact Section --------------
	contactSubHeading: "let's create your next experience together.",
	social: [
		// NOTE: Link destinations can be updated on Rebrandly
		{
			img: twitterIcon,
			url: "https://link.karameese.com/twitter",
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
