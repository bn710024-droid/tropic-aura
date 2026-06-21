import Home         from "./pages/Home";
import APropos      from "./pages/APropos";
import Partenariats from "./pages/Partenariats";
import Univers      from "./pages/Univers";
import Produits     from "./pages/Produits";
import Contact      from "./pages/Contact";
import LiquidMenu   from "./components/LiquidMenu";
import "./styles/global.css";

export default function App() {
  const path = window.location.pathname;
  let Page = Home;
  if (path === "/about" || path === "/a-propos")             Page = APropos;
  else if (path === "/partnerships" || path === "/partenariats") Page = Partenariats;
  else if (path === "/univers" || path === "/notre-univers")    Page = Univers;
  else if (path === "/produits" || path === "/products")        Page = Produits;
  else if (path === "/contact")                                 Page = Contact;

  return (
    <>
      <Page />
      <LiquidMenu />
    </>
  );
}
