import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./PlanetPage.module.css";
import type { EditableSearchState, SearchState } from "../../types/search";

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
      "Gravity: 38% of Earth",
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
      "Gravity: 81% of Earth",
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
      "Gravity: 106% of Earth",
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
      "Gravity: 90% of Earth",
      "Climate: Dense radiant atmosphere",
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
      "Gravity: 134% of Earth",
      "Climate: Warm dry highlands",
      "Best for: Long-haul luxury explorers",
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
      "Gravity: 18% of Earth",
      "Climate: Volcanic extremes",
      "Best for: Extreme geology tours",
    ],
    image: `${import.meta.env.BASE_URL}io.jpg`,
  },
  {
    id: 7,
    name: "Ares IX",
    hoverName: "Planet Ares IX",
    compatibility: "61%",
    distance: "82 million km",
    price: "$5,210 / night",
    description:
      "A red frontier world with frosted caps and canyon basins, offering cinematic dawns and crater-edge retreats.",
    facts: [
      "Stay type: Ridge capsule suites",
      "Gravity: 41% of Earth",
      "Climate: Thin cold atmosphere",
      "Best for: Desert horizon escapes",
    ],
    image: `${import.meta.env.BASE_URL}mars-alt.png`,
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
      "Gravity: 8% of Earth",
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
      "Gravity: 97% of Earth",
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
      "Gravity: Extreme",
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
      "Gravity: 93% of Earth",
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
      "Gravity: 89% of Earth",
      "Climate: Frozen upper atmosphere",
      "Best for: Calm deep-space panoramas",
    ],
    image: `${import.meta.env.BASE_URL}uranus.png`,
  },
];

const atmosphereOptions = ["Oxygen", "Carbon Dioxide", "Dihydrogen Monoxide", "Methane", "Vacuum", "Helium", "Hydrogen"];
const planetArchetypes = ["Solid", "Liquid", "Gas", "Plasma"];
const guestSizeOptions = [
  { label: "Small", sublabel: "< 500 cm", value: "small" },
  { label: "Medium", sublabel: "500-2000 cm", value: "medium" },
  { label: "Large", sublabel: "> 2000 cm", value: "large" },
];

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
  const [draftState, setDraftState] = useState<EditableSearchState>(() => toEditableState(initialState));

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
  const [activePlanetId, setActivePlanetId] = useState<number>(planetCards[0].id);
  const activePlanetIndex = planetCards.findIndex(
    (planet) => planet.id === activePlanetId,
  );
  const activePlanet = planetCards[activePlanetIndex];

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

          <button type="button" className={styles.actionButton}>
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
            {planetCards.map((planet) => {
              const isActive = planet.id === activePlanetId;

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
                      Planet: {planet.name} - Compatibility: {planet.compatibility} -
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
                {planetCards.map((planet) => (
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
              <h2 className={styles.detailTitle}>
                Planet: {activePlanet.name} - Compatibility: {activePlanet.compatibility}
                {" "} - Distance: {activePlanet.distance}
              </h2>

              <p className={styles.detailDescription}>{activePlanet.description}</p>

              <div className={styles.factGrid}>
                {activePlanet.facts.map((fact) => (
                  <p key={fact} className={styles.factItem}>
                    {fact}
                  </p>
                ))}
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
                />

                <label className={styles.prefLabel}>Guest Size <span className={styles.required}>*</span></label>
                <div className={styles.chipGrid}>
                  {guestSizeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.chip} ${draftState.guestSize === opt.value ? styles.chipActive : ""}`}
                      onClick={() => setDraftState((current) => ({ ...current, guestSize: opt.value }))}
                    >
                      {opt.label} <span className={styles.chipSub}>{opt.sublabel}</span>
                    </button>
                  ))}
                </div>

                <label className={styles.prefLabel}>Gravity Range (N) <span className={styles.required}>*</span></label>
                <div className={styles.rangeRow}>
                  <input
                    type="number"
                    placeholder="Min"
                    className={`${styles.bookingInput} ${styles.rangeInput}`}
                    value={draftState.gravityMin}
                    onChange={(e) => setDraftState((current) => ({ ...current, gravityMin: e.target.value }))}
                  />
                  <span className={styles.rangeDash}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className={`${styles.bookingInput} ${styles.rangeInput}`}
                    value={draftState.gravityMax}
                    onChange={(e) => setDraftState((current) => ({ ...current, gravityMax: e.target.value }))}
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
                  />
                  <span className={styles.rangeDash}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className={`${styles.bookingInput} ${styles.rangeInput}`}
                    value={draftState.tempMax}
                    onChange={(e) => setDraftState((current) => ({ ...current, tempMax: e.target.value }))}
                  />
                </div>

                <label className={styles.prefLabel}>Atmosphere <span className={styles.required}>*</span></label>
                <div className={styles.chipGrid}>
                  {atmosphereOptions.map((option) => (
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
                  {planetArchetypes.map((option) => (
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
