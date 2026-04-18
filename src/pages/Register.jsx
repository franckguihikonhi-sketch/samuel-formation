import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { inscription } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nomComplet: '', email: '', motDePasse: '', confirmation: '' })
  const [afficherMDP, setAfficherMDP] = useState(false)
  const [chargement, setChargement] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.motDePasse !== form.confirmation) { toast.error('Les mots de passe ne correspondent pas'); return }
    if (form.motDePasse.length < 6) { toast.error('Minimum 6 caractères'); return }
    setChargement(true)
    try {
      await inscription({ email: form.email, motDePasse: form.motDePasse, nomComplet: form.nomComplet })
      toast.success('Compte créé avec succès !')
      navigate('/connexion')
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'inscription')
    } finally {
      setChargement(false)
    }
  }

  const avantages = [
    'Accès à vie après paiement unique',
    'Téléchargement des vidéos inclus',
    'Paiement Mobile Money & Visa',
    'Nouvelles formations chaque mois',
  ]

  return (
    <div className="min-h-screen flex bg-noir-950">
      {/* Panneau gauche */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-noir-900 to-noir-950">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-or-500/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-or-600/8 rounded-full blur-3xl animate-pulse-glow delay-300" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#f59e0b 1px,transparent 1px),linear-gradient(90deg,#f59e0b 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
        <div className="relative px-12">
          <div className="w-20 h-20 flex items-center justify-center mb-8">
            <img src="/logo.png" alt="Group Polytech'K" className="w-full h-full object-contain rounded-2xl" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Rejoignez-nous</h2>
          <p className="text-noir-400 mb-10">Commencez votre parcours d'apprentissage dès aujourd'hui.</p>
          <ul className="space-y-4">
            {avantages.map((av) => (
              <li key={av} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-or-500/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-or-400" />
                </div>
                <span className="text-noir-300 text-sm">{av}</span>
              </li>
            ))}
          </ul>
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
            <h1 className="text-3xl font-black text-white mb-2">Créer un compte</h1>
            <p className="text-noir-400">Gratuit et sans engagement</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-noir-300 mb-2">Nom complet</label>
              <input type="text" required placeholder="Jean Dupont"
                value={form.nomComplet}
                onChange={(e) => setForm({ ...form, nomComplet: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-noir-300 mb-2">Adresse email</label>
              <input type="email" required placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-noir-300 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={afficherMDP ? 'text' : 'password'} required
                  placeholder="Minimum 6 caractères"
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
            <div>
              <label className="block text-sm font-medium text-noir-300 mb-2">Confirmer le mot de passe</label>
              <input type="password" required placeholder="••••••••"
                value={form.confirmation}
                onChange={(e) => setForm({ ...form, confirmation: e.target.value })}
                className="input-field" />
            </div>

            <button type="submit" disabled={chargement} className="btn-or w-full justify-center py-3.5 mt-2">
              {chargement ? (
                <div className="w-5 h-5 border-2 border-noir-900/40 border-t-noir-900 rounded-full animate-spin" />
              ) : (
                <><span>Créer mon compte</span> <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-noir-500 text-sm mt-6">
            Déjà un compte ?{' '}
            <Link to="/connexion" className="text-or-400 hover:text-or-300 font-semibold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
