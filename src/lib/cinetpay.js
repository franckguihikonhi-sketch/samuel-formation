import axios from 'axios'

const CINETPAY_API_KEY = import.meta.env.VITE_CINETPAY_API_KEY
const CINETPAY_SITE_ID = import.meta.env.VITE_CINETPAY_SITE_ID
const CINETPAY_BASE_URL = 'https://api-checkout.cinetpay.com/v2/payment'

export async function initierPaiement({ montant, description, transactionId, customer }) {
  const payload = {
    apikey: CINETPAY_API_KEY,
    site_id: CINETPAY_SITE_ID,
    transaction_id: transactionId,
    amount: montant,
    currency: 'XOF',
    description,
    return_url: `${window.location.origin}/paiement/retour`,
    notify_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cinetpay-webhook`,
    customer_name: customer.nom,
    customer_surname: customer.prenom,
    customer_email: customer.email,
    customer_phone_number: customer.telephone || '',
    customer_address: 'Abidjan',
    customer_city: 'Abidjan',
    customer_country: 'CI',
    customer_state: 'CI',
    customer_zip_code: '00225',
    channels: 'ALL',
    lang: 'FR',
  }

  const { data } = await axios.post(CINETPAY_BASE_URL, payload)
  return data
}

export async function verifierPaiement(transactionId) {
  const { data } = await axios.post('https://api-checkout.cinetpay.com/v2/payment/check', {
    apikey: CINETPAY_API_KEY,
    site_id: CINETPAY_SITE_ID,
    transaction_id: transactionId,
  })
  return data
}
