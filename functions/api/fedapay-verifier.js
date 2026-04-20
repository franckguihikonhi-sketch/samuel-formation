export async function onRequestGet(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const fedapayId = url.searchParams.get('id')

  const SECRET_KEY = env.FEDAPAY_SECRET_KEY
  const SUPABASE_URL = env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

  if (!SECRET_KEY) {
    return Response.json({ error: 'FEDAPAY_SECRET_KEY non configurée' }, { status: 500 })
  }
  if (!fedapayId) {
    return Response.json({ error: 'Paramètre id manquant' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.fedapay.com/v1/transactions/${fedapayId}`, {
      headers: { Authorization: `Bearer ${SECRET_KEY}`, 'Content-Type': 'application/json' },
    })
    const data = await res.json()

    const transaction = data?.['v1/transaction'] || data?.transaction || data
    const status = transaction?.status
    const internalId = transaction?.custom_metadata?.internal_id

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return Response.json(
        { error: 'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY non configurée' },
        { status: 500 }
      )
    }

    const supabaseHeaders = {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }

    if (status === 'approved' && internalId) {
      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/purchases?transaction_id=eq.${internalId}`,
        { method: 'PATCH', headers: supabaseHeaders, body: JSON.stringify({ status: 'completed' }) }
      )
      const rows = await patchRes.json()
      const courseId = rows?.[0]?.course_id

      return Response.json({ data: { status: 'ACCEPTED', internal_id: internalId, course_id: courseId } })
    }

    if (internalId) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/purchases?transaction_id=eq.${internalId}`,
        { method: 'PATCH', headers: supabaseHeaders, body: JSON.stringify({ status: 'failed' }) }
      )
    }

    return Response.json({ data: { status: 'FAILED', internal_id: internalId } })
  } catch (err) {
    return Response.json({ error: err.message || 'Erreur inconnue' }, { status: 500 })
  }
}
