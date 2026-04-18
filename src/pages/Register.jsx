import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const avantages = [
  'Accès à vie après paiement unique',
  'Téléchargement des vidéos inclus',
  'Orange Money, Wave & Carte Visa',
  'Nouvelles formations chaque mois',
]

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
      const data = await inscription({ email: form.email, motDePasse: form.motDePasse, nomComplet: form.nomComplet })
      if (data?.session) {
        toast.success('Compte créé avec succès !')
        navigate('/tableau-de-bord')
      } else {
        toast.success('Compte créé ! Vérifiez votre email pour confirmer votre inscription.')
        navigate('/connexion')
      }
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'inscription")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--obsidian)' }}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #0a0a0a 0%, #060606 100%)' }}>

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '30%', right: '20%',
            width: 450, height: 450, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '15%', left: '15%',
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,83,9,0.05) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.025,
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.6) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, #060606 100%)',
          }} />
        </div>

        <div className="relative px-14 anim-fade-up">
          <div style={{ marginBottom: 32 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20, overflow: 'hidden',
              border: '1px solid rgba(245,158,11,0.2)',
              boxShadow: '0 0 0 8px rgba(245,158,11,0.04), 0 20px 60px rgba(0,0,0,0.5)',
              marginBottom: 28,
            }}>
              <img src="/logo.png" alt="Group Polytech'K" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <p style={{ color: 'rgba(245,158,11,0.7)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>
              Group Polytech'K
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900,
              color: 'white', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.02em',
            }}>
              Rejoignez<br />
              <span style={{
                background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>la communauté</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280, marginBottom: 32 }}>
              Commencez votre parcours d'apprentissage professionnel dès aujourd'hui.
            </p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {avantages.map((av, i) => (
              <li key={av} className={`anim-slide-right d-${(i + 1) * 100}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle style={{ width: 13, height: 13, color: 'var(--gold)' }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>{av}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden" style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, textDecoration: 'none',
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(245,158,11,0.2)' }}>
              <img src="/logo.png" alt="Group Polytech'K" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
              Group Polytech'<span style={{ color: 'var(--gold)' }}>K</span>
            </span>
          </Link>

          <div style={{ marginBottom: 28 }}>
            <div className="tag-gold" style={{ marginBottom: 16 }}>
              <Sparkles style={{ width: 11, height: 11 }} /> Inscription gratuite
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 900,
              color: 'white', letterSpacing: '-0.02em', marginBottom: 8,
            }}>
              Créer un compte
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>Gratuit et sans engagement</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FieldLabel label="Nom complet">
              <input type="text" required placeholder="Jean Dupont"
                value={form.nomComplet}
                onChange={(e) => setForm({ ...form, nomComplet: e.target.value })}
                className="input-field" />
            </FieldLabel>

            <FieldLabel label="Adresse email">
              <input type="email" required placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </FieldLabel>

            <FieldLabel label="Mot de passe">
              <div style={{ position: 'relative' }}>
                <input type={afficherMDP ? 'text' : 'password'} required placeholder="Minimum 6 caractères"
                  value={form.motDePasse}
                  onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                  className="input-field" style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setAfficherMDP(!afficherMDP)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s', padding: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >
                  {afficherMDP ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </FieldLabel>

            <FieldLabel label="Confirmer le mot de passe">
              <input type="password" required placeholder="••••••••"
                value={form.confirmation}
                onChange={(e) => setForm({ ...form, confirmation: e.target.value })}
                className="input-field" />
            </FieldLabel>

            <button type="submit" disabled={chargement} className="btn-or"
              style={{ justifyContent: 'center', marginTop: 6, padding: '14px 24px', fontSize: '0.95rem', opacity: chargement ? 0.7 : 1 }}>
              {chargement ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%' }} className="animate-spin" />
              ) : (
                <><span>Créer mon compte</span> <ArrowRight style={{ width: 16, height: 16 }} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem', marginTop: 24 }}>
            Déjà un compte ?{' '}
            <Link to="/connexion" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-light)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--gold)'}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function FieldLabel({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: '0.03em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
