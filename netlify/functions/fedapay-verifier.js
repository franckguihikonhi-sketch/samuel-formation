import axios from 'axios'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const SECRET_KEY = process.env.FEDAPAY_SECRET_KEY
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          status: status === 'approved' ? 'ACCEPTED' : 'FAILED',
          internal_id: transaction?.custom_metadata?.internal_id,
        },
      }),
    }
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Erreur inconnue'
    return { statusCode: 500, body: JSON.stringify({ error: msg }) }
  }
}
