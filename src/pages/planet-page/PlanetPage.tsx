/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./PlanetPage.module.css";
import {
  ATMOSPHERE_OPTIONS,
  GUEST_SIZE_OPTIONS,
  PLANET_ARCHETYPE_OPTIONS,
  type EditableSearchState,
  type SearchState,
} from "../../types/search";

type FilterChip = {
  label: string;
  value: string;
};

type Phase = "idle" | "opening" | "open" | "closing";

type CardRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type PlanetCard = {
  id: number;
  name: string;
  hoverName: string;
  compatibility: string;
  distance: string;
  price: string;
  description: string;
  facts: string[];
  image: string;
};

type PlanetSpec = {
  gravityValue: number;
  gravityLabel: string;
  temperatureValue: number;
  temperatureLabel: string;
  atmosphere: string;
  archetype: string;
};

type RankedPlanet = PlanetCard & {
  compatibilityPercent: number;
};

const preventWheelNumberChange = (event: React.WheelEvent<HTMLInputElement>) => {
  event.currentTarget.blur();
};


const planetCards: PlanetCard[] = [
  {
    id: 1,
    name: "Mars",
    hoverName: "Planet Mars",
    compatibility: "65%",
    distance: "78 million km",
    price: "$1,255 / night",
    description:
      "A bold frontier stay with red dunes, glowing horizons, and panoramic crater views for adventurous travellers.",
    facts: [
      "Stay type: Elevated dome suite",
      "Gravity: 3.71 m/s^2",
      "Climate: Cold desert",
      "Best for: Scenic exploration",
    ],
    image: `${import.meta.env.BASE_URL}mars.jpeg`,
  },
  {
    id: 2,
    name: "Nebula",
    hoverName: "Planet Nebula",
    compatibility: "48%",
    distance: "980 million km",
    price: "$8,950 / night",
    description:
      "A surreal ringed world with a luminous central void, perfect for travellers who want something dreamlike and impossible.",
    facts: [
      "Stay type: Horizon observatory",
      "Gravity: 7.94 m/s^2",
      "Climate: Ion-lit upper skies",
      "Best for: Surreal cosmic escapes",
    ],
    image: `${import.meta.env.BASE_URL}donut.jpg`,
  },
  {
    id: 3,
    name: "Saturn",
    hoverName: "Planet Saturn",
    compatibility: "58%",
    distance: "1.2 billion km",
    price: "$6,480 / night",
    description:
      "A sweeping ring-view destination with golden light, deep-space silence, and a front-row seat to the solar system's grandest skyline.",
    facts: [
      "Stay type: Ringline capsule suite",
      "Gravity: 10.44 m/s^2",
      "Climate: Upper-atmosphere chill",
      "Best for: Cinematic orbit stays",
    ],
    image: `${import.meta.env.BASE_URL}saturn.jpg`,
  },
  {
    id: 4,
    name: "Venus",
    hoverName: "Planet Venus",
    compatibility: "52%",
    distance: "261 million km",
    price: "$4,760 / night",
    description:
      "A radiant amber-world retreat with blazing horizons and warm celestial glow, designed for stylish short-haul cosmic getaways.",
    facts: [
      "Stay type: Cloudline residence",
      "Gravity: 8.87 m/s^2",
      "Climate: Superheated acid-cloud atmosphere",
      "Best for: Luxury heat-lit views",
    ],
    image: `${import.meta.env.BASE_URL}vveus.jpg`,
  },
  {
    id: 5,
    name: "Kepler-452b",
    hoverName: "Planet Kepler-452b",
    compatibility: "88%",
    distance: "1,400 ly",
    price: "$9,480 / night",
    description:
      "A sunlit Earth-like super-planet with wide desert seas and bright cloud banks, built for travellers chasing a future-home feeling.",
    facts: [
      "Stay type: Terraced observatory resort",
      "Gravity: 19.60 m/s^2",
      "Climate: Warm dry highlands",
      "Best for: Earth-like frontier escapes",
    ],
    image: `${import.meta.env.BASE_URL}kepler452b.png`,
  },
  {
    id: 6,
    name: "Io",
    hoverName: "Planet Io",
    compatibility: "29%",
    distance: "628 million km",
    price: "$3,640 / night",
    description:
      "A volatile lava-scarred moon with dramatic sulfur plains and constant geological motion for thrill-seeking sightseers.",
    facts: [
      "Stay type: Shielded crater lodge",
      "Gravity: 1.80 m/s^2",
      "Climate: Volcanic extremes",
      "Best for: Extreme geology tours",
    ],
    image: `${import.meta.env.BASE_URL}io.jpg`,
  },
  {
    id: 7,
    name: "Sun",
    hoverName: "Planet Sun",
    compatibility: "61%",
    distance: "82 million km",
    price: "$5,210 / night",
    description:
      "A red frontier world with frosted caps and canyon basins, offering cinematic dawns and crater-edge retreats.",
    facts: [
      "Stay type: Magnetically shielded corona skiff",
      "Gravity: 274.00 m/s^2",
      "Climate: Blazing plasma storms",
      "Best for: Extreme star-skimming spectacle",
    ],
    image: `${import.meta.env.BASE_URL}sun.jpg`,
  },
  {
    id: 8,
    name: "Cryon",
    hoverName: "Planet Cryon",
    compatibility: "37%",
    distance: "5.9 billion km",
    price: "$4,180 / night",
    description:
      "An ice-burnished dwarf world with marbled terrain and surreal frozen textures, ideal for quiet distant stays.",
    facts: [
      "Stay type: Polar glass habitat",
      "Gravity: 0.78 m/s^2",
      "Climate: Deep freeze",
      "Best for: Remote reflective travel",
    ],
    image: `${import.meta.env.BASE_URL}pluto-alt.png`,
  },
  {
    id: 9,
    name: "Gaia Prime",
    hoverName: "Planet Gaia Prime",
    compatibility: "84%",
    distance: "390 ly",
    price: "$8,120 / night",
    description:
      "A lush green-brown world with familiar continental tones and a calm habitable atmosphere suited to restorative travel.",
    facts: [
      "Stay type: Forest canopy retreat",
      "Gravity: 9.52 m/s^2",
      "Climate: Temperate mixed biomes",
      "Best for: Earth-like comfort seekers",
    ],
    image: `${import.meta.env.BASE_URL}gaia-prime.jpg`,
  },
  {
    id: 10,
    name: "Jupiter Deep",
    hoverName: "Planet Jupiter Deep",
    compatibility: "18%",
    distance: "628 million km",
    price: "$11,200 / night",
    description:
      "A storm-lashed giant of deep cobalt and bronze currents, experienced from a floating orbital ring above colossal cloud bands.",
    facts: [
      "Stay type: High-orbit panorama deck",
      "Gravity: 24.79 m/s^2",
      "Climate: Violent upper-atmosphere storms",
      "Best for: Grand-scale celestial viewing",
    ],
    image: `${import.meta.env.BASE_URL}jupiter-deep.png`,
  },
  {
    id: 11,
    name: "Trappist-1e",
    hoverName: "Planet Trappist-1e",
    compatibility: "79%",
    distance: "40 ly",
    price: "$7,860 / night",
    description:
      "A dim-star sanctuary with mineral deserts and glacial coasts, offering one of the most intriguing potentially habitable experiences nearby.",
    facts: [
      "Stay type: Twilight basin villas",
      "Gravity: 9.12 m/s^2",
      "Climate: Cool twilight zones",
      "Best for: Exoplanet discovery stays",
    ],
    image: `${import.meta.env.BASE_URL}trappist.jpg`,
  },
  {
    id: 12,
    name: "Uranus",
    hoverName: "Planet Uranus",
    compatibility: "33%",
    distance: "2.9 billion km",
    price: "$6,050 / night",
    description:
      "A serene cyan ice giant with soft swirling bands and an elegant glow, best enjoyed from a minimalist orbital suite.",
    facts: [
      "Stay type: Ice-ring observation pod",
      "Gravity: 8.69 m/s^2",
      "Climate: Frozen upper atmosphere",
      "Best for: Calm deep-space panoramas",
    ],
    image: `${import.meta.env.BASE_URL}uranus.png`,
  },
  {
    id: 13,
    name: "51 Pegasi b",
    hoverName: "Planet 51 Pegasi b",
    compatibility: "41%",
    distance: "50.9 ly",
    price: "$8,340 / night",
    description:
      "A legendary hot-jupiter destination with a glowing dusk face and fractured cloud belts, made for travellers chasing famous firsts in exoplanet history.",
    facts: [
      "Stay type: Magnetosphere-view orbital suite",
      "Gravity: 7.08 m/s^2",
      "Climate: Superheated gas giant atmosphere",
      "Best for: Prestige deep-space voyages",
    ],
    image: `${import.meta.env.BASE_URL}51-pegasi-b.png`,
  },
  {
    id: 14,
    name: "Coruscant",
    hoverName: "Planet Coruscant",
    compatibility: "72%",
    distance: "4,800 ly",
    price: "$9,120 / night",
    description:
      "A city-covered world of endless skylines, night-glow traffic, and elevated luxury districts for travellers who want cosmopolitan energy at planetary scale.",
    facts: [
      "Stay type: Skyline senate penthouse",
      "Gravity: 9.81 m/s^2",
      "Climate: Temperate urban atmosphere",
      "Best for: Futuristic city escapes",
    ],
    image: `${import.meta.env.BASE_URL}coruscant.png`,
  },
  {
    id: 15,
    name: "Cybertron",
    hoverName: "Planet Cybertron",
    compatibility: "46%",
    distance: "6,200 ly",
    price: "$10,860 / night",
    description:
      "A colossal machine-world with illuminated circuitry, metallic continents, and a dramatic industrial glow that feels engineered rather than born.",
    facts: [
      "Stay type: Alloy citadel chamber",
      "Gravity: 10.99 m/s^2",
      "Climate: Mechanical techno-atmosphere",
      "Best for: Sci-fi megastructure lovers",
    ],
    image: `${import.meta.env.BASE_URL}cybertron.png`,
  },
  {
    id: 16,
    name: "Neptune",
    hoverName: "Planet Neptune",
    compatibility: "54%",
    distance: "780 ly",
    price: "$5,280 / night",
    description:
      "An ice-locked world of pale cloud veils and frozen continents, offering serene blue-white horizons and a hushed polar grandeur.",
    facts: [
      "Stay type: Glacial observatory lodge",
      "Gravity: 11.15 m/s^2",
      "Climate: Permanent cryosphere",
      "Best for: Quiet arctic-style retreats",
    ],
    image: `${import.meta.env.BASE_URL}neptune.jpg`,
  },
  {
    id: 17,
    name: "Hoth",
    hoverName: "Planet Hoth",
    compatibility: "31%",
    distance: "3,100 ly",
    price: "$4,390 / night",
    description:
      "A stark snowbound frontier with blizzard plains and brilliant reflective ice fields, suited to hardy explorers who love remote extremes.",
    facts: [
      "Stay type: Shielded tundra outpost",
      "Gravity: 8.44 m/s^2",
      "Climate: Subzero ice storms",
      "Best for: Extreme cold expeditions",
    ],
    image: `${import.meta.env.BASE_URL}hoth.png`,
  },
  {
    id: 18,
    name: "Mercury",
    hoverName: "Planet Mercury",
    compatibility: "22%",
    distance: "77 million km",
    price: "$3,980 / night",
    description:
      "A cratered mineral world shimmering in blue-gold relief, where sunrise is dramatic, fast, and intensely beautiful from protected twilight habitats.",
    facts: [
      "Stay type: Terminator-line bunker suite",
      "Gravity: 3.70 m/s^2",
      "Climate: Extreme heat and cold swings",
      "Best for: Solar-edge spectacle stays",
    ],
    image: `${import.meta.env.BASE_URL}mercury.png`,
  },
  {
    id: 19,
    name: "Mustafar",
    hoverName: "Planet Mustafar",
    compatibility: "19%",
    distance: "1,920 ly",
    price: "$6,940 / night",
    description:
      "A molten volcanic realm of crimson fissures and lava-lit nights, unforgettable from fortified cliffside dwellings above the fire seas.",
    facts: [
      "Stay type: Basalt ridge fortress",
      "Gravity: 9.42 m/s^2",
      "Climate: Volcanic inferno",
      "Best for: Dramatic fireworld scenery",
    ],
    image: `${import.meta.env.BASE_URL}mustafar.png`,
  },
  {
    id: 20,
    name: "Marris V",
    hoverName: "Planet Marris V",
    compatibility: "67%",
    distance: "640 ly",
    price: "$7,280 / night",
    description:
      "A deep oceanic blue world wrapped in bright cyclones and endless seas, ideal for tranquil floating resorts and panoramic horizon views.",
    facts: [
      "Stay type: Ocean-skimming halo resort",
      "Gravity: 10.20 m/s^2",
      "Climate: Deep-ocean cyclone belts",
      "Best for: Luxury waterworld getaways",
    ],
    image: `${import.meta.env.BASE_URL}poseidon.png`,
  },
  {
    id: 21,
    name: "Tatooine",
    hoverName: "Planet Tatooine",
    compatibility: "44%",
    distance: "2,400 ly",
    price: "$4,860 / night",
    description:
      "A sunbaked desert planet with ochre basins, wind-carved stone, and heat-haze horizons that feel mythic and cinematic all at once.",
    facts: [
      "Stay type: Dune courtyard residence",
      "Gravity: 9.12 m/s^2",
      "Climate: Arid twin-sun desert",
      "Best for: Desert adventure stays",
    ],
    image: `${import.meta.env.BASE_URL}tatooine.png`,
  },
  {
    id: 22,
    name: "Titan",
    hoverName: "Planet Titan",
    compatibility: "49%",
    distance: "1.4 billion km",
    price: "$5,740 / night",
    description:
      "A hazy golden moon of methane lakes and muted amber terrain, perfect for travellers drawn to atmospheric mystery and distant quiet.",
    facts: [
      "Stay type: Lake-edge pressure habitat",
      "Gravity: 1.35 m/s^2",
      "Climate: Cryogenic hydrocarbon weather",
      "Best for: Moody off-world solitude",
    ],
    image: `${import.meta.env.BASE_URL}titan.png`,
  },
  {
    id: 23,
    name: "Viltrum",
    hoverName: "Planet Viltrum",
    compatibility: "63%",
    distance: "2,980 ly",
    price: "$8,680 / night",
    description:
      "A powerful red-orange world with dense cloud textures and an imposing presence, made for bold travellers who like heroic-scale destinations.",
    facts: [
      "Stay type: High-citadel sky residence",
      "Gravity: 11.58 m/s^2",
      "Climate: Warm high-pressure atmosphere",
      "Best for: Commanding panoramic stays",
    ],
    image: `${import.meta.env.BASE_URL}viltrum.png`,
  },
  {
    id: 24,
    name: "Yavin 4",
    hoverName: "Planet Yavin 4",
    compatibility: "69%",
    distance: "3,200 ly",
    price: "$6,620 / night",
    description:
      "A lush jungle moon with temple-studded terrain, warm green-gold landmasses, and a mysterious violet-lit sky beyond orbit.",
    facts: [
      "Stay type: Canopy temple retreat",
      "Gravity: 8.63 m/s^2",
      "Climate: Humid tropical jungle",
      "Best for: Adventure and ancient ruins",
    ],
    image: `${import.meta.env.BASE_URL}yavin4.png`,
  },
];

