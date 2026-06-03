import './Footer.css'

const MARKETS  = ['Pays-Bas', 'Belgique', 'France', 'Allemagne']
const INCOTERMS = ['FOB Dakar', 'FAS Dakar', 'Export B2B', 'Port Autonome de Dakar']

const LINKS = [
  { label: 'Mentions légales',    href: '#' },
  { label: 'Politique de confidentialité', href: '#' },
  { label: 'Contact',             href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="footer" id="contact">

      {/* Logo */}
      <div className="footer__logo">TROPIC-AURA</div>
      <p className="footer__slogan">Connecting Tropical Lands and Global Markets</p>

      {/* Info grid */}
      <div className="footer__grid">
        <div className="footer__col">
          <p className="footer__col-title">Marchés desservis</p>
          {MARKETS.map((m) => <p key={m}>{m}</p>)}
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Logistique</p>
          <p>Port Autonome de Dakar</p>
          <p>FOB / FAS</p>
          <p>Reefer &amp; Air Freight</p>
          <p>Conteneurs réfrigérés</p>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Liens utiles</p>
          {LINKS.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
        </div>
      </div>

      {/* Badges Incoterms */}
      <div className="footer__badges">
        {INCOTERMS.map((t) => (
          <span key={t} className="footer__badge">{t}</span>
        ))}
      </div>

      <div className="footer__sep" />

      <p className="footer__copy">
        © 2025 Tropic-Aura B.C. — Tous droits réservés.
        Fondée par Babacar Niang. Sénégal, Afrique de l&apos;Ouest.
      </p>
    </footer>
  )
}
