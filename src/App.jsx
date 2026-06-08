import Home from "./pages/Home";
import About from "./pages/About";
import "./styles/global.css";

export default function App() {
  const path = window.location.pathname;
  if (path === "/about") return <About />;
  return <Home />;
}