const planetSpecs: Record<number, PlanetSpec> = {
  1: { gravityValue: 3.71, gravityLabel: "3.71 m/s^2", temperatureValue: -63, temperatureLabel: "-63 C avg", atmosphere: "Carbon Dioxide", archetype: "Solid" },
  2: { gravityValue: 7.94, gravityLabel: "7.94 m/s^2", temperatureValue: -140, temperatureLabel: "-140 C avg", atmosphere: "Helium", archetype: "Gas" },
  3: { gravityValue: 10.44, gravityLabel: "10.44 m/s^2", temperatureValue: -178, temperatureLabel: "-178 C avg", atmosphere: "Hydrogen", archetype: "Gas" },
  4: { gravityValue: 8.87, gravityLabel: "8.87 m/s^2", temperatureValue: 464, temperatureLabel: "464 C avg", atmosphere: "Carbon Dioxide", archetype: "Solid" },
  5: { gravityValue: 19.60, gravityLabel: "19.60 m/s^2", temperatureValue: 18, temperatureLabel: "18 C avg", atmosphere: "Oxygen", archetype: "Solid" },
  6: { gravityValue: 1.80, gravityLabel: "1.80 m/s^2", temperatureValue: -5, temperatureLabel: "-130 to 120 C", atmosphere: "Sulfur Dioxide", archetype: "Solid" },
  7: { gravityValue: 274.00, gravityLabel: "274.00 m/s^2", temperatureValue: 5500, temperatureLabel: "5,500 C surface", atmosphere: "Hydrogen", archetype: "Plasma" },
  8: { gravityValue: 0.78, gravityLabel: "0.78 m/s^2", temperatureValue: -229, temperatureLabel: "-229 C avg", atmosphere: "Methane", archetype: "Solid" },
  9: { gravityValue: 9.52, gravityLabel: "9.52 m/s^2", temperatureValue: 21, temperatureLabel: "21 C avg", atmosphere: "Oxygen", archetype: "Solid" },
  10: { gravityValue: 24.79, gravityLabel: "24.79 m/s^2", temperatureValue: -145, temperatureLabel: "-145 C cloud tops", atmosphere: "Hydrogen", archetype: "Gas" },
  11: { gravityValue: 9.12, gravityLabel: "9.12 m/s^2", temperatureValue: -22, temperatureLabel: "-22 C avg", atmosphere: "Oxygen", archetype: "Solid" },
  12: { gravityValue: 8.69, gravityLabel: "8.69 m/s^2", temperatureValue: -224, temperatureLabel: "-224 C avg", atmosphere: "Hydrogen", archetype: "Gas" },
  13: { gravityValue: 7.08, gravityLabel: "7.08 m/s^2", temperatureValue: 1200, temperatureLabel: "1,200 C dayside", atmosphere: "Hydrogen", archetype: "Gas" },
  14: { gravityValue: 9.81, gravityLabel: "9.81 m/s^2", temperatureValue: 24, temperatureLabel: "24 C avg", atmosphere: "Oxygen", archetype: "Solid" },
  15: { gravityValue: 10.99, gravityLabel: "10.99 m/s^2", temperatureValue: 42, temperatureLabel: "42 C core districts", atmosphere: "Ionized Metals", archetype: "Solid" },
  16: { gravityValue: 11.15, gravityLabel: "11.15 m/s^2", temperatureValue: -214, temperatureLabel: "-214 C avg", atmosphere: "Hydrogen", archetype: "Gas" },
  17: { gravityValue: 8.44, gravityLabel: "8.44 m/s^2", temperatureValue: -60, temperatureLabel: "-60 C avg", atmosphere: "Nitrogen", archetype: "Solid" },
  18: { gravityValue: 3.70, gravityLabel: "3.70 m/s^2", temperatureValue: 127, temperatureLabel: "-173 to 427 C", atmosphere: "Vacuum", archetype: "Solid" },
  19: { gravityValue: 9.42, gravityLabel: "9.42 m/s^2", temperatureValue: 980, temperatureLabel: "980 C lava zones", atmosphere: "Sulfur Dioxide", archetype: "Solid" },
  20: { gravityValue: 10.20, gravityLabel: "10.20 m/s^2", temperatureValue: 11, temperatureLabel: "11 C avg", atmosphere: "Dihydrogen Monoxide", archetype: "Liquid" },
  21: { gravityValue: 9.12, gravityLabel: "9.12 m/s^2", temperatureValue: 32, temperatureLabel: "32 C avg", atmosphere: "Nitrogen", archetype: "Solid" },
  22: { gravityValue: 1.35, gravityLabel: "1.35 m/s^2", temperatureValue: -179, temperatureLabel: "-179 C avg", atmosphere: "Methane", archetype: "Liquid" },
  23: { gravityValue: 11.58, gravityLabel: "11.58 m/s^2", temperatureValue: 38, temperatureLabel: "38 C avg", atmosphere: "Oxygen", archetype: "Solid" },
  24: { gravityValue: 8.63, gravityLabel: "8.63 m/s^2", temperatureValue: 27, temperatureLabel: "27 C avg", atmosphere: "Oxygen", archetype: "Solid" },
};

