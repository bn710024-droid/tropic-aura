import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FruitsExotiques from "./pages/FruitsExotiques";
import AvocatsAgrumes from "./pages/AvocatsAgrumes";
import PrimeursAfrique from "./pages/PrimeursAfrique";
import NotreHistoire from "./pages/NotreHistoire";
import "./styles/global.css";

// ============================================================
//  Routeur principal Tropic-Aura
//  4 routes uniques + accueil — zéro répétition.
// ============================================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gamme/fruits-exotiques" element={<FruitsExotiques />} />
        <Route path="/gamme/avocats-agrumes" element={<AvocatsAgrumes />} />
        <Route path="/gamme/primeurs-afrique" element={<PrimeursAfrique />} />
        <Route path="/notre-histoire" element={<NotreHistoire />} />
      </Routes>
    </BrowserRouter>
  );
}
