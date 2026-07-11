import MotionScene from "../../motion/MotionScene";
import { GOLD, IVORY, IVORY_TEXT, FOREST_TEXT, PACE } from "./aboutTheme";

// Scène mobile "escalier" — seul le bloc TITRE (numéro/kicker/titre) reste
// épinglé pendant que le CONTENU (texte/photo) de la même section défile
// normalement en dessous. Une fois le contenu passé, le titre suivant
// prend le relais à la même position — jamais de carte opaque qui
// recouvre tout, jamais de scroll verrouillé (MotionScene observe via
// IntersectionObserver, voir src/motion/).
export default function AboutMobileSection({ section }) {
  const s = section;
  const kickerColor = s.dark ? "rgba(242,233,216,0.68)" : "rgba(23,48,31,0.62)";
  const titleColor = s.dark ? IVORY : "#17301F";
  const descColor = s.dark ? IVORY_TEXT : FOREST_TEXT;
  const pace = PACE[s.pace] || 1;

  return (
    <MotionScene as="div" className="ms-about-wrap" curtainColor={s.bg} rootMargin="-8% 0px -30% 0px" style={{ background: s.bg }}>
      <div className="ms-about-header">
        <span className="ms-layer ms-layer--icon vision-num">{s.num}</span>
        <span className="ms-layer ms-layer--icon vision-kicker" style={{ color: kickerColor, marginTop: 6, display: "block" }}>
          {s.kicker}
        </span>
        <h1
          className="ms-layer ms-layer--title vision-title"
          style={{ color: titleColor, transitionDuration: `${300 * pace}ms` }}
        >
          {s.title}
        </h1>
        <div className="vision-line ms-layer ms-layer--icon" style={{ background: GOLD }} />
      </div>

      <div className="ms-about-content">
        <p
          className="ms-layer ms-layer--text vision-desc"
          style={{ color: descColor, transitionDuration: `${250 * pace}ms` }}
        >
          {s.desc}
        </p>

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
