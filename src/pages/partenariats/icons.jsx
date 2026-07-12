// Icônes ligne fine (trait doré), même esprit que les puces ✓ de la page
// À Propos — jamais d'émoji, jamais de pictogramme plein.
const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconTeam() {
  return (
    <svg {...common}>
      <circle cx="8.5" cy="8" r="2.6" />
      <circle cx="16" cy="9" r="2" />
      <path d="M3.5 19c.5-3 2.5-4.6 5-4.6s4.5 1.6 5 4.6" />
      <path d="M14.5 14.8c2 .2 3.5 1.7 4 4.2" />
    </svg>
  );
}

export function IconBox() {
  return (
    <svg {...common}>
      <path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" />
      <path d="M3.5 8v8L12 20l8.5-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

export function IconTruck() {
  return (
    <svg {...common}>
      <path d="M3 7h10v9H3z" />
      <path d="M13 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  );
}

export function IconLeaf() {
  return (
    <svg {...common}>
      <path d="M5 19c-1-6.5 2.5-13 14-14-.8 11.5-7.5 14-14 14Z" />
      <path d="M5 19c3-4 6-7 11.5-11.5" />
    </svg>
  );
}

export const ICONS = { team: IconTeam, box: IconBox, truck: IconTruck, leaf: IconLeaf };
