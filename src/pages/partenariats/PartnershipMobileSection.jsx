import MotionScene from "../../motion/MotionScene";
import PartnershipTimeline from "../../components/PartnershipTimeline";
import ConclusionConstellation from "./ConclusionConstellation";
import { ICONS } from "./icons";

// Scène mobile Partenariats — même philosophie que la page À Propos : flux
// de scroll natif continu, jamais de position:sticky, jamais de scroll
// verrouillé. Chaque section se révèle via le rideau + la cascade de
// couches (Motion System) quand elle entre dans le viewport.
export default function PartnershipMobileSection({ section }) {
  const s = section;

  if (s.type === "hero") {
    return (
      <MotionScene id={`partner-${s.id}`} as="div" className="pm-hero" rootMargin="-5% 0px -20% 0px">
        <img src={s.photo} alt={s.photoAlt} className="pm-hero-photo ms-ken-burns" />
        <div className="pm-hero-overlay" />
        <div className="pm-hero-text">
          <h1 className="ms-layer ms-layer--title pm-hero-title">{s.title}</h1>
          <p className="ms-layer ms-layer--text pm-hero-subtitle" style={{ transitionDelay: "260ms" }}>{s.subtitle}</p>
          <div className="ms-layer ms-layer--icon pm-hero-hint" style={{ transitionDelay: "380ms" }}>
            <span>Défiler pour découvrir</span><span className="pm-hero-hint-arrow">↓</span>
          </div>
        </div>
      </MotionScene>
    );
  }

  if (s.type === "vision") {
    return (
      <MotionScene id={`partner-${s.id}`} className="pm-section" curtainColor={s.bg} rootMargin="-8% 0px -20% 0px">
        <div className="pm-bg" style={{ background: s.bg }} />
        <div className="pm-inner">
          <span className="ms-layer ms-layer--icon pm-kicker">{s.kicker}</span>
          <p className="ms-layer ms-layer--title pm-statement">{s.statement}</p>
          <div className="ms-layer ms-layer--text pm-vision-actions" style={{ transitionDelay: "180ms" }}>
            {s.actions.map((a, i) => {
              const Icon = ICONS[a.icon];
              return (
                <div key={i} className="pm-action">
                  <span className="pm-action-icon"><Icon /></span>
                  <div>
                    <p className="pm-action-title">{a.title}</p>
                    <p className="pm-action-text">{a.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </MotionScene>
    );
  }

  if (s.type === "timeline") {
    return (
      <MotionScene id={`partner-${s.id}`} className="pm-section" curtainColor={s.bg} rootMargin="-8% 0px -15% 0px">
        <div className="pm-bg" style={{ background: s.bg }} />
        <div className="pm-inner">
          <span className="ms-layer ms-layer--icon pm-kicker">{s.kicker}</span>
          <h2 className="ms-layer ms-layer--title pm-title">{s.title}</h2>
          <div className="ms-layer ms-layer--image pm-timeline-wrap" style={{ transitionDelay: "160ms" }}>
            <PartnershipTimeline />
          </div>
        </div>
      </MotionScene>
    );
  }

  if (s.type === "photo") {
    const Icon = ICONS[s.icon];
    return (
      <MotionScene id={`partner-${s.id}`} className="pm-section" curtainColor={s.bg} rootMargin="-8% 0px -15% 0px">
        <div className="pm-bg" style={{ background: s.bg }} />
        <div className="pm-inner">
          <h2 className="ms-layer ms-layer--title pm-photo-title">{s.title}</h2>
          <div className="ms-layer ms-layer--text pm-photo-paragraphs" style={{ transitionDelay: "100ms" }}>
            {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="ms-layer ms-layer--image pm-photo-frame" style={{ transitionDelay: "200ms" }}>
            <img src={s.photo} alt={s.photoAlt} className="pm-photo-frame-img ms-ken-burns" />
          </div>
        </div>
      </MotionScene>
    );
  }

  // conclusion
  return (
    <MotionScene id={`partner-${s.id}`} className="pm-section pm-conclusion" curtainColor={s.bg} rootMargin="-8% 0px -15% 0px">
      <div className="pm-bg" style={{ background: s.bg }} />
      <ConclusionConstellation />
      <div className="pm-inner pm-inner--center">
        {s.paragraphs.map((p, i) => (
          <p key={i} className="ms-layer ms-layer--title pm-conclusion-text" style={{ transitionDelay: `${i * 120}ms` }}>{p}</p>
        ))}
        <a href={s.buttonHref} className="ms-layer ms-layer--icon pm-button" style={{ transitionDelay: "300ms" }}>
          {s.button} <span>→</span>
        </a>
      </div>
    </MotionScene>
  );
}
