import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Shield, Download, Star, Zap, Award, Users, BookOpen, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import CourseCard from '../components/CourseCard'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [formationsParCategorie, setFormationsParCategorie] = useState({})
  const [chargement, setChargement] = useState(true)

  useEffect(() => { chargerDonnees() }, [])

  async function chargerDonnees() {
    try {
      const { data: cats } = await supabase.from('categories').select('*').order('name')
      if (!cats) { setChargement(false); return }

      const map = {}
      for (const cat of cats) {
        const { data } = await supabase
          .from('courses')
          .select('*, categories(name), videos(id)')
          .eq('category_id', cat.id)
          .eq('is_published', true)
          .limit(4)
          .order('created_at', { ascending: false })
        map[cat.id] = data || []
      }
      setCategories(cats)
      setFormationsParCategorie(map)
    } catch { }
    setChargement(false)
  }

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-noir-950">
        {/* Fond animé */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-or-500/8 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-or-600/6 rounded-full blur-3xl animate-pulse-glow delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-or-500/3 rounded-full blur-3xl" />
          {/* Grille */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#f59e0b 1px,transparent 1px),linear-gradient(90deg,#f59e0b 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-or-500/10 border border-or-500/25 rounded-full px-5 py-2 mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-or-400 rounded-full animate-pulse" />
            <span className="text-or-300 text-sm font-medium">Plateforme de formation professionnelle</span>
          </div>

          {/* Titre */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight animate-fade-up delay-100">
            Maîtrisez de nouvelles<br />
            <span className="gradient-text">compétences</span>
          </h1>

          <p className="text-noir-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
            Des formations vidéo de qualité professionnelle. Payez avec Orange Money, Wave ou Visa. Apprenez à votre rythme, où que vous soyez.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Link to="/catalogue" className="btn-or text-base px-8 py-4 text-lg">
              Explorer les formations <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/inscription"
              className="flex items-center gap-2 text-noir-300 hover:text-white transition-colors font-medium">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              Créer un compte gratuit
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto animate-fade-up delay-400">
            {[
              { value: '500+', label: 'Apprenants' },
              { value: '50+', label: 'Formations' },
              { value: '100%', label: 'En ligne' },
            ].map(({ value, label }) => (
              <div key={label} className="glass px-4 py-4">
                <div className="text-2xl font-black gradient-text">{value}</div>
                <div className="text-noir-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Flèche défilement */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-or-400" />
          <div className="w-1.5 h-1.5 bg-or-400 rounded-full" />
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="py-20 bg-noir-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Pourquoi choisir <span className="gradient-text">Group Polytech'K</span> ?</h2>
            <p className="text-noir-400 max-w-xl mx-auto">Tout ce dont vous avez besoin pour apprendre efficacement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: 'Paiement sécurisé',
                desc: 'Orange Money, Wave, Visa — chaque transaction est sécurisée via CinetPay.',
                color: 'from-blue-500/20 to-blue-600/10',
                iconColor: 'text-blue-400',
              },
              {
                icon: Zap,
                title: 'Accès immédiat',
                desc: 'Accédez à vos formations en quelques secondes après paiement. Pour toujours.',
                color: 'from-or-500/20 to-or-600/10',
                iconColor: 'text-or-400',
              },
              {
                icon: Download,
                title: 'Téléchargement offline',
                desc: 'Téléchargez les vidéos une par une ou tout un dossier pour apprendre hors ligne.',
                color: 'from-green-500/20 to-green-600/10',
                iconColor: 'text-green-400',
              },
            ].map(({ icon: Icon, title, desc, color, iconColor }) => (
              <div key={title}
                className="relative group border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-or-500/30 transition-all duration-300 bg-noir-800/40">
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                  <p className="text-noir-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMATIONS PAR CATÉGORIE ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {chargement ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-2 border-or-500/30 border-t-or-500 rounded-full animate-spin" />
              <p className="text-noir-500 text-sm">Chargement des formations...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-noir-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-noir-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucune formation disponible</h3>
              <p className="text-noir-500">Les formations seront bientôt disponibles.</p>
            </div>
          ) : (
            categories.map((cat) => {
              const formations = formationsParCategorie[cat.id] || []
              if (formations.length === 0) return null
              return (
                <div key={cat.id} className="mb-16">
                  <div className="flex items-end justify-between mb-7">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-6 bg-gradient-to-b from-or-400 to-or-600 rounded-full" />
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{cat.name}</h2>
                      </div>
                      {cat.description && (
                        <p className="text-noir-500 text-sm ml-3">{cat.description}</p>
                      )}
                    </div>
                    <Link to={`/catalogue?categorie=${cat.id}`}
                      className="hidden md:flex items-center gap-1 text-or-400 hover:text-or-300 text-sm font-medium transition-colors group">
                      Voir tout
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {formations.map((f) => <CourseCard key={f.id} formation={f} />)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-or-900/60 via-noir-800 to-noir-900" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-or-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-or-600/8 rounded-full blur-3xl" />
          <div className="relative px-8 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-or-500/15 border border-or-500/30 rounded-full px-4 py-1.5 mb-6">
              <Award className="w-4 h-4 text-or-400" />
              <span className="text-or-300 text-sm font-medium">Commencez dès aujourd'hui</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Prêt à apprendre ?
            </h2>
            <p className="text-noir-300 text-lg mb-8 max-w-lg mx-auto">
              Rejoignez des centaines d'apprenants et accédez aux meilleures formations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/catalogue" className="btn-or text-base px-8 py-4">
                Voir le catalogue <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/inscription" className="btn-outline text-base px-8 py-4">
                Créer un compte gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
