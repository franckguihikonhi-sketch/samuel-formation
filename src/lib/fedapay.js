import axios from 'axios'

export async function verifierPaiement(fedapayId) {
  const { data } = await axios.get(`/api/fedapay-verifier?id=${fedapayId}`)
  if (data.error) throw new Error(data.error)
  return data
}
