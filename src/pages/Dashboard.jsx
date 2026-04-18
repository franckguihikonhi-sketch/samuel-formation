import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, BookOpen, Trophy } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { utilisateur, profil } = useAuth()
  const [formations, setFormations] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    if (utilisateur) chargerMesFormations()
  }, [utilisateur])

  async function chargerMesFormations() {
    const { data } = await supabase
      .from('purchases')
      .select('*, courses(id, title, slug, description, thumbnail_url, categories(name), videos(id))')
      .eq('user_id', utilisateur.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    setFormations(data || [])
    setChargement(false)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-noir-900 border-b border-noir-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-or-500 rounded-2xl flex items-center justify-center text-xl font-bold text-noir-900">
              {profil?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bonjour, {profil?.full_name?.split(' ')[0] || 'Apprenant'} 👋</h1>
              <p className="text-noir-400">{formations.length} formation{formations.length > 1 ? 's' : ''} achetée{formations.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {chargement ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-or-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : formations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-noir-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-noir-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Aucune formation achetée</h2>
            <p className="text-noir-400 mb-6">Explorez notre catalogue pour commencer à apprendre.</p>
            <Link to="/catalogue" className="btn-or">Voir le catalogue</Link>
          </div>
        ) : (
          <div>
            <h2 className="section-title mb-6">Mes formations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formations.map(({ courses: cours }) => cours && (
                <div key={cours.id} className="card group hover:border-or-600 transition-all duration-300">
                  {cours.thumbnail_url ? (
                    <img src={cours.thumbnail_url} alt={cours.title}
                      className="w-full aspect-video object-cover" />
                  ) : (
                    <div className="w-full aspect-video bg-noir-700 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-noir-500" />
                    </div>
                  )}
                  <div className="p-4">
                    {cours.categories?.name && (
                      <span className="text-xs text-or-400 font-medium">{cours.categories.name}</span>
                    )}
                    <h3 className="font-semibold text-white mt-1 mb-2 line-clamp-2">{cours.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-noir-400 mb-4">
                      <Play className="w-3 h-3" />
                      {cours.videos?.length || 0} vidéo{(cours.videos?.length || 0) > 1 ? 's' : ''}
                    </div>
                    <Link to={`/regarder/${cours.id}`} className="btn-or w-full justify-center text-sm py-2.5">
                      <Play className="w-4 h-4" /> Continuer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
