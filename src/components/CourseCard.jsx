import { Link } from 'react-router-dom'
import { Play, BookOpen, ArrowUpRight } from 'lucide-react'

export default function CourseCard({ formation }) {
  const { id, title, slug, description, price, thumbnail_url, categories, videos } = formation

  return (
    <Link
      to={`/formation/${slug || id}`}
      className="group relative flex flex-col bg-noir-800/50 border border-white/5 rounded-2xl overflow-hidden hover:border-or-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-or-950/50"
    >
      {/* Miniature */}
      <div className="relative aspect-video overflow-hidden bg-noir-700/50">
        {thumbnail_url ? (
          <img src={thumbnail_url} alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-noir-700 to-noir-800">
            <BookOpen className="w-10 h-10 text-noir-600" />
          </div>
        )}

        {/* Overlay play */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900/60 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 bg-or-500 rounded-full flex items-center justify-center shadow-xl shadow-or-900/50 scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 text-noir-900 ml-1" />
          </div>
        </div>

        {/* Badge catégorie */}
        {categories?.name && (
          <span className="absolute top-3 left-3 bg-noir-900/80 backdrop-blur-sm text-or-400 text-xs font-semibold px-2.5 py-1 rounded-lg border border-or-500/20">
            {categories.name}
          </span>
        )}

        {/* Badge gratuit */}
        {price === 0 && (
          <span className="absolute top-3 right-3 bg-green-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            Gratuit
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-or-200 transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-noir-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div className="text-xs text-noir-500 flex items-center gap-1">
            {videos?.length > 0 && (
              <><Play className="w-3 h-3" /> {videos.length} vidéo{videos.length > 1 ? 's' : ''}</>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-base ${price === 0 ? 'text-green-400' : 'text-or-400'}`}>
              {price === 0 ? 'Gratuit' : `${Number(price).toLocaleString('fr-FR')} F`}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-or-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Link>
  )
}
