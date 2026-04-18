import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Home.module.css";
import Header from "../../components/Header";

function Home() {
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <Header/>

      {/* Main Content */}
      <section className={styles.mainContent}>
        {/* Book a space card slot */}
        <div className={styles.bookingSlot}>
          <div className={styles.bookingCard}>
            <h2 className={styles.bookingTitle}>Book a space</h2>
            
            <div className={styles.inputGroup}>
              <DatePicker
                selected={arrivalDate}
                onChange={(date) => setArrivalDate(date)}
                placeholderText="Arrival date"
                className={styles.bookingInput}
              />
              <DatePicker
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                placeholderText="Departure date"
                className={styles.bookingInput}
              />
              <input type="text" placeholder="Location" className={styles.bookingInput} />
            </div>

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
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBar} />
      </footer>
    </div>
  );
}

export default Home;