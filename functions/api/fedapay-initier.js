export async function onRequestPost(context) {
  const { request, env } = context

  const SECRET_KEY = env.FEDAPAY_SECRET_KEY
  if (!SECRET_KEY) {
    return Response.json({ error: 'FEDAPAY_SECRET_KEY non configurée' }, { status: 500 })
  }

  const { montant, description, transactionId, customer, origin } = await request.json()
  const headers = { Authorization: `Bearer ${SECRET_KEY}`, 'Content-Type': 'application/json' }

  try {
    const txRes = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
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
      }),
    })

    const txData = await txRes.json()
    const transaction = txData?.['v1/transaction'] || txData?.transaction || txData
    const fedapayId = transaction?.id
    if (!fedapayId) throw new Error('Identifiant de transaction FedaPay manquant')

    const tokenRes = await fetch(`https://api.fedapay.com/v1/transactions/${fedapayId}/token`, {
      method: 'POST',
      headers,
    })
    const tokenData = await tokenRes.json()

    const paymentUrl = tokenData?.url ||
      (tokenData?.token ? `https://me.fedapay.com/checkout/${tokenData.token}` : null)
    if (!paymentUrl) throw new Error('URL de paiement FedaPay introuvable')

    return Response.json({ code: '201', data: { payment_url: paymentUrl } })
  } catch (err) {
    return Response.json({ error: err.message || 'Erreur inconnue' }, { status: 500 })
  }
}
