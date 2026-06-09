import Home         from "./pages/Home";
import APropos      from "./pages/APropos";
import Partenariats from "./pages/Partenariats";
import "./styles/global.css";

export default function App() {
  const path = window.location.pathname;
  if (path === "/about" || path === "/a-propos")           return <APropos />;
  if (path === "/partnerships" || path === "/partenariats") return <Partenariats />;
  return <Home />;
}
