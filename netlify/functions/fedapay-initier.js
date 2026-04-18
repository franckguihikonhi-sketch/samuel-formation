import axios from 'axios'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const SECRET_KEY = process.env.FEDAPAY_SECRET_KEY
  if (!SECRET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'FEDAPAY_SECRET_KEY non configurée' }) }
  }

  const { montant, description, transactionId, customer, origin } = JSON.parse(event.body)
  const headers = { Authorization: `Bearer ${SECRET_KEY}`, 'Content-Type': 'application/json' }

  try {
    const { data: txData } = await axios.post('https://api.fedapay.com/v1/transactions', {
      description,
      amount: montant,
      currency: { iso: 'XOF' },
      callback_url: `${origin}/paiement/retour`,
      custom_metadata: { internal_id: transactionId },
      customer: {
        firstname: customer.prenom || 'Client',
        lastname: customer.nom || 'Client',
        email: customer.email,
        phone_number: customer.telephone || '',
      },
    }, { headers })

    const transaction = txData?.['v1/transaction'] || txData?.transaction || txData
    const fedapayId = transaction?.id
    if (!fedapayId) throw new Error('Identifiant de transaction FedaPay manquant')

    const { data: tokenData } = await axios.post(
      `https://api.fedapay.com/v1/transactions/${fedapayId}/token`,
      {},
      { headers }
    )

    const paymentUrl = tokenData?.url ||
      (tokenData?.token ? `https://me.fedapay.com/checkout/${tokenData.token}` : null)
    if (!paymentUrl) throw new Error('URL de paiement FedaPay introuvable')

    return {
      statusCode: 200,
      body: JSON.stringify({ code: '201', data: { payment_url: paymentUrl } }),
    }
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Erreur inconnue'
    return { statusCode: 500, body: JSON.stringify({ error: msg }) }
  }
}
