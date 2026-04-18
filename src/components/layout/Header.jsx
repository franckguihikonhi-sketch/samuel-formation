import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, ChevronDown, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Header() {
  const { utilisateur, profil, estAdmin, deconnexion } = useAuth()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOuvert(false)
    setMenuUser(false)
  }, [location.pathname])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuUser(false)
      }
    }
    if (menuUser) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuUser])

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
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      background: scrolled ? 'rgba(2,2,2,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(245,158,11,0.08)' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 40px rgba(0,0,0,0.6)' : 'none',
    }}>
      {/* Gold accent line */}
      {scrolled && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)',
        }} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div style={{
              width: 38, height: 38, borderRadius: 10, overflow: 'hidden',
              border: '1px solid rgba(245,158,11,0.2)',
              boxShadow: '0 0 20px rgba(245,158,11,0.08)',
              transition: 'box-shadow 0.3s, border-color 0.3s',
            }}
              className="group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <img src="/logo.png" alt="Samuel Formation"
                className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="flex items-center">
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'white', letterSpacing: '-0.01em' }}>
                  Samuel{' '}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--gold)' }}>Formation</span>
              </div>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to} style={{
                  padding: '6px 16px', borderRadius: 10, fontSize: '0.875rem',
                  fontWeight: 500, transition: 'all 0.2s',
                  color: active ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                  background: active ? 'rgba(245,158,11,0.08)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(245,158,11,0.15)' : 'transparent'}`,
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' } }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-3">
            {utilisateur ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setMenuUser(!menuUser)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    padding: '7px 14px 7px 8px', borderRadius: 12, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0a0a0a' }}>
                      {profil?.full_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'white' }}>
                    {profil?.full_name?.split(' ')[0] || 'Mon compte'}
                  </span>
                  <ChevronDown style={{
                    width: 14, height: 14, color: 'rgba(255,255,255,0.3)',
                    transition: 'transform 0.2s',
                    transform: menuUser ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />
                </button>

                {menuUser && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 220,
                    background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,158,11,0.05)',
                    overflow: 'hidden', zIndex: 100,
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginBottom: 3 }}>Connecté en tant que</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profil?.full_name}</p>
                    </div>
                    <div style={{ padding: 6 }}>
                      <DropItem to="/tableau-de-bord" icon={<LayoutDashboard style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.3)' }} />} label="Mes formations" />
                      {estAdmin && <DropItem to="/admin" icon={<ShieldCheck style={{ width: 15, height: 15, color: 'var(--gold)' }} />} label="Administration" gold />}
                      <button onClick={handleDeconnexion} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 10, background: 'transparent',
                        border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '0.85rem',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut style={{ width: 15, height: 15 }} />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/connexion" style={{
                  color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontWeight: 500,
                  padding: '8px 14px', borderRadius: 10, transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  Connexion
                </Link>
                <Link to="/inscription" className="btn-or text-sm" style={{ padding: '8px 20px' }}>
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <button onClick={() => setMenuOuvert(!menuOuvert)}
            style={{
              width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
            }}
            className="md:hidden"
          >
            {menuOuvert
              ? <X style={{ width: 16, height: 16, color: 'white' }} />
              : <Menu style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.6)' }} />
            }
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(2,2,2,0.98)', backdropFilter: 'blur(20px)',
          padding: '16px',
        }} className="md:hidden">
          <div className="space-y-1 mb-4">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block', padding: '10px 16px', borderRadius: 10,
                color: location.pathname === to ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                background: location.pathname === to ? 'rgba(245,158,11,0.06)' : 'transparent',
                fontSize: '0.9rem', fontWeight: 500,
              }}>
                {label}
              </Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
            {utilisateur ? (
              <div className="space-y-1">
                <Link to="/tableau-de-bord" style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                  borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem',
                }}>
                  <BookOpen style={{ width: 15, height: 15 }} /> Mes formations
                </Link>
                {estAdmin && (
                  <Link to="/admin" style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                    borderRadius: 10, color: 'var(--gold)', fontSize: '0.9rem',
                  }}>
                    <ShieldCheck style={{ width: 15, height: 15 }} /> Administration
                  </Link>
                )}
                <button onClick={handleDeconnexion} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', borderRadius: 10, background: 'transparent',
                  border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '0.9rem',
                }}>
                  <LogOut style={{ width: 15, height: 15 }} /> Déconnexion
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/connexion" style={{
                  display: 'block', padding: '10px 16px', borderRadius: 10,
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem',
                }}>
                  Connexion
                </Link>
                <Link to="/inscription" className="btn-or w-full justify-center" style={{ fontSize: '0.9rem' }}>
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function DropItem({ to, icon, label, gold }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 10,
      color: gold ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
      fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.15s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = gold ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.05)'
        e.currentTarget.style.color = gold ? 'var(--gold-light)' : 'white'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = gold ? 'var(--gold)' : 'rgba(255,255,255,0.6)'
      }}
    >
      {icon}
      {label}
    </Link>
  )
}
