import { Routes, Route } from "react-router";
import Home from "./pages/home/Home";
import PlanetPage from "./pages/planet-page/PlanetPage";

// Defines which URL path corresponds to which page component.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/planet-page" element={<PlanetPage />} />
    </Routes>
  );
}

export default App;
