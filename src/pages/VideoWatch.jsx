import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Download, Play, ChevronDown, ChevronUp, FolderDown } from 'lucide-react'
import ReactPlayer from 'react-player'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { getVideoUrl } from '../lib/cloudinary'
import toast from 'react-hot-toast'

export default function VideoWatch() {
  const { courseId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { utilisateur } = useAuth()
  const navigate = useNavigate()
  const [formation, setFormation] = useState(null)
  const [videos, setVideos] = useState([])
  const [videoActive, setVideoActive] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [playlistOuverte, setPlaylistOuverte] = useState(true)
  const [telechargement, setTelechargement] = useState({})

  useEffect(() => {
    verifierAccesEtCharger()
  }, [courseId, utilisateur])

  async function verifierAccesEtCharger() {
    if (!utilisateur) { navigate('/connexion'); return }

    const { data: cours } = await supabase
      .from('courses')
      .select('*, videos(id, title, cloudinary_url, cloudinary_public_id, duration, order_index)')
      .eq('id', courseId)
      .single()

    if (!cours) { navigate('/catalogue'); return }

    if (cours.price > 0) {
      const { data: achat } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', utilisateur.id)
        .eq('course_id', courseId)
        .eq('status', 'completed')
        .single()

      if (!achat) {
        toast.error('Accès non autorisé. Veuillez acheter cette formation.')
        navigate(`/formation/${courseId}`)
        return
      }
    }

    const vidsTriees = (cours.videos || []).sort((a, b) => a.order_index - b.order_index)
    setFormation(cours)
    setVideos(vidsTriees)

    const videoIdParam = searchParams.get('video')
    const premiere = vidsTriees.find((v) => v.id === videoIdParam) || vidsTriees[0]
    setVideoActive(premiere)
    setChargement(false)
  }

  function changerVideo(video) {
    setVideoActive(video)
    setSearchParams({ video: video.id })
  }

  async function telechargerVideo(video) {
    setTelechargement((p) => ({ ...p, [video.id]: true }))
    try {
      const url = video.cloudinary_url || getVideoUrl(video.cloudinary_public_id)
      const resp = await fetch(url)
      const blob = await resp.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${video.title.replace(/\s+/g, '_')}.mp4`
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success('Téléchargement lancé !')
    } catch {
      toast.error('Erreur lors du téléchargement')
    } finally {
      setTelechargement((p) => ({ ...p, [video.id]: false }))
    }
  }

  async function telechargerTout() {
    toast.success('Téléchargement de toutes les vidéos en cours...')
    for (const video of videos) {
      await telechargerVideo(video)
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-or-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const videoUrl = videoActive?.cloudinary_url ||
    (videoActive?.cloudinary_public_id ? getVideoUrl(videoActive.cloudinary_public_id) : null)

  return (
    <div className="min-h-screen bg-noir-950">
      {/* Barre du haut */}
      <div className="bg-noir-900 border-b border-noir-700 px-4 py-3 flex items-center justify-between">
        <Link to="/tableau-de-bord" className="flex items-center gap-2 text-noir-300 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Mes formations
        </Link>
        <h1 className="font-semibold text-white text-sm hidden md:block">{formation?.title}</h1>
        <button
          onClick={telechargerTout}
          className="flex items-center gap-2 text-or-400 hover:text-or-300 text-sm transition-colors"
        >
          <FolderDown className="w-4 h-4" /> Tout télécharger
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-57px)]">
        {/* Lecteur vidéo */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center">
            {videoUrl ? (
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
                config={{ file: { attributes: { controlsList: 'nodownload' } } }}
              />
            ) : (
              <div className="text-noir-400 text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Vidéo non disponible</p>
              </div>
            )}
          </div>
          {videoActive && (
            <div className="bg-noir-900 border-t border-noir-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">{videoActive.title}</h2>
                <p className="text-noir-400 text-sm">{formation?.title}</p>
              </div>
              <button
                onClick={() => telechargerVideo(videoActive)}
                disabled={telechargement[videoActive.id]}
                className="flex items-center gap-2 bg-noir-800 hover:bg-noir-700 text-or-400 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {telechargement[videoActive.id] ? (
                  <div className="w-4 h-4 border-2 border-or-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Télécharger
              </button>
            </div>
          )}
        </div>

        {/* Playlist */}
        <div className="lg:w-80 bg-noir-900 border-l border-noir-700 flex flex-col">
          <button
            onClick={() => setPlaylistOuverte(!playlistOuverte)}
            className="flex items-center justify-between px-4 py-3 border-b border-noir-700 lg:hidden"
          >
            <span className="font-medium text-white text-sm">Contenu du cours</span>
            {playlistOuverte ? <ChevronUp className="w-4 h-4 text-noir-400" /> : <ChevronDown className="w-4 h-4 text-noir-400" />}
          </button>

          <div className={`flex-1 overflow-y-auto ${!playlistOuverte ? 'hidden lg:block' : ''}`}>
            <div className="p-3 border-b border-noir-700 hidden lg:flex items-center justify-between">
              <span className="text-sm font-medium text-white">Contenu ({videos.length})</span>
            </div>
            {videos.map((video, idx) => (
              <div
                key={video.id}
                onClick={() => changerVideo(video)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-noir-800 ${
                  videoActive?.id === video.id ? 'bg-or-500/10 border-l-2 border-l-or-500' : 'hover:bg-noir-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                  videoActive?.id === video.id ? 'bg-or-500 text-noir-900' : 'bg-noir-700 text-noir-400'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${videoActive?.id === video.id ? 'text-or-300' : 'text-white'}`}>
                    {video.title}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); telechargerVideo(video) }}
                  disabled={telechargement[video.id]}
                  className="text-noir-500 hover:text-or-400 transition-colors flex-shrink-0"
                  title="Télécharger"
                >
                  {telechargement[video.id] ? (
                    <div className="w-3.5 h-3.5 border border-or-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
