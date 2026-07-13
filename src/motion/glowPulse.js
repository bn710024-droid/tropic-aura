// Motion System Tropicaura — halo doré au survol (boutons CTA).
// Léger, jamais un gros box-shadow animé en boucle — juste une réponse au
// survol, immédiate et discrète.
export function buildGlowPulseCSS(className = "ms-glow") {
  return `
    .${className} {
      position: relative;
      transition: box-shadow 320ms ease-out, transform 320ms ease-out;
    }
    .${className}:hover,
    .${className}:focus-visible {
      box-shadow: 0 0 0 1px rgba(201,168,76,0.5), 0 8px 28px rgba(201,168,76,0.25);
      transform: translateY(-1px);
    }
  `;
}
