// Icônes ligne fine (trait doré), même esprit que src/pages/partenariats/icons.jsx —
// jamais d'émoji, jamais de pictogramme plein. Utilisées par Quality.jsx et Logistics.jsx.
const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconShield() {
  return (
    <svg {...common}>
      <path d="M12 3.5 19 6.5v5.2c0 4.5-3 7.6-7 8.8-4-1.2-7-4.3-7-8.8V6.5Z" />
      <path d="M8.8 12.2 11 14.4l4.2-4.6" />
    </svg>
  );
}

export function IconMagnifier() {
  return (
    <svg {...common}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 20 20" />
    </svg>
  );
}

export function IconCertificate() {
  return (
    <svg {...common}>
      <rect x="3.5" y="4" width="17" height="12.5" rx="1.5" />
      <path d="M7 8.5h10M7 11.5h7" />
      <path d="M9.5 16.5v4l2.5-1.5 2.5 1.5v-4" />
    </svg>
  );
}

export function IconThermometer() {
  return (
    <svg {...common}>
      <path d="M12 3.5v11.8" />
      <circle cx="12" cy="17.5" r="2.8" />
      <path d="M9.7 6.2h4.6" />
    </svg>
  );
}

export function IconTag() {
  return (
    <svg {...common}>
      <path d="M12.5 3.5H6a1 1 0 0 0-1 1V11l9.5 9.5a1 1 0 0 0 1.4 0l5.1-5.1a1 1 0 0 0 0-1.4L12.5 3.5Z" />
      <circle cx="9" cy="8" r="1.4" />
    </svg>
  );
}

export function IconDocument() {
  return (
    <svg {...common}>
      <path d="M6.5 3.5h8l3 3v14a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Z" />
      <path d="M14 3.5v3.5h3.5" />
      <path d="M9 12h6M9 15.3h6" />
    </svg>
  );
}

export function IconShip() {
  return (
    <svg {...common}>
      <path d="M4 15.5 3 12h18l-1 3.5" />
      <path d="M6 12V7h5l3 5" />
      <path d="M12 7V3.5" />
      <path d="M4.5 18.5c1.3 1 3.2 1 4.5 0 1.3 1 3.2 1 4.5 0 1.3 1 3.2 1 4.5 0" />
    </svg>
  );
}

export function IconPlane() {
  return (
    <svg {...common}>
      <path d="M12 3.5v14.8" />
      <path d="M4 10.5l8-2.2 8 2.2" />
      <path d="M9 18.3l3-1.2 3 1.2" />
    </svg>
  );
}

export function IconClock() {
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  );
}

export function IconHandshake() {
  return (
    <svg {...common}>
      <path d="M3.5 12.5 7 9l3 2 3-2 3.5 3.5" />
      <path d="M7 9v6l2.5 2.5" />
      <path d="M17 9.5v6l-2.5 2.5" />
      <path d="M10 15l1.5 1.5c.6.6 1.6.6 2.2 0" />
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
