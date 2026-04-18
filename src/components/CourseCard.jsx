import { Link } from 'react-router-dom'
import { Play, BookOpen, ArrowUpRight, Clock } from 'lucide-react'

export default function CourseCard({ formation }) {
  const { id, title, slug, description, price, thumbnail_url, categories, videos } = formation

  return (
    <Link to={`/formation/${slug || id}`}
      className="group"
      style={{
        display: 'flex', flexDirection: 'column', borderRadius: 20, overflow: 'hidden',
        background: 'linear-gradient(160deg, #0d0d0d, #080808)',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        textDecoration: 'none', position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.22)'
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Gold shimmer line on top */}
      <div className="group-hover:opacity-100" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)',
        opacity: 0, transition: 'opacity 0.35s',
        zIndex: 2,
      }} />

      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#111', flexShrink: 0 }}>
        {thumbnail_url ? (
          <img src={thumbnail_url} alt={title} style={{
            width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85,
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.3s',
          }} className="group-hover:scale-105 group-hover:opacity-100" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.08)' }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

        {/* Play button */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity 0.3s',
        }} className="group-hover:opacity-100">
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(245,158,11,0.92)',
            boxShadow: '0 0 0 8px rgba(245,158,11,0.12), 0 8px 32px rgba(245,158,11,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'scale(0.8)', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          }} className="group-hover:scale-100">
            <Play style={{ width: 16, height: 16, color: '#0a0a0a', marginLeft: 2 }} />
          </div>
        </div>

        {/* Category badge */}
        {categories?.name && (
          <span style={{
            position: 'absolute', top: 10, left: 10, zIndex: 3,
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em',
            padding: '4px 10px', borderRadius: 8,
            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(245,158,11,0.2)',
            color: 'var(--gold)', backdropFilter: 'blur(8px)',
          }}>
            {categories.name}
          </span>
        )}

        {/* Free badge */}
        {price === 0 && (
          <span style={{
            position: 'absolute', top: 10, right: 10, zIndex: 3,
            fontSize: '0.68rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: 8,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
            color: '#4ade80', backdropFilter: 'blur(8px)',
          }}>
            Gratuit
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '16px' }}>
        <h3 style={{
          fontFamily: 'var(--font-body)', fontWeight: 700, color: 'white',
          fontSize: '0.875rem', lineHeight: 1.4, marginBottom: 8,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          transition: 'color 0.2s',
        }} className="group-hover:text-amber-200">
          {title}
        </h3>

        {description && (
          <p style={{
            color: 'rgba(255,255,255,0.22)', fontSize: '0.775rem', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            flex: 1, marginBottom: 14,
          }}>
            {description}
          </p>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.18)', fontSize: '0.75rem' }}>
            {videos?.length > 0 && (
              <>
                <Play style={{ width: 11, height: 11 }} />
                <span>{videos.length} vidéo{videos.length > 1 ? 's' : ''}</span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontWeight: 800, fontSize: '0.875rem',
              color: price === 0 ? '#4ade80' : 'var(--gold)',
            }}>
              {price === 0 ? 'Gratuit' : `${Number(price).toLocaleString('fr-FR')} FCFA`}
            </span>
            <ArrowUpRight style={{
              width: 13, height: 13, color: 'var(--gold)',
              opacity: 0, transition: 'opacity 0.2s, transform 0.2s', transform: 'translate(-2px, 2px)',
            }} className="group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
          </div>
        </div>
      </div>
    </Link>
  )
}