const getFactValue = (facts: string[], label: string) =>
  facts.find((fact) => fact.startsWith(`${label}:`))?.split(": ").slice(1).join(": ") ?? "";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getRangeScore = (value: number, min: number, max: number) => {
  if (value >= min && value <= max) return 1;

  const span = Math.max(max - min, 1);
  const nearestEdge = value < min ? min : max;
  const distance = Math.abs(value - nearestEdge);
  const tolerance = Math.max(span * 1.35, 8);

  return clamp(1 - distance / tolerance, 0, 1);
};

const calculateCompatibility = (search: EditableSearchState, spec: PlanetSpec) => {
  const gravityMin = parseFloat(search.gravityMin);
  const gravityMax = parseFloat(search.gravityMax);
  const tempMin = parseFloat(search.tempMin);
  const tempMax = parseFloat(search.tempMax);

  const gravityScore = getRangeScore(spec.gravityValue, Math.min(gravityMin, gravityMax), Math.max(gravityMin, gravityMax));
  const temperatureScore = getRangeScore(spec.temperatureValue, Math.min(tempMin, tempMax), Math.max(tempMin, tempMax));
  const atmosphereScore = spec.atmosphere === search.atmosphere ? 1 : 0;
  const archetypeScore = spec.archetype === search.budget ? 1 : 0;

  const weightedScore =
    gravityScore * 0.34 +
    temperatureScore * 0.34 +
    atmosphereScore * 0.16 +
    archetypeScore * 0.16;

  return Math.round(weightedScore * 100);
};

