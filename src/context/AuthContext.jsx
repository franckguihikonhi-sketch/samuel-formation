import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null)
  const [profil, setProfil] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session
      setUtilisateur(session?.user ?? null)
      if (session?.user) chargerProfil(session.user.id)
      else setChargement(false)
    }).catch(() => setChargement(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUtilisateur(session?.user ?? null)
      if (session?.user) chargerProfil(session.user.id)
      else {
        setProfil(null)
        setChargement(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function chargerProfil(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfil(data)
    } else {
      // Profil absent (insert échoué lors du signup) — recréation depuis les metadata auth
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const profil = {
          id: userId,
          full_name: user.user_metadata?.full_name || '',
          email: user.email,
          role: 'user',
        }
        await supabase.from('profiles').upsert(profil, { onConflict: 'id' })
        setProfil(profil)
      }
    }
    setChargement(false)
  }

  async function inscription({ email, motDePasse, nomComplet }) {
    if (!supabaseConfigured) throw new Error('SERVICE_UNCONFIGURED')
    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { full_name: nomComplet },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) throw error

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: nomComplet,
        email,
        role: 'user',
      }, { onConflict: 'id' })
    }
    return data
  }

  async function connexion({ email, motDePasse }) {
    if (!supabaseConfigured) throw new Error('SERVICE_UNCONFIGURED')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    })
    if (error) throw error
    return data
  }

  async function deconnexion() {
    await supabase.auth.signOut()
  }

  const estAdmin = profil?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      utilisateur,
      profil,
      chargement,
      estAdmin,
      inscription,
      connexion,
      deconnexion,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
