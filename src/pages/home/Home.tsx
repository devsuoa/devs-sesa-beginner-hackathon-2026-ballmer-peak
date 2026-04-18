import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Home.module.css";

type Phase = "idle" | "opening" | "open" | "closing";

interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function Home() {
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [cardRect, setCardRect] = useState<CardRect | null>(null);

  const [guests, setGuests] = useState(1);
  const [spaceType, setSpaceType] = useState("");
  const [budget, setBudget] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  const isNextReady = location.trim() !== "" && arrivalDate !== null && departureDate !== null;
  const isSearchReady = isNextReady && spaceType !== "" && budget !== "";
  const dimmed = phase !== "idle";
  const sectionsDimmed = phase === "opening" || phase === "open";

  const EXPANDED_W = 520;
  const EXPANDED_H = 520; // approximate — card scrolls if taller

  const handleOpen = () => {
    if (!isNextReady || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setCardRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    setPhase("opening");
    // One rAF so browser paints the "opening" state (card at origin) before animating
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("open"))
    );
  };

  const handleClose = () => {
    setPhase("closing");
    setTimeout(() => {
      setPhase("idle");
      setCardRect(null);
    }, 480);
  };

  const toggleAmenity = (a: string) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const amenityOptions = ["WiFi", "Parking", "Kitchen", "Pet Friendly", "Pool", "Gym"];
  const spaceTypes = ["Apartment", "House", "Studio", "Villa", "Cabin", "Office"];

  // Inline styles for the animated overlay card
  // "opening"/"closing" → at card's exact position + size
  // "open" → centred at expanded size
  const getOverlayStyle = (): React.CSSProperties => {
    if (!cardRect) return {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (phase === "opening") {
      return {
        top: cardRect.top,
        left: cardRect.left,
        width: cardRect.width,
        height: cardRect.height,
        borderRadius: "24px",
      };
    }
    if (phase === "closing") {
      return {
        top: cardRect.top,
        left: cardRect.left,
        width: cardRect.width,
        height: cardRect.height,
        borderRadius: "24px",
      };
    }
    // "open" — centred
    return {
      top: (vh - EXPANDED_H) / 2,
      left: (vw - EXPANDED_W) / 2,
      width: EXPANDED_W,
      height: EXPANDED_H,
      maxHeight: "85vh",
      borderRadius: "24px",
    };
  };

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <section className={`${styles.topBar} ${sectionsDimmed ? styles.sectionDimmed : ""}`}>
        <div className={styles.logo}>
          <div className={styles.logoDot} />
          <span>Logo</span>
        </div>
        <a href="/" className={styles.outlineButton}>Get Started</a>
      </section>

      {/* Main Content */}
      <section className={`${styles.mainContent} ${sectionsDimmed ? styles.sectionDimmed : ""}`}>
        <h1 className={styles.mainTitle}>BOOKING.COMET</h1>

        <div className={styles.contentRow}>
          {/* Original card — hidden (opacity 0) while expanded is open */}
          <div className={styles.bookingSlot}>
            <div
              ref={cardRef}
              className={`${styles.bookingCard} ${(phase === "open" || phase === "opening") ? styles.bookingCardHidden : ""} ${phase === "closing" ? styles.bookingCardFadingIn : ""}`}
            >
              <h2 className={styles.bookingTitle}>Book a space</h2>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Location"
                  className={styles.bookingInput}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <DatePicker
                  selected={arrivalDate}
                  onChange={(date) => setArrivalDate(date)}
                  placeholderText="Arrival date"
                  className={styles.bookingInput}
                  portalId="root"
                />
                <DatePicker
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date)}
                  placeholderText="Departure date"
                  className={styles.bookingInput}
                  portalId="root"
                />
              </div>
              <button
                className={`${styles.nextButton} ${isNextReady ? styles.nextButtonReady : ""}`}
                disabled={!isNextReady}
                onClick={handleOpen}
              >
                Next &gt;
              </button>
            </div>
          </div>

          {/* Hero image — slides toward center when expanded */}
          <div className={styles.heroImageWrapper}>
            <img src="/space.jpg" alt="Space" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <footer className={`${styles.footer} ${sectionsDimmed ? styles.sectionDimmed : ""}`}>
        <div className={styles.footerBar} />
      </footer>

      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${dimmed ? styles.backdropVisible : ""}`}
        onClick={handleClose}
      />

      {/* Animated expanding card — position: fixed, transitions between card rect and center */}
      {phase !== "idle" && cardRect && (
        <div
          className={`${styles.expandedOverlay} ${styles[`expandedOverlay_${phase}`]}`}
          style={getOverlayStyle()}
        >
          {/* Inner content fades in only when fully open */}
          <div className={`${styles.expandedInner} ${phase === "open" ? styles.expandedInnerVisible : ""}`}>
            <button className={styles.backButton} onClick={handleClose}>← Back</button>
            <h2 className={styles.bookingTitle}>Your Preferences</h2>

            <div className={styles.summaryPill}>
              <span>📍 {location}</span>
              <span>·</span>
              <span>{arrivalDate?.toLocaleDateString()} → {departureDate?.toLocaleDateString()}</span>
            </div>

            <div className={styles.prefGroup}>
              <label className={styles.prefLabel}>Guests</label>
              <div className={styles.stepper}>
                <button className={styles.stepBtn} onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                <span className={styles.stepValue}>{guests}</span>
                <button className={styles.stepBtn} onClick={() => setGuests(guests + 1)}>+</button>
              </div>

              <label className={styles.prefLabel}>Space type <span className={styles.required}>*</span></label>
              <div className={styles.chipGrid}>
                {spaceTypes.map((t) => (
                  <button key={t} className={`${styles.chip} ${spaceType === t ? styles.chipActive : ""}`} onClick={() => setSpaceType(t)}>{t}</button>
                ))}
              </div>

              <label className={styles.prefLabel}>Budget per night <span className={styles.required}>*</span></label>
              <div className={styles.chipGrid}>
                {["< $100", "$100–250", "$250–500", "$500+"].map((b) => (
                  <button key={b} className={`${styles.chip} ${budget === b ? styles.chipActive : ""}`} onClick={() => setBudget(b)}>{b}</button>
                ))}
              </div>

              <label className={styles.prefLabel}>Amenities <span className={styles.optional}>(optional)</span></label>
              <div className={styles.chipGrid}>
                {amenityOptions.map((a) => (
                  <button key={a} className={`${styles.chip} ${amenities.includes(a) ? styles.chipActive : ""}`} onClick={() => toggleAmenity(a)}>{a}</button>
                ))}
              </div>
            </div>

            <button
              className={`${styles.searchButton} ${isSearchReady ? styles.searchButtonReady : ""}`}
              disabled={!isSearchReady}
            >
              🔍 Search spaces
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;