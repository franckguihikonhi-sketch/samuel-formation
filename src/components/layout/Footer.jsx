import { Link } from 'react-router-dom'
import { Mail, Phone, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-noir-950 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <img src="/logo.png" alt="Group Polytech'K" className="h-10 w-auto object-contain rounded-lg" />
              <span className="font-bold text-lg text-white">Group Polytech'<span className="text-or-400">K</span></span>
            </Link>
            <p className="text-noir-500 text-sm leading-relaxed max-w-xs">
              La plateforme de référence pour la formation professionnelle en ligne en Afrique de l'Ouest.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Plateforme en ligne</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', to: '/' },
                { label: 'Catalogue des formations', to: '/catalogue' },
                { label: 'Mon espace', to: '/tableau-de-bord' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}
                    className="flex items-center gap-1.5 text-noir-500 hover:text-or-400 text-sm transition-colors group">
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contact@samuel-formation.com"
                  className="flex items-center gap-3 text-noir-500 hover:text-white text-sm transition-colors group">
                  <div className="w-8 h-8 bg-or-500/10 rounded-lg flex items-center justify-center group-hover:bg-or-500/20 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-or-400" />
                  </div>
                  contact@samuel-formation.com
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-noir-500 text-sm">
                  <div className="w-8 h-8 bg-or-500/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-or-400" />
                  </div>
                  +225 07 00 00 00 00
                </div>
              </li>
            </ul>

            {/* Paiements acceptés */}
            <div className="mt-6">
              <p className="text-noir-600 text-xs mb-3 uppercase tracking-wider">Paiements acceptés</p>
              <div className="flex items-center gap-2">
                {['Orange Money', 'Wave', 'Visa'].map((p) => (
                  <span key={p}
                    className="bg-noir-800 border border-white/5 text-noir-400 text-xs px-2.5 py-1 rounded-lg font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-noir-600 text-xs">
            © {new Date().getFullYear()} Group Polytech'K. Tous droits réservés.
          </p>
          <p className="text-noir-600 text-xs">
            Paiement sécurisé via <span className="text-or-600 font-semibold">CinetPay</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
