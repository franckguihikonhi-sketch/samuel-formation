import { useEffect, useState } from 'react'
import { Pencil, Trash2, X, Video as VideoIcon, GripVertical } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminVideos() {
  const [formations, setFormations] = useState([])
  const [formationChoisie, setFormationChoisie] = useState('')
  const [videos, setVideos] = useState([])
  const [editionId, setEditionId] = useState(null)
  const [titreEdition, setTitreEdition] = useState('')

  useEffect(() => {
    supabase.from('courses').select('id, title').order('title').then(({ data }) => setFormations(data || []))
  }, [])

  useEffect(() => {
    if (formationChoisie) chargerVideos()
  }, [formationChoisie])

  async function chargerVideos() {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('course_id', formationChoisie)
      .order('order_index')
    setVideos(data || [])
  }

  async function sauvegarderTitre(id) {
    const { error } = await supabase.from('videos').update({ title: titreEdition }).eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Titre mis à jour')
    setEditionId(null)
    chargerVideos()
  }

  async function supprimerVideo(id) {
    if (!confirm('Supprimer cette vidéo ?')) return
    const { error } = await supabase.from('videos').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Vidéo supprimée')
    chargerVideos()
  }

  async function monter(video) {
    const idx = videos.findIndex((v) => v.id === video.id)
    if (idx === 0) return
    const voisin = videos[idx - 1]
    await Promise.all([
      supabase.from('videos').update({ order_index: voisin.order_index }).eq('id', video.id),
      supabase.from('videos').update({ order_index: video.order_index }).eq('id', voisin.id),
    ])
    chargerVideos()
  }

  async function descendre(video) {
    const idx = videos.findIndex((v) => v.id === video.id)
    if (idx === videos.length - 1) return
    const voisin = videos[idx + 1]
    await Promise.all([
      supabase.from('videos').update({ order_index: voisin.order_index }).eq('id', video.id),
      supabase.from('videos').update({ order_index: video.order_index }).eq('id', voisin.id),
    ])
    chargerVideos()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Gestion des vidéos</h1>

      <div className="mb-6">
        <label className="block text-sm text-noir-300 mb-2">Choisir une formation</label>
        <select value={formationChoisie} onChange={(e) => setFormationChoisie(e.target.value)} className="input-field max-w-sm">
          <option value="">-- Sélectionner --</option>
          {formations.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
        </select>
      </div>

      {formationChoisie && (
        <div className="space-y-2">
          {videos.length === 0 ? (
            <div className="text-center py-10 text-noir-400">
              Aucune vidéo. Utilisez l'onglet "Importer" pour ajouter des vidéos.
            </div>
          ) : (
            videos.map((video, idx) => (
              <div key={video.id} className="flex items-center gap-3 bg-noir-800 border border-noir-700 rounded-xl p-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => monter(video)} disabled={idx === 0}
                    className="text-noir-500 hover:text-white disabled:opacity-30 text-xs leading-none">▲</button>
                  <button onClick={() => descendre(video)} disabled={idx === videos.length - 1}
                    className="text-noir-500 hover:text-white disabled:opacity-30 text-xs leading-none">▼</button>
                </div>
                <div className="w-8 h-8 bg-noir-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <VideoIcon className="w-4 h-4 text-or-400" />
                </div>

                <div className="flex-1 min-w-0">
                  {editionId === video.id ? (
                    <div className="flex gap-2">
                      <input value={titreEdition} onChange={(e) => setTitreEdition(e.target.value)}
                        className="input-field py-1.5 text-sm flex-1" />
                      <button onClick={() => sauvegarderTitre(video.id)} className="text-green-400 hover:text-green-300 px-2">✓</button>
                      <button onClick={() => setEditionId(null)} className="text-noir-400 hover:text-white px-2">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-white">{video.title}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => { setEditionId(video.id); setTitreEdition(video.title) }}
                    className="w-7 h-7 flex items-center justify-center bg-noir-700 hover:bg-noir-600 rounded-lg text-or-400">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button onClick={() => supprimerVideo(video.id)}
                    className="w-7 h-7 flex items-center justify-center bg-noir-700 hover:bg-red-500/20 rounded-lg text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
