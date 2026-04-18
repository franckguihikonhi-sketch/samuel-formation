import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Download, Zap, Award, BookOpen, Sparkles, Play } from 'lucide-react'
import { supabase } from '../lib/supabase'
import CourseCard from '../components/CourseCard'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [formationsParCategorie, setFormationsParCategorie] = useState({})
  const [chargement, setChargement] = useState(true)

  useEffect(() => { chargerDonnees() }, [])

  async function chargerDonnees() {
    try {
      const { data: cats } = await supabase.from('categories').select('*').order('name')
      if (!cats) { setChargement(false); return }
      const map = {}
      for (const cat of cats) {
        const { data } = await supabase
          .from('courses').select('*, categories(name), videos(id)')
          .eq('category_id', cat.id).eq('is_published', true)
          .limit(4).order('created_at', { ascending: false })
        map[cat.id] = data || []
      }
      setCategories(cats)
      setFormationsParCategorie(map)
    } catch {}
    setChargement(false)
  }

  const avantages = [
    {
      icon: Shield, title: 'Paiement sécurisé',
      desc: 'Orange Money, Wave, carte Visa — chaque transaction sécurisée par FedaPay.',
      accent: '#3b82f6',
    },
    {
      icon: Zap, title: 'Accès immédiat',
      desc: 'Votre formation disponible en quelques secondes après paiement. Pour toujours.',
      accent: '#f59e0b',
    },
    {
      icon: Download, title: 'Offline disponible',
      desc: 'Téléchargez chaque vidéo ou un dossier entier pour apprendre sans connexion.',
      accent: '#22c55e',
    },
  ]

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#020202' }}>

        {/* Background atmosphere */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 1000, height: 600, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(217,119,6,0.18) 0%, transparent 65%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: '-10%',
            width: 600, height: 500,
            background: 'radial-gradient(ellipse at center, rgba(120,53,15,0.1) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: '20%', right: '-5%',
            width: 400, height: 400,
            background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.05) 0%, transparent 70%)',
          }} />
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.035,
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.5) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }} />
          {/* Vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 35%, #020202 90%)' }} />
        </div>

        <div className="relative" style={{ zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

          {/* Badge */}
          <div className="anim-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 40,
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
            borderRadius: 100, padding: '8px 20px',
          }}>
            <Sparkles style={{ width: 14, height: 14, color: '#f59e0b' }} />
            <span style={{ color: 'rgba(245,158,11,0.9)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em' }}>
              Plateforme de formation professionnelle
            </span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.6)' }}
              className="animate-pulse" />
          </div>

          {/* H1 */}
          <h1 className="anim-fade-up d-100" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
            fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em',
            marginBottom: 24, color: 'white',
          }}>
            Apprenez.<br />
            <span style={{
              background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Évoluez.</span><br />
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>Réussissez.</span>
          </h1>

          <p className="anim-fade-up d-200" style={{
            color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.7,
          }}>
            Des formations vidéo premium. Paiement Orange Money, Wave & carte Visa. Accès à vie, téléchargement inclus.
          </p>

          <div className="anim-fade-up d-300" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 72 }}>
            <Link to="/catalogue" className="btn-or" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              Voir les formations <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            <Link to="/inscription" className="btn-outline" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              Créer un compte
            </Link>
          </div>

          {/* Stats */}
          <div className="anim-fade-up d-400" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, maxWidth: 340, margin: '0 auto' }}>
            {[['500+', 'Apprenants'], ['50+', 'Formations'], ['∞', 'Accès']].map(([v, l]) => (
              <div key={l} style={{
                padding: '20px 12px', textAlign: 'center', borderRadius: 20,
                background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  fontSize: '1.6rem', fontWeight: 900, marginBottom: 4,
                  background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{v}</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce" style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.2,
        }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, #f59e0b)' }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#f59e0b' }} />
        </div>
      </section>

      {/* ══ PAYMENT STRIP ══ */}
      <section style={{
        padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: '#050505',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Paiements acceptés
          </span>
          {[
            { label: 'Orange Money', color: '#ff6600', bg: 'rgba(255,102,0,0.08)', border: 'rgba(255,102,0,0.2)' },
            { label: 'Wave', color: '#1ba8e0', bg: 'rgba(27,168,224,0.08)', border: 'rgba(27,168,224,0.2)' },
            { label: 'Carte Visa', color: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
          ].map(({ label, color, bg, border }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100,
              background: bg, border: `1px solid ${border}`,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
              <span style={{ color, fontSize: '0.8rem', fontWeight: 700 }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ AVANTAGES ══ */}
      <section style={{ padding: '96px 0', background: 'linear-gradient(180deg, #020202 0%, #060606 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: 'rgba(245,158,11,0.7)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>
              Pourquoi nous choisir
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 900, color: 'white', letterSpacing: '-0.02em',
            }}>
              Tout pour apprendre{' '}
              <span style={{
                background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>sans friction</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {avantages.map(({ icon: Icon, title, desc, accent }) => (
              <div key={title}
                style={{
                  position: 'relative', borderRadius: 20, padding: 28, overflow: 'hidden',
                  background: '#080808', border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = `${accent}30`
                  e.currentTarget.querySelector('.accent-line').style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                  e.currentTarget.querySelector('.accent-line').style.opacity = '0'
                }}
              >
                <div className="accent-line" style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1, opacity: 0, transition: 'opacity 0.4s',
                  background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 20,
                  background: `${accent}12`, border: `1px solid ${accent}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 20, height: 20, color: accent }} />
                </div>
                <h3 style={{ fontWeight: 700, color: 'white', fontSize: '1.05rem', marginBottom: 10 }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATALOGUE ══ */}
      <section style={{ padding: '80px 0', background: '#040404' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 0 32px' }}>
          {chargement ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '1px solid rgba(245,158,11,0.15)',
                borderTopColor: 'rgba(245,158,11,0.8)',
              }} className="animate-spin" />
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>Chargement des formations…</p>
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '120px 0' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 18, margin: '0 auto 24px',
                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BookOpen style={{ width: 28, height: 28, color: 'rgba(255,255,255,0.12)' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                Aucune formation disponible
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.875rem' }}>Les formations arrivent bientôt.</p>
            </div>
          ) : (
            categories.map((cat) => {
              const formations = formationsParCategorie[cat.id] || []
              if (formations.length === 0) return null
              return (
                <div key={cat.id} style={{ marginBottom: 80 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                        background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.14)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <BookOpen style={{ width: 17, height: 17, color: '#f59e0b' }} />
                      </div>
                      <div>
                        <h2 style={{
                          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                          fontWeight: 800, color: 'white', letterSpacing: '-0.01em',
                        }}>
                          {cat.name}
                        </h2>
                        {cat.description && (
                          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.825rem', marginTop: 3 }}>{cat.description}</p>
                        )}
                      </div>
                    </div>
                    <Link to={`/catalogue?categorie=${cat.id}`}
                      style={{
                        display: 'none', alignItems: 'center', gap: 6,
                        color: 'rgba(245,158,11,0.7)', fontSize: '0.875rem', fontWeight: 600,
                        textDecoration: 'none', transition: 'color 0.2s',
                      }}
                      className="md:!flex"
                      onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,158,11,0.7)'}
                    >
                      Tout voir <ArrowRight style={{ width: 15, height: 15 }} />
                    </Link>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                    {formations.map((f) => <CourseCard key={f.id} formation={f} />)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: '80px 24px', background: '#020202' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: -40, borderRadius: 40, opacity: 0.15,
            background: 'radial-gradient(ellipse at center, #92400e 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'relative', borderRadius: 28, padding: 'clamp(40px, 6vw, 64px)',
            background: 'linear-gradient(135deg, #0c0c0c, #080808)',
            border: '1px solid rgba(245,158,11,0.1)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
          }}>
            {/* Top gold line */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '55%', height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent)',
            }} />

            <Award style={{ width: 40, height: 40, color: '#f59e0b', margin: '0 auto 24px', opacity: 0.85 }} />
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
              fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-0.02em',
            }}>
              Prêt à progresser ?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '1.05rem', marginBottom: 36, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Rejoignez Samuel Formation et accédez aux meilleures formations professionnelles.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              <Link to="/catalogue" className="btn-or" style={{ fontSize: '1rem', padding: '14px 28px' }}>
                Explorer le catalogue <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
              <Link to="/inscription" className="btn-outline" style={{ fontSize: '1rem', padding: '14px 28px' }}>
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
