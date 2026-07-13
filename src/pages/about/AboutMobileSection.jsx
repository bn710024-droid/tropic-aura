import MotionScene from "../../motion/MotionScene";
import { GOLD, IVORY, IVORY_TEXT, FOREST_TEXT, PACE } from "./aboutTheme";

// Scène mobile — flux de scroll natif continu, JAMAIS de position:sticky
// (l'effet "ça bloque, ça accroche" a été explicitement rejeté : un scroll
// qui semble se figer donne l'impression d'un bug, pas d'un site premium).
// Chaque section se révèle simplement via le rideau + la cascade de
// couches (Motion System) quand elle entre dans le viewport, comme un
// article normal. Seule nuance : en sortie, la photo glisse légèrement de
// côté (pas une simple montée/fondu) pour suggérer que le chapitre suivant
// vient prendre sa place — voir --ms-exit-x dans motionStyles.js.
export default function AboutMobileSection({ section, exitDirection = "left", isFirst = false }) {
  const s = section;
  // SEO : une seule section porte le <h1> de la page (les autres, <h2>) —
  // l'arbre desktop applique la même règle sur sa propre Section 01.
  const TitleTag = isFirst ? "h1" : "h2";
  const kickerColor = s.dark ? "rgba(242,233,216,0.68)" : "rgba(23,48,31,0.62)";
  const titleColor = s.dark ? IVORY : "#17301F";
  const descColor = s.dark ? IVORY_TEXT : FOREST_TEXT;
  const pace = PACE[s.pace] || 1;
  const exitX = exitDirection === "right" ? "32px" : "-32px";

  if (s.type === "quote") {
    return (
      <MotionScene id={`about-${s.id}`} className="ms-about ms-about--quote" curtainColor={s.bg} rootMargin="-8% 0px -20% 0px">
        <div className="ms-about-bg" style={{ background: s.bg }} />
        <p
          className="ms-layer ms-layer--title vision-quote"
          style={{ color: IVORY, transitionDuration: `${300 * pace}ms` }}
        >
          {s.quote}
        </p>
      </MotionScene>
    );
  }

  return (
    <MotionScene id={`about-${s.id}`} className="ms-about" curtainColor={s.bg} rootMargin="-8% 0px -20% 0px" style={{ "--ms-exit-x": exitX }}>
      <div className="ms-about-bg" style={{ background: s.bg }} />

      <div className="ms-about-inner">
        <span className="ms-layer ms-layer--icon vision-num">{s.num}</span>
        <span className="ms-layer ms-layer--icon vision-kicker" style={{ color: kickerColor, marginTop: 6, display: "block" }}>
          {s.kicker}
        </span>
        <TitleTag
          className="ms-layer ms-layer--title vision-title"
          style={{ color: titleColor, transitionDuration: `${300 * pace}ms` }}
        >
          {s.title}
        </TitleTag>
        <div className="vision-line ms-layer ms-layer--icon" style={{ background: GOLD }} />
        <div
          className="ms-layer ms-layer--text vision-desc-group"
          style={{ transitionDuration: `${250 * pace}ms` }}
        >
          {s.desc.map((p, i) => (
            <p
              key={i}
              className={`vision-desc${s.descHighlight === i ? " vision-desc--gold" : ""}`}
              style={s.descHighlight === i ? undefined : { color: descColor }}
            >
              {p}
            </p>
          ))}
        </div>

        {s.checklist && (
          <ul className="vision-checklist" style={{ color: "#17301F" }}>
            {s.checklist.map((item, i) => (
              <li
                key={item}
                className="ms-layer ms-layer--icon"
                style={{ transitionDelay: `${520 + i * 55}ms` }}
              >
                <span className="vision-check">✓</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="ms-layer ms-layer--image ms-about-photo" style={{ transitionDuration: `${500 * pace}ms` }}>
          <div className="vision-photo-frame" style={{ border: s.dark ? "1px solid rgba(201,168,76,0.35)" : "1px solid rgba(23,48,31,0.18)" }}>
            <img
              src={s.photo}
              alt={s.photoAlt}
              className="vision-photo-img ms-ken-burns"
              style={s.photoPosition ? { objectPosition: s.photoPosition } : undefined}
            />
          </div>
        </div>
      </div>
    </MotionScene>
  );
}
