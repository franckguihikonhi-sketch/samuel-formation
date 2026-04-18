import axios from 'axios'

const FEDAPAY_SECRET_KEY = import.meta.env.VITE_FEDAPAY_SECRET_KEY
const FEDAPAY_BASE_URL = 'https://api.fedapay.com/v1'

const authHeaders = () => ({
  Authorization: `Bearer ${FEDAPAY_SECRET_KEY}`,
  'Content-Type': 'application/json',
})

function extractTransaction(data) {
  return data?.['v1/transaction'] || data?.transaction || data
}

export async function initierPaiement({ montant, description, transactionId, customer }) {
  const { data: txData } = await axios.post(`${FEDAPAY_BASE_URL}/transactions`, {
    description,
    amount: montant,
    currency: { iso: 'XOF' },
    callback_url: `${window.location.origin}/paiement/retour`,
    custom_metadata: { internal_id: transactionId },
    customer: {
      firstname: customer.prenom || 'Client',
      lastname: customer.nom || 'Client',
      email: customer.email,
      phone_number: customer.telephone || '',
    },
  }, { headers: authHeaders() })

  const transaction = extractTransaction(txData)
  const fedapayId = transaction?.id
  if (!fedapayId) throw new Error('Identifiant de transaction FedaPay manquant')

  const { data: tokenData } = await axios.post(
    `${FEDAPAY_BASE_URL}/transactions/${fedapayId}/token`,
    {},
    { headers: authHeaders() }
  )

  const paymentUrl = tokenData?.url || (tokenData?.token ? `https://me.fedapay.com/checkout/${tokenData.token}` : null)
  if (!paymentUrl) throw new Error('URL de paiement FedaPay introuvable')

  return {
    code: '201',
    data: { payment_url: paymentUrl },
  }
}

export async function verifierPaiement(fedapayId) {
  const { data } = await axios.get(
    `${FEDAPAY_BASE_URL}/transactions/${fedapayId}`,
    { headers: authHeaders() }
  )

  const transaction = extractTransaction(data)
  const status = transaction?.status

  return {
    data: {
      status: status === 'approved' ? 'ACCEPTED' : 'FAILED',
      internal_id: transaction?.custom_metadata?.internal_id,
    },
  }
}
