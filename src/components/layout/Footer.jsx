import { Link } from 'react-router-dom'
import { Mail, Phone, ArrowUpRight, MapPin } from 'lucide-react'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'Mes formations', to: '/tableau-de-bord' },
]

const payments = [
  { label: 'Orange Money', color: '#ff6600', bg: 'rgba(255,102,0,0.08)', border: 'rgba(255,102,0,0.2)' },
  { label: 'Wave', color: '#1ba8e0', bg: 'rgba(27,168,224,0.08)', border: 'rgba(27,168,224,0.2)' },
  { label: 'Visa', color: '#4f46e5', bg: 'rgba(79,70,229,0.08)', border: 'rgba(79,70,229,0.2)' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#020202', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 80 }}>
      {/* Gold divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 60, paddingBottom: 32 }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* Brand — 5 cols */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-5 group" style={{ width: 'fit-content' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, overflow: 'hidden',
                border: '1px solid rgba(245,158,11,0.15)',
                boxShadow: '0 0 20px rgba(245,158,11,0.06)',
                transition: 'border-color 0.3s',
              }}>
                <img src="/logo.png" alt="Group Polytech'K" className="w-full h-full object-contain" />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'white' }}>
                  Group Polytech'
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--gold)' }}>K</span>
              </div>
            </Link>

            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 300, marginBottom: 20 }}>
              La plateforme de référence pour la formation professionnelle en Afrique de l'Ouest. Apprenez à votre rythme, progressez à vie.
            </p>

            <div className="flex items-center gap-2">
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.5)' }}
                className="animate-pulse" />
              <span style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 500 }}>Plateforme en ligne 24h/24</span>
            </div>
          </div>

          {/* Navigation — 3 cols */}
          <div className="md:col-span-3">
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', transition: 'color 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
                    className="group"
                  >
                    <ArrowUpRight style={{ width: 12, height: 12, opacity: 0, transition: 'opacity 0.2s, transform 0.2s', transform: 'translate(-2px, 2px)' }}
                      className="group-hover:opacity-100" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — 4 cols */}
          <div className="md:col-span-4">
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <ContactItem icon={<Mail style={{ width: 14, height: 14 }} />} label="contact@groupportecheck.com" href="mailto:contact@groupportecheck.com" />
              <ContactItem icon={<Phone style={{ width: 14, height: 14 }} />} label="+225 07 00 00 00 00" />
              <ContactItem icon={<MapPin style={{ width: 14, height: 14 }} />} label="Côte d'Ivoire, Afrique de l'Ouest" />
            </div>

            <div>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                Paiements acceptés
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {payments.map(({ label, color, bg, border }) => (
                  <span key={label} style={{
                    padding: '4px 12px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600,
                    color, background: bg, border: `1px solid ${border}`,
                  }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} Group Polytech'K. Tous droits réservés.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.78rem' }}>
            Paiement sécurisé via{' '}
            <span style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>FedaPay</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function ContactItem({ icon, label, href }) {
  const inner = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: href ? 'pointer' : 'default' }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gold)',
      }}>
        {icon}
      </div>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', transition: 'color 0.2s' }}>
        {label}
      </span>
    </div>
  )

  return href
    ? <a href={href} style={{ textDecoration: 'none' }}
        onMouseEnter={e => e.currentTarget.querySelector('span').style.color = 'white'}
        onMouseLeave={e => e.currentTarget.querySelector('span').style.color = 'rgba(255,255,255,0.3)'}
      >{inner}</a>
    : inner
}
