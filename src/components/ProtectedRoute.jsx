import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { utilisateur, chargement } = useAuth()

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-or-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!utilisateur) return <Navigate to="/connexion" replace />
  return children
}
