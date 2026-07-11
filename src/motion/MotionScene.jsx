import { useRef } from "react";
import { useSceneTrigger } from "./useSceneTrigger";

// Motion System Tropicaura — enveloppe de scène mobile ("page turn").
//
// Usage :
//   <MotionScene curtainColor="#0B0F0A">
//     <div className="ms-layer ms-layer--bg">...</div>
//     <h1 className="ms-layer ms-layer--title">...</h1>
//     <p  className="ms-layer ms-layer--text">...</p>
//     <div className="ms-layer ms-layer--image"><img className="ms-ken-burns" .../></div>
//     <span className="ms-layer ms-layer--icon">...</span>
//   </MotionScene>
//
// Ne verrouille jamais le scroll natif : la scène observe simplement sa
// position via IntersectionObserver (useSceneTrigger) et joue sa propre
// entrée/sortie à durée fixe une fois déclenchée. Voir motionStyles.js
// pour le contrat de classes complet et motionTokens.js pour le rythme.
export default function MotionScene({ children, className = "", curtainColor, rootMargin, as: Tag = "section", style }) {
  const ref = useRef(null);
  const phase = useSceneTrigger(ref, rootMargin ? { rootMargin } : undefined);

  const mergedStyle = curtainColor || style
    ? { ...(curtainColor ? { "--ms-curtain-color": curtainColor } : null), ...style }
    : undefined;

  return (
    <Tag
      ref={ref}
      className={`motion-scene ${className}`}
      data-phase={phase}
      style={mergedStyle}
    >
      <div className="ms-curtain" />
      {children}
    </Tag>
  );
}
