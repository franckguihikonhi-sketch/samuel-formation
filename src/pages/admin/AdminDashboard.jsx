import { useEffect, useState } from 'react'
import { Users, BookOpen, Video, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, courses: 0, videos: 0, revenue: 0 })

  useEffect(() => {
    async function charger() {
      const [{ count: users }, { count: courses }, { count: videos }, { data: ventes }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('purchases').select('amount').eq('status', 'completed'),
      ])
      const revenue = (ventes || []).reduce((sum, v) => sum + Number(v.amount), 0)
      setStats({ users: users || 0, courses: courses || 0, videos: videos || 0, revenue })
    }
    charger()
  }, [])

  const cartes = [
    { label: 'Apprenants', value: stats.users, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Formations', value: stats.courses, icon: BookOpen, color: 'text-or-400', bg: 'bg-or-400/10' },
    { label: 'Vidéos', value: stats.videos, icon: Video, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    {
      label: 'Revenus (FCFA)',
      value: stats.revenue.toLocaleString('fr-FR'),
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cartes.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-noir-800 border border-noir-700 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-sm text-noir-400">{label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
