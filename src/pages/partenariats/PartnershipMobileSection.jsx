import MotionScene from "../../motion/MotionScene";
import PartnershipTimeline from "../../components/PartnershipTimeline";

// Scène mobile Partenariats — même philosophie que la page À Propos : flux
// de scroll natif continu, jamais de position:sticky, jamais de scroll
// verrouillé. Chaque section se révèle via le rideau + la cascade de
// couches (Motion System) quand elle entre dans le viewport.
export default function PartnershipMobileSection({ section }) {
  const s = section;

  if (s.type === "hero") {
    return (
      <MotionScene as="div" className="pm-hero" rootMargin="-5% 0px -20% 0px">
        <img src={s.photo} alt={s.photoAlt} className="pm-hero-photo ms-ken-burns" />
        <div className="pm-hero-overlay" />
        <div className="pm-hero-text">
          <h1 className="ms-layer ms-layer--title pm-hero-title">{s.title}</h1>
          <p className="ms-layer ms-layer--text pm-hero-subtitle" style={{ transitionDelay: "260ms" }}>{s.subtitle}</p>
        </div>
      </MotionScene>
    );
  }

  if (s.type === "vision") {
    return (
      <MotionScene className="pm-section" curtainColor={s.bg} rootMargin="-8% 0px -20% 0px">
        <div className="pm-bg" style={{ background: s.bg }} />
        <div className="pm-inner">
          <span className="ms-layer ms-layer--icon pm-kicker">{s.kicker}</span>
          <div className="ms-layer ms-layer--title pm-statements">
            {s.statements.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="ms-layer ms-layer--text pm-paragraphs" style={{ transitionDelay: "180ms" }}>
            {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </MotionScene>
    );
  }

  if (s.type === "timeline") {
    return (
      <MotionScene className="pm-section" curtainColor={s.bg} rootMargin="-8% 0px -15% 0px">
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
    return (
      <MotionScene as="div" className="pm-photo-section" rootMargin="-5% 0px -20% 0px">
        <img src={s.photo} alt={s.photoAlt} className="pm-photo-img ms-ken-burns" />
        <div className="pm-hero-overlay" />
        <div className="pm-photo-text">
          {s.paragraphs.map((p, i) => (
            <p key={i} className="ms-layer ms-layer--text" style={{ transitionDelay: `${i * 120}ms` }}>{p}</p>
          ))}
        </div>
      </MotionScene>
    );
  }

  // conclusion
  return (
    <MotionScene className="pm-section pm-conclusion" curtainColor={s.bg} rootMargin="-8% 0px -15% 0px">
      <div className="pm-bg" style={{ background: s.bg }} />
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
