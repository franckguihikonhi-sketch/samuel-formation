import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Header() {
  const { utilisateur, profil, estAdmin, deconnexion } = useAuth()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOuvert(false)
    setMenuUser(false)
  }, [location.pathname])

  async function handleDeconnexion() {
    await deconnexion()
    toast.success('À bientôt !')
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/catalogue', label: 'Catalogue' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-noir-950/95 backdrop-blur-xl border-b border-white/5 shadow-2xl'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Group Polytech'K"
              className="h-10 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
            <div className="leading-none">
              <span className="font-bold text-white text-base">Group Polytech'</span>
              <span className="font-bold text-or-400 text-base">K</span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === to
                    ? 'text-or-400 bg-or-500/10'
                    : 'text-noir-300 hover:text-white hover:bg-white/5'
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-3">
            {utilisateur ? (
              <div className="relative">
                <button
                  onClick={() => setMenuUser(!menuUser)}
                  className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-all"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-or-400 to-or-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-noir-900">
                      {profil?.full_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {profil?.full_name?.split(' ')[0] || 'Mon compte'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-noir-400 transition-transform ${menuUser ? 'rotate-180' : ''}`} />
                </button>

                {menuUser && (
                  <div className="absolute right-0 mt-2 w-56 bg-noir-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs text-noir-400">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-white truncate">{profil?.full_name}</p>
                    </div>
                    <div className="p-1.5">
                      <Link to="/tableau-de-bord"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-noir-200 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                        <LayoutDashboard className="w-4 h-4 text-noir-400" /> Mes formations
                      </Link>
                      {estAdmin && (
                        <Link to="/admin"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-or-400 hover:bg-or-500/10 rounded-xl transition-all">
                          <ShieldCheck className="w-4 h-4" /> Administration
                        </Link>
                      )}
                      <button onClick={handleDeconnexion}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/connexion"
                  className="text-noir-300 hover:text-white text-sm font-medium transition-colors px-3 py-2">
                  Connexion
                </Link>
                <Link to="/inscription" className="btn-or text-sm py-2.5 px-5">
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <button
            onClick={() => setMenuOuvert(!menuOuvert)}
            className="md:hidden w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl border border-white/10"
          >
            {menuOuvert ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className="md:hidden border-t border-white/5 bg-noir-950/98 backdrop-blur-xl px-4 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className="block px-4 py-2.5 rounded-xl text-noir-200 hover:bg-white/5 hover:text-white transition-all text-sm">
              {label}
            </Link>
          ))}
          <div className="border-t border-white/5 pt-3 mt-3 space-y-1">
            {utilisateur ? (
              <>
                <Link to="/tableau-de-bord" className="block px-4 py-2.5 rounded-xl text-noir-200 hover:bg-white/5 text-sm">
                  Mes formations
                </Link>
                {estAdmin && (
                  <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-or-400 hover:bg-or-500/10 text-sm">
                    Administration
                  </Link>
                )}
                <button onClick={handleDeconnexion}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-sm">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="block px-4 py-2.5 rounded-xl text-noir-200 hover:bg-white/5 text-sm">
                  Connexion
                </Link>
                <Link to="/inscription" className="btn-or w-full justify-center text-sm">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