const getCompatibilityTone = (compatibilityPercent: number) => {
  if (compatibilityPercent >= 90) return "excellent";
  if (compatibilityPercent >= 70) return "good";
  return "low";
};

const rankPlanets = (search: EditableSearchState): RankedPlanet[] =>
  planetCards
    .map((planet) => ({
      ...planet,
      compatibilityPercent: calculateCompatibility(search, planetSpecs[planet.id]),
    }))
    .sort((left, right) => {
      if (right.compatibilityPercent !== left.compatibilityPercent) {
        return right.compatibilityPercent - left.compatibilityPercent;
      }

      return left.name.localeCompare(right.name);
    });

const OVERLAY_W = 520;
const OVERLAY_H = 620;

function PlanetPage() {
  const cometLogo = `${import.meta.env.BASE_URL}comet-logo.png`;
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect back to home if landed here directly with no data
  if (!state) {
    navigate("/");
    return null;
  }

  const initialState = state as SearchState;
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cardRect, setCardRect] = useState<CardRect | null>(null);

  const toEditableState = (value: SearchState): EditableSearchState => ({
    ...value,
    arrivalDate: value.arrivalDate ? new Date(value.arrivalDate) : null,
    departureDate: value.departureDate ? new Date(value.departureDate) : null,
  });

  const [searchState, setSearchState] = useState<EditableSearchState>(() => toEditableState(initialState));
  const [appliedSearchState, setAppliedSearchState] = useState<EditableSearchState>(() => toEditableState(initialState));
  const [draftState, setDraftState] = useState<EditableSearchState>(() => toEditableState(initialState));
  const initialRankedPlanets = useMemo(
    () => rankPlanets(toEditableState(initialState)),
    [initialState],
  );

  const arrivalStr = searchState.arrivalDate ? new Date(searchState.arrivalDate).toLocaleDateString("en-NZ", { day: "numeric", month: "short" }) : "";
  const departureStr = searchState.departureDate ? new Date(searchState.departureDate).toLocaleDateString("en-NZ", { day: "numeric", month: "short" }) : "";

  const extraFilters: FilterChip[] = [
    { label: "Guest size", value: searchState.guestSize },
    { label: "Gravity range", value: `${searchState.gravityMin} - ${searchState.gravityMax} N` },
    { label: "Temp range", value: `${searchState.tempMin} - ${searchState.tempMax} C` },
    { label: "Atmosphere", value: searchState.atmosphere },
    { label: "Archetype", value: searchState.budget },
  ];

  const filters = [
    { label: "Location:", value: searchState.location },
    { label: "Duration:", value: `${arrivalStr} – ${departureStr}` },
    { label: "Guests:", value: searchState.guests },
  ];
  const isNextReady = draftState.location.trim() !== "" && draftState.arrivalDate !== null && draftState.departureDate !== null;
  const guestsNum = parseInt(draftState.guests, 10);
  const isGuestsValid = draftState.guests.trim() !== "" && !isNaN(guestsNum) && guestsNum > 0;
  const isGravityValid = draftState.gravityMin.trim() !== "" && draftState.gravityMax.trim() !== "" && !isNaN(parseFloat(draftState.gravityMin)) && !isNaN(parseFloat(draftState.gravityMax));
  const isTempValid = draftState.tempMin.trim() !== "" && draftState.tempMax.trim() !== "" && !isNaN(parseFloat(draftState.tempMin)) && !isNaN(parseFloat(draftState.tempMax));
  const isSearchReady = isNextReady && isGuestsValid && draftState.guestSize !== "" && isGravityValid && isTempValid && draftState.atmosphere !== "" && draftState.budget !== "";
  const dimmed = phase !== "idle";
  const sectionsDimmed = phase === "opening" || phase === "open";
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [isTrackAnimated, setIsTrackAnimated] = useState(false);
  const [activePlanetId, setActivePlanetId] = useState<number>(initialRankedPlanets[0]?.id ?? planetCards[0].id);
  const rankedPlanets = useMemo<RankedPlanet[]>(
    () => rankPlanets(appliedSearchState),
    [appliedSearchState],
  );
  const activePlanetIndex = rankedPlanets.findIndex(
    (planet) => planet.id === activePlanetId,
  );
  const activePlanet = rankedPlanets[Math.max(activePlanetIndex, 0)] ?? rankedPlanets[0];
  const activePlanetSpec = planetSpecs[activePlanet.id];

  useEffect(() => {
    if (rankedPlanets.length === 0) return;
    setActivePlanetId(rankedPlanets[0].id);
    setIsTrackAnimated(false);
  }, [rankedPlanets]);

  const handlePlanetSelect = (planetId: number) => {
    setIsTrackAnimated(isDetailOpen);
    setActivePlanetId(planetId);
    setIsDetailOpen(true);
  };

  const getOverlayStyle = (): React.CSSProperties => {
    if (!cardRect) return {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (phase === "opening" || phase === "closing") {
      return {
        top: cardRect.top,
        left: cardRect.left,
        width: cardRect.width,
        height: cardRect.height,
        borderRadius: "999px",
      };
    }

    return {
      top: (vh - OVERLAY_H) / 2,
      left: (vw - OVERLAY_W) / 2,
      width: OVERLAY_W,
      height: OVERLAY_H,
      maxHeight: "85vh",
      borderRadius: "24px",
    };
  };

  const handleOpenEdit = () => {
    if (!editButtonRef.current) return;
    setDraftState(searchState);
    const rect = editButtonRef.current.getBoundingClientRect();
    setCardRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setPhase("opening");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("open"))
    );
  };

  const closeOverlay = () => {
    setPhase("closing");
    setTimeout(() => {
      setPhase("idle");
      setCardRect(null);
    }, 480);
  };

  const handleApplySearch = () => {
    if (!isSearchReady) return;
    setSearchState(draftState);
    closeOverlay();
  };

  const handleRunSearch = () => {
    const nextRankedPlanets = rankPlanets(searchState);
    setAppliedSearchState(searchState);
    if (nextRankedPlanets.length > 0) {
      setActivePlanetId(nextRankedPlanets[0].id);
    }
    setIsDetailOpen(true);
    setIsTrackAnimated(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={`${styles.topBar} ${sectionsDimmed ? styles.sectionDimmed : ""}`}>
          <div className={styles.logo}>
            <img src={cometLogo} alt="BOOKING.COMET" className={styles.logoImage} />
          </div>

          <a href="/" className={styles.outlineButton}>
            Get Started
          </a>
        </section>

        <section className={`${styles.searchBar} ${sectionsDimmed ? styles.sectionDimmed : ""}`} aria-label="Planet search filters">
          {filters.map((filter) => (
            <div
              key={filter.label}
              className={`${styles.filterChip} ${filter.label === "Guests:" ? styles.filterChipCompact : ""}`}
            >
              <span className={styles.filterDot} aria-hidden="true" />
              <p className={styles.filterText}>
                <span className={styles.filterLabel}>{filter.label}</span>
                <span>{filter.value}</span>
              </p>
            </div>
          ))}

          <div className={`${styles.filterChip} ${styles.filterChipWide} ${styles.filterChipHoverable}`}>
            <button type="button" className={styles.filterChipButton} aria-label="Show extra filters">
              <span className={styles.filterDot} aria-hidden="true" />
              <p className={styles.filterText}>
                <span className={styles.filterLabel}>Extra Preferences:</span>
                <span>Hover to view</span>
              </p>
            </button>

            <div className={styles.filterTooltip} role="tooltip">
              {extraFilters.map((filter) => (
                <p key={filter.label} className={styles.tooltipRow}>
                  <span className={styles.tooltipLabel}>{filter.label}:</span>
                  <span>{filter.value}</span>
                </p>
              ))}
            </div>
          </div>

          <button
            ref={editButtonRef}
            type="button"
            className={`${styles.actionButton} ${dimmed ? styles.actionButtonHidden : ""}`}
            onClick={handleOpenEdit}
          >
            Edit
          </button>

          <button
            type="button"
            className={styles.actionButton}
            onClick={handleRunSearch}
          >
            Search
          </button>
        </section>

        <section
          className={`${styles.content} ${isDetailOpen ? styles.contentExpanded : ""} ${sectionsDimmed ? styles.sectionDimmed : ""}`}
          aria-label="Available planets"
        >
          <div
            className={`${styles.galleryGrid} ${isDetailOpen ? styles.galleryGridExpanded : ""}`}
          >
            {rankedPlanets.map((planet) => {
              const isActive = planet.id === activePlanetId;
              const compatibilityTone = getCompatibilityTone(planet.compatibilityPercent);

              return (
                <article
                  key={planet.id}
                  className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
                >
                  <button
                    type="button"
                    className={styles.cardButton}
                    onClick={() => handlePlanetSelect(planet.id)}
                    aria-pressed={isActive}
                  >
                    <div className={styles.imageFrame}>
                      <img
                        src={planet.image}
                        alt={`${planet.name} landscape`}
                        className={styles.planetImage}
                      />
                      <span className={styles.imageShade} aria-hidden="true" />
                      <span className={styles.hoverName}>{planet.hoverName}</span>
                    </div>

                    <p className={styles.cardText}>
                      Planet: {planet.name} - Compatibility:
                      {" "}
                      <span className={`${styles.compatibilityBadge} ${styles[`compatibilityBadge_${compatibilityTone}`]}`}>
                        {planet.compatibilityPercent}%
                      </span>
                      {" "}-
                      {" "}Distance: {planet.distance}
                    </p>
                  </button>
                </article>
              );
            })}
          </div>

          <aside
            className={`${styles.detailPanel} ${isDetailOpen ? styles.detailPanelOpen : ""}`}
            aria-hidden={!isDetailOpen}
            aria-live="polite"
          >
            <div className={styles.detailHero}>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsTrackAnimated(false);
                }}
                aria-label="Close planet details"
              />

              <div
                className={`${styles.detailTrack} ${isTrackAnimated ? styles.detailTrackAnimated : ""}`}
                style={{
                  transform: `translateX(-${activePlanetIndex * 100}%)`,
                }}
              >
                {rankedPlanets.map((planet) => (
                  <div key={planet.id} className={styles.detailSlide}>
                    <img
                      src={planet.image}
                      alt={`${planet.name} scenic view`}
                      className={styles.detailImage}
                    />
                    <span className={styles.detailOverlay} aria-hidden="true" />
                    <div className={styles.pricePill}>Prices: {planet.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div key={activePlanet.id} className={styles.detailBody}>
              <div className={styles.detailTitleRow}>
                <h2 className={styles.detailTitle}>
                  Planet: {activePlanet.name}
                  {" "} - Distance: {activePlanet.distance}
                </h2>
                <span
                  className={`${styles.compatibilityBadge} ${styles.compatibilityBadgeLarge} ${styles[`compatibilityBadge_${getCompatibilityTone(activePlanet.compatibilityPercent)}`]}`}
                >
                  Compatibility {activePlanet.compatibilityPercent}%
                </span>
              </div>

              <p className={styles.detailDescription}>{activePlanet.description}</p>

              <div className={styles.factGrid}>
                <div className={styles.factColumn}>
                  <p className={styles.factItem}>
                    <span className={styles.factLabel}>Stay type:</span> {getFactValue(activePlanet.facts, "Stay type")}
                  </p>
                  <p className={styles.factItem}>
                    <span className={styles.factLabel}>Climate:</span> {getFactValue(activePlanet.facts, "Climate")}
                  </p>
                  <p className={styles.factItem}>
                    <span className={styles.factLabel}>Best for:</span> {getFactValue(activePlanet.facts, "Best for")}
                  </p>
                </div>

                <div className={styles.factColumn}>
                  <p className={styles.factItem}>
                    <span className={styles.factLabel}>Gravity:</span> {activePlanetSpec.gravityLabel}
                  </p>
                  <p className={styles.factItem}>
                    <span className={styles.factLabel}>Temp:</span> {activePlanetSpec.temperatureLabel}
                  </p>
                  <p className={styles.factItem}>
                    <span className={styles.factLabel}>Atmosphere:</span> {activePlanetSpec.atmosphere}
                  </p>
                  <p className={styles.factItem}>
                    <span className={styles.factLabel}>Archetype:</span> {activePlanetSpec.archetype}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <div
          className={`${styles.backdrop} ${dimmed ? styles.backdropVisible : ""}`}
          onClick={closeOverlay}
        />

        {phase !== "idle" && cardRect && (
          <div
            className={`${styles.expandedOverlay} ${styles[`expandedOverlay_${phase}`]}`}
            style={getOverlayStyle()}
          >
            <div className={`${styles.expandedInner} ${phase === "open" ? styles.expandedInnerVisible : ""}`}>
              <button className={styles.backButton} onClick={closeOverlay}>← Back</button>
              <h2 className={styles.overlayTitle}>Your Preferences</h2>

              <div className={styles.editIntroGroup}>
                <input
                  type="text"
                  placeholder="Galactic Sector"
                  className={styles.bookingInput}
                  value={draftState.location}
                  onChange={(e) => setDraftState((current) => ({ ...current, location: e.target.value }))}
                />
                <DatePicker
                  selected={draftState.arrivalDate}
                  onChange={(date: Date | null) => setDraftState((current) => ({ ...current, arrivalDate: date }))}
                  placeholderText="Arrival date"
                  className={styles.bookingInput}
                  portalId="root"
                />
                <DatePicker
                  selected={draftState.departureDate}
                  onChange={(date: Date | null) => setDraftState((current) => ({ ...current, departureDate: date }))}
                  placeholderText="Departure date"
                  className={styles.bookingInput}
                  portalId="root"
                />
              </div>

              <div className={styles.summaryPill}>
                <span>📍 {draftState.location || "Unset"}</span>
                <span>·</span>
                <span>{draftState.arrivalDate?.toLocaleDateString() || "No arrival"} → {draftState.departureDate?.toLocaleDateString() || "No departure"}</span>
              </div>

              <div className={styles.prefGroup}>
                <label className={styles.prefLabel}>Guests <span className={styles.required}>*</span></label>
                <input
                  type="number"
                  min="1"
                  placeholder="Number of guests"
                  className={`${styles.bookingInput} ${styles.prefInput}`}
                  value={draftState.guests}
                  onChange={(e) => setDraftState((current) => ({ ...current, guests: e.target.value }))}
                  onWheel={preventWheelNumberChange}
                />

                <label className={styles.prefLabel}>Guest Size <span className={styles.required}>*</span></label>
                <div className={styles.chipGrid}>
                  {GUEST_SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.chip} ${draftState.guestSize === opt.value ? styles.chipActive : ""}`}
                      onClick={() => setDraftState((current) => ({ ...current, guestSize: opt.value }))}
                    >
                      {opt.label} <span className={styles.chipSub}>{opt.sublabel}</span>
                    </button>
                  ))}
                </div>

                <label className={styles.prefLabel}>Gravity Range (m/s^2) <span className={styles.required}>*</span></label>
                <div className={styles.rangeRow}>
                  <input
                    type="number"
                    placeholder="Min"
                    className={`${styles.bookingInput} ${styles.rangeInput}`}
                    value={draftState.gravityMin}
                    onChange={(e) => setDraftState((current) => ({ ...current, gravityMin: e.target.value }))}
                    onWheel={preventWheelNumberChange}
                  />
                  <span className={styles.rangeDash}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className={`${styles.bookingInput} ${styles.rangeInput}`}
                    value={draftState.gravityMax}
                    onChange={(e) => setDraftState((current) => ({ ...current, gravityMax: e.target.value }))}
                    onWheel={preventWheelNumberChange}
                  />
                </div>

                <label className={styles.prefLabel}>Temperature Range (°C) <span className={styles.required}>*</span></label>
                <div className={styles.rangeRow}>
                  <input
                    type="number"
                    placeholder="Min"
                    className={`${styles.bookingInput} ${styles.rangeInput}`}
                    value={draftState.tempMin}
                    onChange={(e) => setDraftState((current) => ({ ...current, tempMin: e.target.value }))}
                    onWheel={preventWheelNumberChange}
                  />
                  <span className={styles.rangeDash}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className={`${styles.bookingInput} ${styles.rangeInput}`}
                    value={draftState.tempMax}
                    onChange={(e) => setDraftState((current) => ({ ...current, tempMax: e.target.value }))}
                    onWheel={preventWheelNumberChange}
                  />
                </div>

                <label className={styles.prefLabel}>Atmosphere <span className={styles.required}>*</span></label>
                <div className={styles.chipGrid}>
                  {ATMOSPHERE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      className={`${styles.chip} ${draftState.atmosphere === option ? styles.chipActive : ""}`}
                      onClick={() => setDraftState((current) => ({ ...current, atmosphere: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <label className={styles.prefLabel}>Planet Archetype <span className={styles.required}>*</span></label>
                <div className={styles.chipGrid}>
                  {PLANET_ARCHETYPE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      className={`${styles.chip} ${draftState.budget === option ? styles.chipActive : ""}`}
                      onClick={() => setDraftState((current) => ({ ...current, budget: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className={`${styles.overlaySearchButton} ${isSearchReady ? styles.overlaySearchButtonReady : ""}`}
                disabled={!isSearchReady}
                onClick={handleApplySearch}
              >
                Save edits
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default PlanetPage;
