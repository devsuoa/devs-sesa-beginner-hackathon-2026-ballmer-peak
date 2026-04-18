import { useState, useRef, type SetStateAction } from "react";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Home.module.css";

type Phase = "idle" | "opening" | "open" | "closing";
type AuthPhase = "idle" | "entering" | "open" | "leaving";
type AuthTab = "login" | "signup";
type AuthState = "form" | "success";

interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Hardcoded MVP username — replace with real auth later
const MVP_USERNAMES: Record<string, string> = {
  "1": "Rocky_Gosling123",
  "2": "AnakinSkywlkr",
  "3": "Aiex is the GOAT BAAAAAAAA",
};

const getMvpUsername = (password: string): string => {
  if (password.includes("1")) return MVP_USERNAMES["1"];
  if (password.includes("2")) return MVP_USERNAMES["2"];
  if (password.includes("3")) return MVP_USERNAMES["3"];
  return MVP_USERNAMES["1"]; // default
};

function Home() {
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [cardRect, setCardRect] = useState<CardRect | null>(null);

  // Auth state
  const [authPhase, setAuthPhase] = useState<AuthPhase>("idle");
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [authState, setAuthState] = useState<AuthState>("form");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRemember, setLoginRemember] = useState(false);

  // Signup fields
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupVerify, setSignupVerify] = useState("");

  const [resolvedUsername, setResolvedUsername] = useState("");

  // Booking preferences
  const [guests, setGuests] = useState("");
  const [guestSize, setGuestSize] = useState("");
  const [gravityMin, setGravityMin] = useState("");
  const [gravityMax, setGravityMax] = useState("");
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [budget, setBudget] = useState("");
  const [allergies, setAllergies] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const cometLogo = `${import.meta.env.BASE_URL}comet-logo.png`;

  const isNextReady = location.trim() !== "" && arrivalDate !== null && departureDate !== null;
  const guestsNum = parseInt(guests, 10);
  const isGuestsValid = guests.trim() !== "" && !isNaN(guestsNum) && guestsNum > 0;
  const isGravityValid = gravityMin.trim() !== "" && gravityMax.trim() !== "" && !isNaN(parseFloat(gravityMin)) && !isNaN(parseFloat(gravityMax));
  const isTempValid = tempMin.trim() !== "" && tempMax.trim() !== "" && !isNaN(parseFloat(tempMin)) && !isNaN(parseFloat(tempMax));
  const isSearchReady = isNextReady && isGuestsValid && guestSize !== "" && isGravityValid && isTempValid && atmosphere !== "" && budget !== "";

  const isLoginReady = loginEmail.trim() !== "" && loginPassword.trim() !== "";
  const isSignupReady = signupUsername.trim() !== "" && signupEmail.trim() !== "" && signupPassword.trim() !== "" && signupVerify.trim() !== "" && signupPassword === signupVerify;

  const bookingDimmed = phase !== "idle";
  const sectionsDimmed = phase === "opening" || phase === "open";
  const authDimmed = authPhase !== "idle";

  const EXPANDED_W = 520;
  const EXPANDED_H = 520;

  // ── Booking card handlers ──
  const handleOpen = () => {
    if (!isNextReady || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setCardRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    setPhase("opening");
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("open")));
  };

  const handleClose = () => {
    setPhase("closing");
    setTimeout(() => { setPhase("idle"); setCardRect(null); }, 480);
  };

  const handleSearch = () => {
    if (!isSearchReady) return;
    navigate("/planet-page", {
      state: { location, arrivalDate, departureDate, guests, guestSize, gravityMin, gravityMax, tempMin, tempMax, atmosphere, budget, allergies },
    });
  };

  // ── Auth modal handlers ──
  const openAuth = () => {
    if (isLoggedIn) return;
    setAuthPhase("entering");
    setAuthState("form");
    requestAnimationFrame(() => requestAnimationFrame(() => setAuthPhase("open")));
  };

  const closeAuth = () => {
    setAuthPhase("leaving");
    setTimeout(() => setAuthPhase("idle"), 450);
  };

  const handleLogin = () => {
    if (!isLoginReady) return;
    setResolvedUsername(getMvpUsername(loginPassword));
    setAuthState("success");
    setTimeout(() => { setIsLoggedIn(true); closeAuth(); }, 900);
  };

  const handleSignup = () => {
    if (!isSignupReady) return;
    setResolvedUsername(getMvpUsername(signupPassword));
    setAuthState("success");
    setTimeout(() => { setIsLoggedIn(true); closeAuth(); }, 900);
  };

  // ── Overlay style (booking card morph) ──
  const getOverlayStyle = (): React.CSSProperties => {
    if (!cardRect) return {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (phase === "opening") return { top: cardRect.top, left: cardRect.left, width: cardRect.width, height: cardRect.height, borderRadius: "24px" };
    if (phase === "closing") return { top: cardRect.top, left: cardRect.left, width: cardRect.width, height: cardRect.height, borderRadius: "24px" };
    return { top: (vh - EXPANDED_H) / 2, left: (vw - EXPANDED_W) / 2, width: EXPANDED_W, height: EXPANDED_H, maxHeight: "85vh", borderRadius: "24px" };
  };

  const atmosphereOptions = ["Oxygen", "Carbon Dioxide", "Dihydrogen Monoxide", "Methane", "Vacuum", "Helium", "Hydrogen"];
  const planetArchetypes = ["Solid", "Liquid", "Gas", "Plasma"];
  const guestSizeOptions = [
    { label: "Small", sublabel: "< 500 cm", value: "small" },
    { label: "Medium", sublabel: "500–2000 cm", value: "medium" },
    { label: "Large", sublabel: "> 2000 cm", value: "large" },
  ];

  const anyDimmed = bookingDimmed || authDimmed;

  return (
    <div className={styles.page}>

      {/* Top Bar */}
      <section className={styles.topBar}>
        <div className={styles.logo}>
          <img src={cometLogo} alt="BOOKING.COMET" className={styles.logoImage} />
        </div>
        {isLoggedIn ? (
          <span className={styles.usernameDisplay}>{resolvedUsername}</span>
        ) : (
          <button className={styles.outlineButton} onClick={openAuth}>
            Log In
          </button>
        )}
      </section>

      {/* Main Content */}
      <section className={`${styles.mainContent} ${sectionsDimmed || authDimmed ? styles.sectionDimmed : ""}`}>
        <h1 className={styles.mainTitle}>BOOKING.COMET</h1>

        <div className={styles.contentRow}>
          <div className={styles.bookingSlot}>
            <div
              ref={cardRef}
              className={`${styles.bookingCard} ${(phase === "open" || phase === "opening") ? styles.bookingCardHidden : ""} ${phase === "closing" ? styles.bookingCardFadingIn : ""}`}
            >
              <h2 className={styles.bookingTitle}>Book a Space</h2>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Galactic Sector"
                  className={styles.bookingInput}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <DatePicker selected={arrivalDate} onChange={(date: SetStateAction<Date | null>) => setArrivalDate(date)} placeholderText="Arrival date" className={styles.bookingInput} portalId="root" />
                <DatePicker selected={departureDate} onChange={(date: SetStateAction<Date | null>) => setDepartureDate(date)} placeholderText="Departure date" className={styles.bookingInput} portalId="root" />
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

          <div className={styles.heroImageWrapper}>
            <img src="/space.jpg" alt="Space" className={styles.heroImage} />
          </div>
        </div>
      </section>

      {/* Shared backdrop — covers both booking and auth */}
      <div
        className={`${styles.backdrop} ${anyDimmed ? styles.backdropVisible : ""}`}
        onClick={bookingDimmed ? handleClose : authDimmed ? closeAuth : undefined}
      />

      {/* ── Booking expanded overlay ── */}
      {phase !== "idle" && cardRect && (
        <div
          className={`${styles.expandedOverlay} ${styles[`expandedOverlay_${phase}`]}`}
          style={getOverlayStyle()}
        >
          <div className={`${styles.expandedInner} ${phase === "open" ? styles.expandedInnerVisible : ""}`}>
            <button className={styles.backButton} onClick={handleClose}>← Back</button>
            <h2 className={styles.bookingTitle}>Your Preferences</h2>
            <div className={styles.summaryPill}>
              <span>📍 {location}</span><span>·</span>
              <span>{arrivalDate?.toLocaleDateString()} → {departureDate?.toLocaleDateString()}</span>
            </div>
            <div className={styles.prefGroup}>
              <label className={styles.prefLabel}>Guests <span className={styles.required}>*</span></label>
              <input type="number" min="1" placeholder="Number of guests" className={`${styles.bookingInput} ${styles.prefInput}`} value={guests} onChange={(e) => setGuests(e.target.value)} />

              <label className={styles.prefLabel}>Guest Size <span className={styles.required}>*</span></label>
              <div className={styles.chipGrid}>
                {guestSizeOptions.map((opt) => (
                  <button key={opt.value} className={`${styles.chip} ${guestSize === opt.value ? styles.chipActive : ""}`} onClick={() => setGuestSize(opt.value)}>
                    {opt.label} <span className={styles.chipSub}>{opt.sublabel}</span>
                  </button>
                ))}
              </div>

              <label className={styles.prefLabel}>Gravity Range (N) <span className={styles.required}>*</span></label>
              <div className={styles.rangeRow}>
                <input type="number" placeholder="Min" className={`${styles.bookingInput} ${styles.rangeInput}`} value={gravityMin} onChange={(e) => setGravityMin(e.target.value)} />
                <span className={styles.rangeDash}>–</span>
                <input type="number" placeholder="Max" className={`${styles.bookingInput} ${styles.rangeInput}`} value={gravityMax} onChange={(e) => setGravityMax(e.target.value)} />
              </div>

              <label className={styles.prefLabel}>Temperature Range (°C) <span className={styles.required}>*</span></label>
              <div className={styles.rangeRow}>
                <input type="number" placeholder="Min" className={`${styles.bookingInput} ${styles.rangeInput}`} value={tempMin} onChange={(e) => setTempMin(e.target.value)} />
                <span className={styles.rangeDash}>–</span>
                <input type="number" placeholder="Max" className={`${styles.bookingInput} ${styles.rangeInput}`} value={tempMax} onChange={(e) => setTempMax(e.target.value)} />
              </div>

              <label className={styles.prefLabel}>Atmosphere <span className={styles.required}>*</span></label>
              <div className={styles.chipGrid}>
                {atmosphereOptions.map((a) => (
                  <button key={a} className={`${styles.chip} ${atmosphere === a ? styles.chipActive : ""}`} onClick={() => setAtmosphere(a)}>{a}</button>
                ))}
              </div>

              <label className={styles.prefLabel}>Planet Archetype <span className={styles.required}>*</span></label>
              <div className={styles.chipGrid}>
                {planetArchetypes.map((b) => (
                  <button key={b} className={`${styles.chip} ${budget === b ? styles.chipActive : ""}`} onClick={() => setBudget(b)}>{b}</button>
                ))}
              </div>

              <label className={styles.prefLabel}>Allergies / Special Notes <span className={styles.optional}>(optional)</span></label>
              <input type="text" placeholder="e.g. sulfur compounds, methane..." className={`${styles.bookingInput} ${styles.prefInput}`} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </div>
            <button className={`${styles.searchButton} ${isSearchReady ? styles.searchButtonReady : ""}`} disabled={!isSearchReady} onClick={handleSearch}>
              🔍 Search spaces
            </button>
          </div>
        </div>
      )}

      {/* ── Auth modal — slides up from bottom ── */}
      {authPhase !== "idle" && (
        <div className={`${styles.authOverlay} ${styles[`authOverlay_${authPhase}`]}`}>

          {/* Success state */}
          <div className={`${styles.authSuccess} ${authState === "success" ? styles.authSuccessVisible : ""}`}>
            <div className={styles.authSuccessIcon}>✦</div>
            <p className={styles.authSuccessText}>Welcome aboard, {resolvedUsername}</p>
          </div>

          {/* Form state */}
          <div className={`${styles.authForm} ${authState === "success" ? styles.authFormHidden : ""}`}>

            {/* Tabs */}
            <div className={styles.authTabs}>
              <button className={`${styles.authTab} ${authTab === "login" ? styles.authTabActive : ""}`} onClick={() => setAuthTab("login")}>Log In</button>
              <button className={`${styles.authTab} ${authTab === "signup" ? styles.authTabActive : ""}`} onClick={() => setAuthTab("signup")}>Sign Up</button>
            </div>

            {/* Login panel */}
            <div className={`${styles.authPanel} ${authTab === "login" ? styles.authPanelVisible : ""}`}>
              <input type="email" placeholder="Email" className={styles.authInput} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <input type="password" placeholder="Password" className={styles.authInput} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} checked={loginRemember} onChange={(e) => setLoginRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button
                className={`${styles.authSubmit} ${isLoginReady ? styles.authSubmitReady : ""}`}
                disabled={!isLoginReady}
                onClick={handleLogin}
              >
                Log In
              </button>
              <p className={styles.authSwitch}>
                Don't have an account?{" "}
                <button className={styles.authSwitchLink} onClick={() => setAuthTab("signup")}>Sign up</button>
              </p>
            </div>

            {/* Signup panel */}
            <div className={`${styles.authPanel} ${authTab === "signup" ? styles.authPanelVisible : ""}`}>
              <input type="text" placeholder="Username" className={styles.authInput} value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
              <input type="email" placeholder="Email" className={styles.authInput} value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              <input type="password" placeholder="Password" className={styles.authInput} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              <input type="password" placeholder="Verify Password" className={`${styles.authInput} ${signupVerify && signupPassword !== signupVerify ? styles.authInputError : ""}`} value={signupVerify} onChange={(e) => setSignupVerify(e.target.value)} />
              <button
                className={`${styles.authSubmit} ${isSignupReady ? styles.authSubmitReady : ""}`}
                disabled={!isSignupReady}
                onClick={handleSignup}
              >
                Register
              </button>
              <p className={styles.authSwitch}>
                Already have an account?{" "}
                <button className={styles.authSwitchLink} onClick={() => setAuthTab("login")}>Log in</button>
              </p>
            </div>

          </div>

          <button className={styles.authClose} onClick={closeAuth}>✕</button>
        </div>
      )}

    </div>
  );
}

export default Home;