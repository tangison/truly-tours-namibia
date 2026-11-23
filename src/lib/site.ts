export interface Tour {
  id: string;
  days: number;
  title: string;
  short: string;
  img: string;
  intro: string;
  itinerary: string;
  included: string;
}

export interface Activity {
  id: string;
  hours: string;
  title: string;
  text: string;
  price: string;
  img: string;
}

export interface Testimonial {
  quote: string;
  name: string;
}

export const TOURS: Tour[] = [
  {
    id: "ten-days-classic",
    days: 10,
    title: "Windhoek, Sossusvlei, Swakopmund, Spitzkoppe and Etosha",
    short: "The classic Namibia loop",
    img: "/images/windhoek-city.webp",
    intro:
      "Ten days on the classic Namibia loop: the dunes at Sossusvlei, the Atlantic in Swakopmund and three days of game drives in Etosha. The route links the country's best-known landscapes with the wildlife that lives in them.",
    itinerary:
      "Day 1: Windhoek. Day 2: Sossusvlei. Day 3: Sossusvlei. Day 4: Swakopmund. Day 5: Swakopmund, Spitzkoppe. Day 6: Twyfelfontein. Day 7: Etosha National Park. Day 8: Etosha National Park. Day 9: Etosha National Park. Day 10: Windhoek.",
    included:
      "Included in the tour package: Park entry fees, transport, accommodation, shuttle transfers to and from the airport, meals (breakfast and dinner at accommodation establishments).",
  },
  {
    id: "ten-days-brandberg",
    days: 10,
    title: "Sossusvlei, Swakopmund, Brandberg, Twyfelfontein and Etosha",
    short: "Damaraland and rock art",
    img: "/images/sossusvlei.webp",
    intro:
      "This tour takes in Sossusvlei and Swakopmund, then heads north past the Brandberg Mountain and the rock engravings of Twyfelfontein to the plains of Etosha National Park.",
    itinerary:
      "Day 1: Windhoek. Day 2: Sossusvlei. Day 3: Sossusvlei. Day 4: Swakopmund. Day 5: Brandberg Mountain. Day 6: Twyfelfontein. Day 7: Etosha National Park. Day 8: Etosha National Park. Day 9: Etosha National Park. Day 10: Windhoek.",
    included:
      "Included in the tour package: Park entry fees, transport, accommodation, shuttle transfers to and from the airport, meals (breakfast and dinner at accommodation establishments).",
  },
  {
    id: "thirteen-days-south",
    days: 13,
    title:
      "Kalahari, Fish River Canyon, Lüderitz, Sossusvlei, Swakopmund, Brandberg and Etosha",
    short: "The grand southern loop",
    img: "/images/kalahari.webp",
    intro:
      "Thirteen days covering the whole south of Namibia: red Kalahari dunes, the rim of the Fish River Canyon, the ghost town of Kolmanskop, the great dunes of Sossusvlei and the waterholes of Etosha.",
    itinerary:
      "Day 1: Windhoek. Day 2: Kalahari. Day 3: Fish River Canyon. Day 4: Fish River Canyon. Day 5: Lüderitz. Day 6: Sossusvlei. Day 7: Sossusvlei. Day 8: Swakopmund. Day 9: Swakopmund. Day 10: Brandberg Mountain. Day 11: Etosha National Park. Day 12: Etosha National Park. Day 13: Windhoek.",
    included:
      "Included in the tour package: Park entry fees, transport, accommodation, shuttle transfers to and from the airport, meals (breakfast and dinner at accommodation establishments).",
  },
  {
    id: "twelve-days-north",
    days: 12,
    title: "Swakopmund, Damaraland, Owamboland and Etosha",
    short: "Tour to the north",
    img: "/images/swakopmund.webp",
    intro:
      "This 12-day tour combines your travel experiences to Swakopmund with other iconic destinations in the north of Namibia.",
    itinerary:
      "Day 1: Windhoek. Day 2: Swakopmund. Day 3: Swakopmund. Day 4: Damaraland. Day 5: Damaraland. Day 6: Owamboland. Day 7: Owamboland. Day 8: Etosha National Park. Day 9: Etosha National Park. Day 10: Etosha National Park. Day 11: Etosha National Park. Day 12: Windhoek.",
    included:
      "Included in the tour package: Park entry fees, transport, accommodation, shuttle transfers to and from the airport, meals (breakfast and dinner at accommodation establishments).",
  },
  {
    id: "three-days-sossusvlei",
    days: 3,
    title: "Sossusvlei and Swakopmund",
    short: "Dunes to the coast",
    img: "/images/s2.webp",
    intro:
      "This 3-day adventure takes you from the dunes of Sossusvlei to the coastal charm of Swakopmund.",
    itinerary:
      "Day 1: Windhoek, Sossusvlei. Day 2: Sossusvlei, Swakopmund. Day 3: Swakopmund, Windhoek.",
    included:
      "Included in the tour package: Park entry fees, transport, accommodation, meals (breakfast and dinner at accommodation establishments).",
  },
  {
    id: "three-days-etosha",
    days: 3,
    title: "Etosha National Park and Waterberg",
    short: "Wildlife and plateau",
    img: "/images/untitled.webp",
    intro:
      "This tour takes you on a wildlife adventure in Etosha National Park, followed by a relaxing stay at the Waterberg Plateau.",
    itinerary:
      "Day 1: Windhoek, Etosha National Park. Day 2: Etosha National Park. Day 3: Waterberg Plateau, Windhoek.",
    included:
      "Included in the tour package: Park entry fees, transport, accommodation, meals (breakfast and dinner at accommodation establishments).",
  },
];

