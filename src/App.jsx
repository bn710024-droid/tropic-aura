import Home         from "./pages/Home";
import APropos      from "./pages/APropos";
import Partenariats from "./pages/Partenariats";
import Univers      from "./pages/Univers";
import Produits     from "./pages/Produits";
import Contact      from "./pages/Contact";
import Insights        from "./pages/Insights";
import InsightSenegal from "./pages/InsightSenegal";
import LiquidMenu   from "./components/LiquidMenu";
import Footer       from "./components/Footer";
import "./styles/global.css";

export default function App() {
  const path = window.location.pathname;
  let Page = Home;
  if (path === "/about" || path === "/a-propos")                 Page = APropos;
  else if (path === "/partnerships" || path === "/partenariats") Page = Partenariats;
  else if (path === "/univers" || path === "/notre-univers")     Page = Univers;
  else if (path === "/produits" || path === "/products")         Page = Produits;
  else if (path === "/contact")                                  Page = Contact;
  else if (path === "/insights")                                              Page = Insights;
  else if (path === "/insights/senegal-origine-strategique")                 Page = InsightSenegal;

  const isArticle = path.startsWith("/insights/");

  return (
    <>
      <Page />
      {!isArticle && <Footer />}
      {!isArticle && <LiquidMenu />}
    </>
  );
}
