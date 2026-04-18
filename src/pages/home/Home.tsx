import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Home.module.css";

function Home() {
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <section className={styles.topBar}>
        <div className={styles.logo}>
          <div className={styles.logoDot} />
          <span>Logo</span>
        </div>
        
        <a href="/" className={styles.outlineButton}>
          Get Started
        </a>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        {/* NEW: Title added here at the top */}
        <h1 className={styles.mainTitle}>BOOKING.COMET</h1>
        
        {/* NEW: Wrapper to keep the card and image side-by-side */}
        <div className={styles.contentRow}>
          
          {/* Book a space card slot */}
          <div className={styles.bookingSlot}>
            <div className={styles.bookingCard}>
              <h2 className={styles.bookingTitle}>Book a space</h2>
              
              <div className={styles.inputGroup}>
                <input type="text" placeholder="Location" className={styles.bookingInput} />
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

              {/* UPDATED: Next Button */}
              <button className={styles.nextButton}>
                Next &gt;
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className={styles.heroImageWrapper}>
            <img
              src="/space.jpg"
              alt="Space"
              className={styles.heroImage}
            />
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBar} />
      </footer>
    </div>
  );
}

export default Home;