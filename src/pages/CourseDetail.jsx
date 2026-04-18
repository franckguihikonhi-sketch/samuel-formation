import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Play, Lock, CreditCard, CheckCircle, ArrowLeft, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function CourseDetail() {
  const { slug } = useParams()
  const { utilisateur, profil } = useAuth()
  const navigate = useNavigate()
  const [formation, setFormation] = useState(null)
  const [videos, setVideos] = useState([])
  const [aAcces, setAAcces] = useState(false)
  const [chargement, setChargement] = useState(true)
  const [paiementEnCours, setPaiementEnCours] = useState(false)

  useEffect(() => {
    chargerFormation()
  }, [slug, utilisateur])

  async function chargerFormation() {
    const { data } = await supabase
      .from('courses')
      .select('*, categories(name), videos(id, title, duration, order_index)')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .eq('is_published', true)
      .single()

    if (!data) { navigate('/catalogue'); return }

    setFormation(data)
    setVideos(data.videos?.sort((a, b) => a.order_index - b.order_index) || [])

    if (utilisateur) {
      const { data: achat } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', utilisateur.id)
        .eq('course_id', data.id)
        .eq('status', 'completed')
        .single()
      setAAcces(!!achat || data.price === 0)
    } else {
      setAAcces(data.price === 0)
    }
    setChargement(false)
  }

  async function handleAccesFree() {
    if (!utilisateur) {
      navigate('/connexion', { state: { from: { pathname: `/formation/${slug}` } } })
      return
    }
    setPaiementEnCours(true)
    try {
      await supabase.from('purchases').upsert({
        user_id: utilisateur.id,
        course_id: formation.id,
        amount: 0,
        transaction_id: `free_${Date.now()}`,
        status: 'completed',
      }, { onConflict: 'user_id,course_id' })
      setAAcces(true)
      navigate(`/regarder/${formation.id}`)
    } catch {
      navigate(`/regarder/${formation.id}`)
    } finally {
      setPaiementEnCours(false)
    }
  }

  async function onPaiementComplete(resp) {
    if (resp?.transaction?.status === 'approved') {
      const { error } = await supabase.from('purchases').upsert({
        user_id: utilisateur.id,
        course_id: formation.id,
        amount: formation.price,
        transaction_id: String(resp.transaction.id),
        status: 'completed',
      }, { onConflict: 'user_id,course_id' })
      if (error) {
        toast.error('Paiement reçu mais erreur de mise à jour — contactez le support')
      } else {
        toast.success('Paiement réussi ! Accès débloqué.')
        setAAcces(true)
      }
    } else if (resp?.transaction?.status !== 'canceled') {
      toast.error('Paiement non complété')
    }
  }

  function formatDuree(secondes) {
    if (!secondes) return ''
    const m = Math.floor(secondes / 60)
    const s = secondes % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-or-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero formation */}
      <div className="bg-noir-900 border-b border-noir-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/catalogue" className="inline-flex items-center gap-2 text-noir-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour au catalogue
          </Link>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Infos */}
            <div className="flex-1">
              {formation.categories?.name && (
                <span className="bg-or-500/20 text-or-400 text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">
                  {formation.categories.name}
                </span>
              )}
              <h1 className="text-3xl font-bold text-white mb-4">{formation.title}</h1>
              {formation.description && (
                <p className="text-noir-300 text-base leading-relaxed mb-6">{formation.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-noir-400">
                <span className="flex items-center gap-1">
                  <Play className="w-4 h-4" /> {videos.length} vidéo{videos.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Carte achat */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="card p-6 sticky top-20">
                {formation.thumbnail_url && (
                  <img src={formation.thumbnail_url} alt={formation.title}
                    className="w-full aspect-video object-cover rounded-lg mb-4" />
                )}

                <div className="text-3xl font-bold text-or-400 mb-4">
                  {formation.price === 0 ? (
                    <span className="text-green-400">Gratuit</span>
                  ) : (
                    `${Number(formation.price).toLocaleString('fr-FR')} FCFA`
                  )}
                </div>

                {aAcces ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Accès débloqué</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/regarder/${formation.id}`)}
                      className="btn-or w-full justify-center"
                    >
                      <Play className="w-5 h-5" /> Regarder maintenant
                    </button>
                  </div>
                ) : formation.price === 0 ? (
                  <button
                    type="button"
                    onClick={handleAccesFree}
                    disabled={paiementEnCours}
                    className="btn-or w-full justify-center"
                  >
                    {paiementEnCours
                      ? <div className="w-5 h-5 border-2 border-noir-900 border-t-transparent rounded-full animate-spin" />
                      : <><Play className="w-5 h-5" /> Accéder gratuitement</>
                    }
                  </button>
                ) : !utilisateur ? (
                  <button
                    type="button"
                    onClick={() => navigate('/connexion', { state: { from: { pathname: `/formation/${slug}` } } })}
                    className="btn-or w-full justify-center"
                  >
                    <CreditCard className="w-5 h-5" /> Se connecter pour acheter
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-or w-full justify-center"
                    onClick={() => {
                      window.FedaPay.init({
                        public_key: import.meta.env.VITE_FEDAPAY_PUBLIC_KEY,
                        transaction: {
                          amount: formation.price,
                          description: `Formation : ${formation.title}`,
                        },
                        currency: { iso: 'XOF' },
                        customer: {
                          firstname: profil?.full_name?.split(' ')[0] || 'Client',
                          lastname: profil?.full_name?.split(' ').slice(1).join(' ') || '',
                          email: utilisateur.email,
                        },
                        onComplete: onPaiementComplete,
                      }).open()
                    }}
                  >
                    <CreditCard className="w-5 h-5" />
                    Acheter — {Number(formation.price).toLocaleString('fr-FR')} FCFA
                  </button>
                )}

                <div className="mt-4 space-y-2 text-xs text-noir-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-or-500" /> Accès à vie
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-or-500" /> Téléchargement disponible
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-or-500" /> Orange Money, Wave, Visa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des vidéos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold text-white mb-4">Contenu de la formation</h2>
        <div className="space-y-2">
          {videos.map((video, idx) => (
            <div
              key={video.id}
              onClick={() => aAcces && navigate(`/regarder/${formation.id}?video=${video.id}`)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                aAcces
                  ? 'border-noir-700 bg-noir-800 hover:border-or-600 hover:bg-noir-700 cursor-pointer'
                  : 'border-noir-800 bg-noir-900 cursor-not-allowed opacity-70'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-noir-700 flex items-center justify-center flex-shrink-0 text-sm font-bold text-nor-300">
                {aAcces ? (
                  <Play className="w-3.5 h-3.5 text-or-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-noir-500" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-white">{video.title}</span>
              </div>
              {video.duration && (
                <span className="text-xs text-noir-400">{formatDuree(video.duration)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
