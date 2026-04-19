import axios from 'axios'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const SECRET_KEY = process.env.FEDAPAY_SECRET_KEY
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  const fedapayId = event.queryStringParameters?.id

  if (!SECRET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'FEDAPAY_SECRET_KEY non configurée' }) }
  }
  if (!fedapayId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Paramètre id manquant' }) }
  }

  try {
    const { data } = await axios.get(
      `https://api.fedapay.com/v1/transactions/${fedapayId}`,
      { headers: { Authorization: `Bearer ${SECRET_KEY}`, 'Content-Type': 'application/json' } }
    )

    const transaction = data?.['v1/transaction'] || data?.transaction || data
    const status = transaction?.status
    const internalId = transaction?.custom_metadata?.internal_id

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY non configurée' }),
      }
    }

    const supabaseHeaders = {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }

    if (status === 'approved' && internalId) {
      const { data: rows } = await axios.patch(
        `${SUPABASE_URL}/rest/v1/purchases?transaction_id=eq.${internalId}`,
        { status: 'completed' },
        { headers: supabaseHeaders }
      )
      const courseId = rows?.[0]?.course_id

      return {
        statusCode: 200,
        body: JSON.stringify({ data: { status: 'ACCEPTED', internal_id: internalId, course_id: courseId } }),
      }
    }

    if (internalId) {
      await axios.patch(
        `${SUPABASE_URL}/rest/v1/purchases?transaction_id=eq.${internalId}`,
        { status: 'failed' },
        { headers: supabaseHeaders }
      )
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data: { status: 'FAILED', internal_id: internalId } }),
    }
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Erreur inconnue'
    return { statusCode: 500, body: JSON.stringify({ error: msg }) }
  }
}
