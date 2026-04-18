import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [formulaire, setFormulaire] = useState({ name: '', description: '' })
  const [editionId, setEditionId] = useState(null)
  const [chargement, setChargement] = useState(false)

  useEffect(() => { charger() }, [])

  async function charger() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  async function sauvegarder() {
    if (!formulaire.name.trim()) { toast.error('Nom requis'); return }
    setChargement(true)
    try {
      if (editionId) {
        const { error } = await supabase.from('categories')
          .update({ name: formulaire.name, description: formulaire.description, slug: slugify(formulaire.name) })
          .eq('id', editionId)
        if (error) throw error
        toast.success('Catégorie mise à jour')
      } else {
        const { error } = await supabase.from('categories')
          .insert({ name: formulaire.name, description: formulaire.description, slug: slugify(formulaire.name) })
        if (error) throw error
        toast.success('Catégorie créée')
      }
      setFormulaire({ name: '', description: '' })
      setEditionId(null)
      charger()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setChargement(false)
    }
  }

  function editer(cat) {
    setEditionId(cat.id)
    setFormulaire({ name: cat.name, description: cat.description || '' })
  }

  async function supprimer(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Catégorie supprimée')
    charger()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Catégories</h1>

      {/* Formulaire */}
      <div className="bg-noir-800 border border-noir-700 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-white mb-4">
          {editionId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-noir-300 mb-1">Nom *</label>
            <input
              value={formulaire.name}
              onChange={(e) => setFormulaire({ ...formulaire, name: e.target.value })}
              placeholder="Ex: Marketing Digital"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-noir-300 mb-1">Description</label>
            <input
              value={formulaire.description}
              onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })}
              placeholder="Description courte"
              className="input-field"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={sauvegarder} disabled={chargement} className="btn-or text-sm py-2">
            {chargement ? <div className="w-4 h-4 border-2 border-noir-900 border-t-transparent rounded-full animate-spin" /> : <><Plus className="w-4 h-4" /> {editionId ? 'Mettre à jour' : 'Ajouter'}</>}
          </button>
          {editionId && (
            <button onClick={() => { setEditionId(null); setFormulaire({ name: '', description: '' }) }}
              className="btn-outline text-sm py-2">
              <X className="w-4 h-4" /> Annuler
            </button>
          )}
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between bg-noir-800 border border-noir-700 rounded-xl px-4 py-3">
            <div>
              <span className="font-medium text-white">{cat.name}</span>
              {cat.description && <p className="text-sm text-noir-400 mt-0.5">{cat.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => editer(cat)}
                className="w-8 h-8 flex items-center justify-center bg-noir-700 hover:bg-noir-600 rounded-lg transition-colors text-or-400">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => supprimer(cat.id)}
                className="w-8 h-8 flex items-center justify-center bg-noir-700 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
