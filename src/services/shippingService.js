import api from './api'

export const shippingService = {
  quote: data =>
    api.post('/shipping/quote', data),
}