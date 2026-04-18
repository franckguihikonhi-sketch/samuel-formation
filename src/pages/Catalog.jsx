import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import CourseCard from '../components/CourseCard'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [formations, setFormations] = useState([])
  const [categories, setCategories] = useState([])
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState('')
  const categorieActive = searchParams.get('categorie') || ''

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data || []))
  }, [])

  useEffect(() => {
    chargerFormations()
  }, [categorieActive])

  async function chargerFormations() {
    setChargement(true)
    let query = supabase
      .from('courses')
      .select('*, categories(name, id), videos(id)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (categorieActive) query = query.eq('category_id', categorieActive)

    const { data } = await query
    setFormations(data || [])
    setChargement(false)
  }

  const formationsFiltrees = formations.filter((f) =>
    f.title.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* En-tête */}
      <div className="bg-noir-900 border-b border-noir-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Catalogue des formations</h1>
          {/* Recherche */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar catégories */}
          <aside className="lg:w-56 flex-shrink-0">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-or-400" /> Catégories
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSearchParams({})}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categorieActive ? 'bg-or-500 text-noir-900 font-semibold' : 'text-noir-300 hover:bg-noir-800 hover:text-white'}`}
                >
                  Toutes les formations
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSearchParams({ categorie: cat.id })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categorieActive === cat.id ? 'bg-or-500 text-noir-900 font-semibold' : 'text-noir-300 hover:bg-noir-800 hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Grille formations */}
          <div className="flex-1">
            {chargement ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-or-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : formationsFiltrees.length === 0 ? (
              <div className="text-center py-20 text-noir-400">
                Aucune formation trouvée.
              </div>
            ) : (
              <>
                <p className="text-noir-400 text-sm mb-4">
                  {formationsFiltrees.length} formation{formationsFiltrees.length > 1 ? 's' : ''} disponible{formationsFiltrees.length > 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {formationsFiltrees.map((f) => (
                    <CourseCard key={f.id} formation={f} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
