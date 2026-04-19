import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Home } from 'lucide-react'
import { verifierPaiement } from '../lib/fedapay'

export default function PaymentReturn() {
  const [searchParams] = useSearchParams()
  const [statut, setStatut] = useState('verification')
  const [courseId, setCourseId] = useState(null)

  useEffect(() => {
    verifier()
  }, [])

  async function verifier() {
    const fedapayId = searchParams.get('id')
    if (!fedapayId) { setStatut('erreur'); return }

    try {
      const result = await verifierPaiement(fedapayId)

      if (result.data?.status === 'ACCEPTED') {
        setCourseId(result.data?.course_id)
        setStatut('succes')
      } else {
        setStatut('echec')
      }
    } catch {
      setStatut('erreur')
    }
  }

  if (statut === 'verification') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-or-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-noir-300">Vérification du paiement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {statut === 'succes' ? (
          <>
            <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Paiement réussi !</h1>
            <p className="text-noir-400 mb-8">Votre formation est maintenant accessible.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {courseId && (
                <Link to={`/regarder/${courseId}`} className="btn-or">
                  Accéder à la formation
                </Link>
              )}
              <Link to="/tableau-de-bord" className="btn-outline">
                Mes formations
              </Link>
              <Link to="/" className="btn-ghost">
                <Home className="w-4 h-4" /> Accueil
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Paiement échoué</h1>
            <p className="text-noir-400 mb-8">Le paiement n'a pas pu être traité. Aucun montant n'a été débité.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/catalogue" className="btn-or">
                Retour au catalogue
              </Link>
              <Link to="/" className="btn-ghost">
                <Home className="w-4 h-4" /> Accueil
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
