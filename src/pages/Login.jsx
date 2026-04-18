import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { connexion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [afficherMDP, setAfficherMDP] = useState(false)
  const [chargement, setChargement] = useState(false)

  const destination = location.state?.from?.pathname || '/tableau-de-bord'

  async function handleSubmit(e) {
    e.preventDefault()
    setChargement(true)
    try {
      await connexion({ email: form.email, motDePasse: form.motDePasse })
      toast.success('Connexion réussie !')
      navigate(destination, { replace: true })
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        toast.error('Email ou mot de passe incorrect')
      } else if (msg.includes('Email not confirmed')) {
        toast.error('Veuillez confirmer votre email')
      } else {
        toast.error('Erreur : ' + msg)
      }
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-noir-950">
      {/* Panneau gauche décoratif */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-noir-900 to-noir-950">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-or-500/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-or-600/8 rounded-full blur-3xl animate-pulse-glow delay-300" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#f59e0b 1px,transparent 1px),linear-gradient(90deg,#f59e0b 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
        <div className="relative text-center px-12">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8 animate-float">
            <img src="/logo.png" alt="Group Polytech'K" className="w-full h-full object-contain rounded-2xl" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Group Polytech'K</h2>
          <p className="text-noir-400 leading-relaxed max-w-sm mx-auto">
            Développez vos compétences avec des formations vidéo de qualité professionnelle.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['500+', 'Apprenants'], ['50+', 'Formations'], ['100%', 'En ligne']].map(([v, l]) => (
              <div key={l} className="glass px-3 py-4 text-center">
                <div className="text-xl font-black gradient-text">{v}</div>
                <div className="text-noir-500 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
              <img src="/logo.png" alt="Group Polytech'K" className="h-8 w-auto object-contain rounded-md" />
              <span className="font-bold text-white">Group Polytech'<span className="text-or-400">K</span></span>
            </Link>
            <h1 className="text-3xl font-black text-white mb-2">Bon retour 👋</h1>
            <p className="text-noir-400">Connectez-vous pour accéder à vos formations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-noir-300 mb-2">Adresse email</label>
              <input
                type="email" required
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-noir-300 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={afficherMDP ? 'text' : 'password'} required
                  placeholder="••••••••"
                  value={form.motDePasse}
                  onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                  className="input-field pr-12"
                />
                <button type="button" onClick={() => setAfficherMDP(!afficherMDP)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-noir-500 hover:text-white transition-colors">
                  {afficherMDP ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={chargement} className="btn-or w-full justify-center py-3.5 mt-2">
              {chargement ? (
                <div className="w-5 h-5 border-2 border-noir-900/40 border-t-noir-900 rounded-full animate-spin" />
              ) : (
                <><span>Se connecter</span> <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-noir-500 text-sm mt-6">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-or-400 hover:text-or-300 font-semibold transition-colors">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
