import styles from "./PlanetPage.module.css";

type FilterChip = {
  label: string;
  value: string;
};

type PlanetCard = {
  id: number;
  title: string;
};

const filters: FilterChip[] = [
  { label: "Location:", value: "Grafton, Auckland" },
  { label: "Duration:", value: "Tue 19th - Wed 2nd May" },
  { label: "People:", value: "2 Adults - 3 Children - 1 Room" },
];

const planetCards: PlanetCard[] = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: "Planet: Mars - Compatibility: 65% - Price: $1255/night",
}));

function PlanetPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.logoWrap}>
            <span className={styles.logoIcon} aria-hidden="true" />
            <span className={styles.logoText}>Logo</span>
          </div>

          <div className={styles.profilePill} aria-hidden="true" />
        </header>

        <section className={styles.searchBar} aria-label="Planet search filters">
          {filters.map((filter) => (
            <div key={filter.label} className={styles.filterChip}>
              <span className={styles.filterDot} aria-hidden="true" />
              <p className={styles.filterText}>
                <span className={styles.filterLabel}>{filter.label}</span>
                <span>{filter.value}</span>
              </p>
            </div>
          ))}

          <button type="button" className={styles.searchButton}>
            Search
          </button>
        </section>

        <section className={styles.cardGrid} aria-label="Available planets">
          {planetCards.map((planet) => (
            <article key={planet.id} className={styles.card}>
              <div className={styles.imageFrame}>
                <div className={styles.planetArt} aria-hidden="true" />
                <button type="button" className={styles.detailsButton}>
                  Details
                </button>
              </div>

              <p className={styles.cardText}>{planet.title}</p>
            </article>
          ))}
        </section>
      </div>

      <div className={styles.footerBar} aria-hidden="true" />
    </main>
  );
}

export default PlanetPage;
