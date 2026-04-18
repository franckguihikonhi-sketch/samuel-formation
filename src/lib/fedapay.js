import axios from 'axios'

export async function initierPaiement({ montant, description, transactionId, customer }) {
  const { data } = await axios.post('/.netlify/functions/fedapay-initier', {
    montant,
    description,
    transactionId,
    customer,
    origin: window.location.origin,
  })
  if (data.error) throw new Error(data.error)
  return data
}

export async function verifierPaiement(fedapayId) {
  const { data } = await axios.get(`/.netlify/functions/fedapay-verifier?id=${fedapayId}`)
  if (data.error) throw new Error(data.error)
  return data
}
