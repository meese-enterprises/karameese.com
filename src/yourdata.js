// Skills Icons
import htmlIcon from "./images/html.svg"
import cssIcon from "./images/css.svg"
import reactIcon from "./images/react.svg"
import jsIcon from "./images/javascript.svg"
import designIcon from "./images/design.svg"
import codeIcon from "./images/code.svg"

// Social Icon
import twitterIcon from "./images/twitter.png"
import linkedinIcon from "./images/linkedin.png"
import instagramIcon from "./images/instagram.svg"

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
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
  contactEmail: "me@karameese.com",
  // End Header Details -----------------------

  // Work Section ------------------------
  projects: [
    {
      id: 1,
      title: "",
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      imageSrc: flower,
      url: flower,
    },
    {
      id: 2,
      title: "",
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      imageSrc: fish,
      url: fish,
    },
    {
      id: 3,
      title: "Oni Mask",
      para:
        "This piece was inspired by the traditional Japanese Oni mask, a symbol of protection for those who believe in the spiritual world",
      imageSrc: face,
      url: face,
    },
    {
      id: 4,
      title: "",
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      imageSrc: card,
      url: card,
    },
    {
      id: 5,
      title: "",
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      imageSrc: deer,
      url: deer,
    },
    {
      id: 6,
      title: "",
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      imageSrc: bookmark,
      url: bookmark,
    },

    /*
    If You Want To Add More Project just Copy and Paste This At The End (Update the id Respectively)
    ,{
        id: 7,
        title: 'Project Five',
        para: 'Something Amazing',
        imageSrc: "",
        url: ''
    }
    */
  ],
  // End Work Section -----------------------

  // About Secton --------------
  aboutParaOne:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  aboutParaTwo:
    "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  aboutParaThree:
    "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  aboutImage: aboutImage,
  // End About Section ---------------------

  // Skills Section ---------------
  // Import Icons from the top and link it here
  skills: [
    {
      id: 1,
      img: htmlIcon,
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    },
    {
      id: 2,
      img: cssIcon,
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    },
    {
      id: 3,
      img: jsIcon,
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    },
    {
      id: 4,
      img: reactIcon,
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    },
    {
      id: 5,
      img: designIcon,
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    },
    {
      id: 6,
      img: codeIcon,
      para:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
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
