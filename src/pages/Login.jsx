import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
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
      if (msg === 'SERVICE_UNCONFIGURED') {
        toast.error('Service non configuré — variables Supabase manquantes sur Netlify')
      } else if (msg.includes('Invalid API') || msg.includes('Invalid api')) {
        toast.error('Clé API Supabase invalide — vérifiez VITE_SUPABASE_ANON_KEY dans Netlify')
      } else if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        toast.error('Email ou mot de passe incorrect')
      } else if (msg.includes('Email not confirmed')) {
        toast.error('Veuillez confirmer votre email avant de vous connecter')
      } else {
        toast.error(msg || 'Erreur de connexion')
      }
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--obsidian)' }}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #0a0a0a 0%, #060606 100%)' }}>

        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '20%', right: '10%',
            width: 300, height: 300, borderRadius: '50%',
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

        <div className="relative text-center px-14 anim-fade-up">
          {/* Logo */}
          <div className="anim-float" style={{ marginBottom: 36 }}>
            <div style={{
              width: 90, height: 90, borderRadius: 22, overflow: 'hidden', margin: '0 auto',
              border: '1px solid rgba(245,158,11,0.2)',
              boxShadow: '0 0 0 8px rgba(245,158,11,0.04), 0 20px 60px rgba(0,0,0,0.5)',
            }}>
              <img src="/logo.png" alt="Samuel Formation" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          <p style={{ color: 'rgba(245,158,11,0.7)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12 }}>
            Samuel Formation
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900,
            color: 'white', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em',
          }}>
            Formez-vous.<br />
            <span style={{
              background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Évoluez.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280, margin: '0 auto 36px' }}>
            Des formations vidéo de qualité professionnelle, accessibles à vie après un paiement unique.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[['500+', 'Apprenants'], ['50+', 'Formations'], ['∞', 'Accès']].map(([v, l]) => (
              <div key={l} style={{
                padding: '14px 8px', textAlign: 'center', borderRadius: 14,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  fontWeight: 900, fontSize: '1.3rem', marginBottom: 4,
                  background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{v}</div>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden" style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, textDecoration: 'none',
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(245,158,11,0.2)' }}>
              <img src="/logo.png" alt="Samuel Formation" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
              Samuel <span style={{ color: 'var(--gold)' }}>Formation</span>
            </span>
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div className="tag-gold" style={{ marginBottom: 16 }}>
              <Sparkles style={{ width: 11, height: 11 }} /> Connexion
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900,
              color: 'white', letterSpacing: '-0.02em', marginBottom: 8,
            }}>
              Bon retour
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
              Accédez à toutes vos formations
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: '0.03em' }}>
                Adresse email
              </label>
              <input type="email" required placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: '0.03em' }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input type={afficherMDP ? 'text' : 'password'} required placeholder="••••••••"
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
            </div>

            <button type="submit" disabled={chargement} className="btn-or"
              style={{ justifyContent: 'center', marginTop: 8, padding: '14px 24px', fontSize: '0.95rem', opacity: chargement ? 0.7 : 1 }}>
              {chargement ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%' }} className="animate-spin" />
              ) : (
                <><span>Se connecter</span> <ArrowRight style={{ width: 16, height: 16 }} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem', marginTop: 24 }}>
            Pas encore de compte ?{' '}
            <Link to="/inscription" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-light)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--gold)'}
            >
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
