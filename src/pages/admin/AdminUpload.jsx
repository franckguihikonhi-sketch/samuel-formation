import { useEffect, useRef, useState } from 'react'
import { Upload, CheckCircle, AlertCircle, Video as VideoIcon, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { uploaderVideo } from '../../lib/cloudinary'
import toast from 'react-hot-toast'

export default function AdminUpload() {
  const [formations, setFormations] = useState([])
  const [formationChoisie, setFormationChoisie] = useState('')
  const [fichiers, setFichiers] = useState([])
  const [uploads, setUploads] = useState({})
  const inputRef = useRef()

  useEffect(() => {
    supabase.from('courses').select('id, title').order('title').then(({ data }) => setFormations(data || []))
  }, [])

  function handleFichiers(e) {
    const nouveaux = Array.from(e.target.files).filter((f) => f.type.startsWith('video/'))
    setFichiers((prev) => [...prev, ...nouveaux])
    e.target.value = ''
  }

  function retirerFichier(idx) {
    setFichiers((prev) => prev.filter((_, i) => i !== idx))
  }

  function formatTaille(bytes) {
    if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} Go`
    if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} Mo`
    return `${(bytes / 1e3).toFixed(0)} Ko`
  }

  async function uploadTout() {
    if (!formationChoisie) { toast.error('Choisissez une formation'); return }
    if (fichiers.length === 0) { toast.error('Ajoutez au moins une vidéo'); return }

    const { data: vidsExistantes } = await supabase
      .from('videos')
      .select('order_index')
      .eq('course_id', formationChoisie)
      .order('order_index', { ascending: false })
      .limit(1)

    let orderBase = (vidsExistantes?.[0]?.order_index ?? -1) + 1

    for (let i = 0; i < fichiers.length; i++) {
      const fichier = fichiers[i]
      const key = fichier.name

      setUploads((p) => ({ ...p, [key]: { statut: 'upload', progres: 0 } }))

      try {
        const result = await uploaderVideo(fichier, (progres) => {
          setUploads((p) => ({ ...p, [key]: { statut: 'upload', progres } }))
        })

        await supabase.from('videos').insert({
          title: fichier.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          course_id: formationChoisie,
          cloudinary_url: result.secure_url,
          cloudinary_public_id: result.public_id,
          duration: Math.round(result.duration || 0),
          order_index: orderBase + i,
        })

        setUploads((p) => ({ ...p, [key]: { statut: 'succes', progres: 100 } }))
      } catch (err) {
        setUploads((p) => ({ ...p, [key]: { statut: 'erreur', message: err.message } }))
      }
    }

    toast.success('Import terminé !')
  }

  const dragOver = (e) => { e.preventDefault() }
  const drop = (e) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('video/'))
    setFichiers((prev) => [...prev, ...dropped])
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Importer des vidéos</h1>

      {/* Choisir formation */}
      <div className="mb-6">
        <label className="block text-sm text-noir-300 mb-2">Formation cible *</label>
        <select value={formationChoisie} onChange={(e) => setFormationChoisie(e.target.value)} className="input-field max-w-sm">
          <option value="">-- Sélectionner une formation --</option>
          {formations.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
        </select>
      </div>

      {/* Zone de drop */}
      <div
        onDragOver={dragOver}
        onDrop={drop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-noir-600 hover:border-or-500 rounded-xl p-10 text-center cursor-pointer transition-colors mb-6 bg-noir-800/50"
      >
        <Upload className="w-10 h-10 text-noir-400 mx-auto mb-3" />
        <p className="text-white font-medium">Glissez vos vidéos ici</p>
        <p className="text-noir-400 text-sm mt-1">ou cliquez pour sélectionner</p>
        <p className="text-noir-500 text-xs mt-2">MP4, MOV, AVI, MKV supportés</p>
        <input ref={inputRef} type="file" multiple accept="video/*" onChange={handleFichiers} className="hidden" />
      </div>

      {/* Liste des fichiers */}
      {fichiers.length > 0 && (
        <div className="space-y-2 mb-6">
          {fichiers.map((fichier, idx) => {
            const info = uploads[fichier.name]
            return (
              <div key={idx} className="flex items-center gap-3 bg-noir-800 border border-noir-700 rounded-xl p-3">
                <VideoIcon className="w-5 h-5 text-or-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{fichier.name}</p>
                  <p className="text-xs text-noir-400">{formatTaille(fichier.size)}</p>
                  {info?.statut === 'upload' && (
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between text-xs text-noir-400 mb-1">
                        <span>Upload...</span>
                        <span>{info.progres}%</span>
                      </div>
                      <div className="h-1.5 bg-noir-700 rounded-full overflow-hidden">
                        <div className="h-full bg-or-500 rounded-full transition-all" style={{ width: `${info.progres}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {!info && (
                    <button onClick={() => retirerFichier(idx)} className="text-noir-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {info?.statut === 'succes' && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {info?.statut === 'erreur' && <AlertCircle className="w-5 h-5 text-red-400" title={info.message} />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {fichiers.length > 0 && (
        <button onClick={uploadTout} className="btn-or">
          <Upload className="w-4 h-4" />
          Lancer l'import ({fichiers.length} vidéo{fichiers.length > 1 ? 's' : ''})
        </button>
      )}
    </div>
  )
}
