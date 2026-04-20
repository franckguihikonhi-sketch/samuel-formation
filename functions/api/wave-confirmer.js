export async function onRequestPost(context) {
  const { request, env } = context

  const SUPABASE_URL = env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return Response.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  const { transactionId, userId } = await request.json()

  if (!transactionId || !userId) {
    return Response.json({ error: 'transactionId et userId requis' }, { status: 400 })
  }

  try {
    const headers = {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/purchases?transaction_id=eq.${transactionId}&user_id=eq.${userId}&status=eq.pending`,
      { method: 'PATCH', headers, body: JSON.stringify({ status: 'completed' }) }
    )

    const rows = await res.json()
    if (!rows?.length) {
      return Response.json({ error: 'Achat introuvable ou déjà traité' }, { status: 404 })
    }

    return Response.json({ success: true, course_id: rows[0].course_id })
  } catch (err) {
    return Response.json({ error: err.message || 'Erreur inconnue' }, { status: 500 })
  }
}
