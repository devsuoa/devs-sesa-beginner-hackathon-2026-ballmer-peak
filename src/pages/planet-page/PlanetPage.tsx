import { useState } from "react";
import Button from "../../components/button/Button";
import styles from "./PlanetPage.module.css";

type Planet = {
  name: string;
};

const planets: Planet[] = [
  { name: "Mercury" },
  { name: "Venus" },
  { name: "Earth" },
  { name: "Mars" },
  { name: "Jupiter" },
  { name: "Saturn" },
  { name: "Uranus" },
  { name: "Neptune" },
];

function PlanetPage() {
  const [selected, setSelected] = useState<string>("");

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Planet Selector</h1>

      <p className={styles.subtitle}>
        Click a planet to view its selection.
      </p>

      <div className={styles.content}>
        {/* LEFT PANEL */}
        <div className={styles.panel}>
          <h2>Planets</h2>

          <div className={styles.grid}>
            {planets.map((planet) => (
              <button
                key={planet.name}
                className={styles.planetButton}
                onClick={() => setSelected(`You selected ${planet.name}`)}
              >
                {planet.name}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.panel}>
          <h2>Display</h2>

          <div className={styles.displayBox}>
            {selected ? (
              <p>{selected}</p>
            ) : (
              <p className={styles.placeholder}>
                Click a planet to see details
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.centered}>
        <Button text="Back to Home" to="/" />
      </div>
    </div>
  );
}

export default PlanetPage;