import Home         from "./pages/Home";
import APropos      from "./pages/APropos";
import Partenariats from "./pages/Partenariats";
import LiquidMenu   from "./components/LiquidMenu";
import "./styles/global.css";

export default function App() {
  const path = window.location.pathname;
  let Page = Home;
  if (path === "/about" || path === "/a-propos")             Page = APropos;
  else if (path === "/partnerships" || path === "/partenariats") Page = Partenariats;

  return (
    <>
      <Page />
      <LiquidMenu />
    </>
  );
}