export const ACTIVITIES: Activity[] = [
  {
    id: "city-township",
    hours: "2–3 hours",
    title: "City/Township Tour: discover Windhoek",
    text: "A guided walk and drive through Windhoek, the vibrant capital of Namibia: National monuments, rich colonial and post-colonial history, and the township of Katutura.",
    price: "N$750 per person",
    img: "/images/k.webp",
  },
  {
    id: "bushmen-walk",
    hours: "3 hours",
    title: "The Bushmen Walk: step into ancient wisdom",
    text: "A cultural visit to the Bushmen Survival Trust, 22 km from Windhoek, where the last first-people of Southern Africa share their surviving skills, culture and rich heritage.",
    price: "",
    img: "/images/bushman.webp",
  },
  {
    id: "game-drive",
    hours: "3–4 hours",
    title: "Game Drive just outside Windhoek",
    text: "Escape the city on a guided game drive 30 km from Windhoek at one of our trusted partner reserves, and spot wildlife on a private game farm.",
    price: "",
    img: "/images/drive.webp",
  },
  {
    id: "cooking-class",
    hours: "2–3 hours",
    title: "Taste Namibia: traditional cooking class",
    text: "A hands-on traditional food cooking class: learn to prepare a variety of authentic local dishes, with a special focus on Mahangu pap making.",
    price: "",
    img: "/images/namibian-food.webp",
  },
  {
    id: "bar-hopping",
    hours: "Evening",
    title: "Bar Hopping: Windhoek by night",
    text: "A taste of Namibia's nightlife with our guided bar hopping experience through Windhoek's bars and shebeens.",
    price: "",
    img: "/images/whk.webp",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "This experience with Truly Tours Namibia was absolutely fantastic! Our guide was extremely knowledgeable about the country, its wildlife, history, and people.",
    name: "Primo Morris",
  },
  {
    quote:
      "I highly recommend a tour of Windhoek and its surroundings to gain insight into the rich indigenous cultures and colonial heritage that only a local can truly impart.",
    name: "Greg",
  },
];

export const CONTACT = {
  phone: "+264 81 464 2798 / +264 81 258 2241",
  email: "info@trulytoursnamibia.com",
  city: "Windhoek, Namibia",
  hours: "7:30 to 17:00, Monday to Friday",
  instagram: "https://www.instagram.com/truly_tours_namibia",
};

export const GALLERY = [
  { img: "/images/zebra.webp", alt: "Zebras grazing on golden grassland" },
  { img: "/images/elephant.webp", alt: "Elephants walking across dry savanna" },
  { img: "/images/rhino.webp", alt: "A rhino standing in Etosha scrubland" },
  { img: "/images/springbok.webp", alt: "Springbok antelope on open plain" },
  { img: "/images/desert.webp", alt: "Red dunes of the Namib desert under blue sky" },
  { img: "/images/sossusvlei.webp", alt: "Dead trees in the white clay pan of Sossusvlei" },
  { img: "/images/z2.webp", alt: "Dune ridge at sunrise in the Namib" },
  { img: "/images/etosha.webp", alt: "Waterhole in Etosha National Park with game" },
  { img: "/images/city.webp", alt: "Windhoek's city skyline between hills" },
  { img: "/images/bushnan-nam.webp", alt: "Kalahari landscape with camelthorn trees" },
  {
    img: "/images/whatsapp-image-2025-08-26-at-19.53.36.webp",
    alt: "Guests on a Truly Tours game drive",
  },
  {
    img: "/images/whatsapp-image-2025-08-26-at-19.52.44.webp",
    alt: "Guests on a Truly Tours trip in Namibia",
  },
];

/* Destination photographs sourced from free-licence libraries (Pexels, Unsplash,
   Britannica) for tour stops the client has not yet photographed. One credits
   line in the footer names them (taste-skill: credits for non-client photos). */
export const SOURCED = {
  canyon: "/images/fish-river-canyon.webp",
  kolmanskop: "/images/kolmanskop.webp",
  aerial: "/images/dunes-aerial.webp",
};
