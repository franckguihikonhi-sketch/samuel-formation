import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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
    setProfil(data)
    setChargement(false)
  }

  async function inscription({ email, motDePasse, nomComplet }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: { data: { full_name: nomComplet } },
    })
    if (error) throw error

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: nomComplet,
        email,
        role: 'user',
      })
    }
    return data
  }

  async function connexion({ email, motDePasse }) {
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
