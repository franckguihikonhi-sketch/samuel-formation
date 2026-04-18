import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, BookOpen } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const VIDE = { title: '', description: '', price: '', category_id: '', thumbnail_url: '', is_published: false }

export default function AdminCourses() {
  const [formations, setFormations] = useState([])
  const [categories, setCategories] = useState([])
  const [formulaire, setFormulaire] = useState(VIDE)
  const [editionId, setEditionId] = useState(null)
  const [afficherForm, setAfficherForm] = useState(false)
  const [chargement, setChargement] = useState(false)

  useEffect(() => { charger() }, [])

  async function charger() {
    const [{ data: f }, { data: c }] = await Promise.all([
      supabase.from('courses').select('*, categories(name), videos(id)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setFormations(f || [])
    setCategories(c || [])
  }

  function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  async function sauvegarder() {
    if (!formulaire.title.trim()) { toast.error('Titre requis'); return }
    setChargement(true)
    const payload = {
      title: formulaire.title,
      slug: slugify(formulaire.title),
      description: formulaire.description,
      price: parseFloat(formulaire.price) || 0,
      category_id: formulaire.category_id || null,
      thumbnail_url: formulaire.thumbnail_url || null,
      is_published: formulaire.is_published,
    }
    try {
      if (editionId) {
        const { error } = await supabase.from('courses').update(payload).eq('id', editionId)
        if (error) throw error
        toast.success('Formation mise à jour')
      } else {
        const { error } = await supabase.from('courses').insert(payload)
        if (error) throw error
        toast.success('Formation créée')
      }
      reset()
      charger()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setChargement(false)
    }
  }

  function editer(f) {
    setEditionId(f.id)
    setFormulaire({
      title: f.title,
      description: f.description || '',
      price: String(f.price),
      category_id: f.category_id || '',
      thumbnail_url: f.thumbnail_url || '',
      is_published: f.is_published,
    })
    setAfficherForm(true)
  }

  async function supprimerFormation(id) {
    if (!confirm('Supprimer cette formation et toutes ses vidéos ?')) return
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Formation supprimée')
    charger()
  }

  async function togglePublie(formation) {
    await supabase.from('courses').update({ is_published: !formation.is_published }).eq('id', formation.id)
    charger()
  }

  function reset() {
    setEditionId(null)
    setFormulaire(VIDE)
    setAfficherForm(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Formations</h1>
        <button onClick={() => setAfficherForm(!afficherForm)} className="btn-or text-sm py-2">
          <Plus className="w-4 h-4" /> Nouvelle formation
        </button>
      </div>

      {/* Formulaire */}
      {afficherForm && (
        <div className="bg-noir-800 border border-noir-700 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-white mb-4">{editionId ? 'Modifier' : 'Nouvelle formation'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-noir-300 mb-1">Titre *</label>
              <input value={formulaire.title} onChange={(e) => setFormulaire({ ...formulaire, title: e.target.value })}
                placeholder="Titre de la formation" className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-noir-300 mb-1">Catégorie</label>
              <select value={formulaire.category_id} onChange={(e) => setFormulaire({ ...formulaire, category_id: e.target.value })}
                className="input-field">
                <option value="">Sans catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-noir-300 mb-1">Prix (FCFA)</label>
              <input type="number" min="0" value={formulaire.price} onChange={(e) => setFormulaire({ ...formulaire, price: e.target.value })}
                placeholder="0 = Gratuit" className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-noir-300 mb-1">URL miniature</label>
              <input value={formulaire.thumbnail_url} onChange={(e) => setFormulaire({ ...formulaire, thumbnail_url: e.target.value })}
                placeholder="https://..." className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-noir-300 mb-1">Description</label>
              <textarea value={formulaire.description} onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })}
                rows={3} placeholder="Description de la formation" className="input-field resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="publie" checked={formulaire.is_published}
                onChange={(e) => setFormulaire({ ...formulaire, is_published: e.target.checked })}
                className="w-4 h-4 accent-or-500" />
              <label htmlFor="publie" className="text-sm text-noir-300">Publier cette formation</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={sauvegarder} disabled={chargement} className="btn-or text-sm py-2">
              {chargement ? <div className="w-4 h-4 border-2 border-noir-900 border-t-transparent rounded-full animate-spin" /> : editionId ? 'Mettre à jour' : 'Créer'}
            </button>
            <button onClick={reset} className="btn-outline text-sm py-2"><X className="w-4 h-4" /> Annuler</button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-3">
        {formations.map((f) => (
          <div key={f.id} className="flex items-center gap-4 bg-noir-800 border border-noir-700 rounded-xl p-4">
            {f.thumbnail_url ? (
              <img src={f.thumbnail_url} alt={f.title} className="w-16 h-10 object-cover rounded-lg flex-shrink-0" />
            ) : (
              <div className="w-16 h-10 bg-noir-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-noir-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{f.title}</h3>
              <div className="flex items-center gap-3 text-xs text-noir-400 mt-0.5">
                <span>{f.categories?.name || 'Sans catégorie'}</span>
                <span>•</span>
                <span>{Number(f.price).toLocaleString('fr-FR')} FCFA</span>
                <span>•</span>
                <span>{f.videos?.length || 0} vidéo{(f.videos?.length || 0) > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => togglePublie(f)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${f.is_published ? 'bg-green-400/10 text-green-400' : 'bg-noir-700 text-noir-400'}`}>
                {f.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {f.is_published ? 'Publié' : 'Brouillon'}
              </button>
              <button onClick={() => editer(f)} className="w-8 h-8 flex items-center justify-center bg-noir-700 hover:bg-noir-600 rounded-lg text-or-400">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => supprimerFormation(f.id)} className="w-8 h-8 flex items-center justify-center bg-noir-700 hover:bg-red-500/20 rounded-lg text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
