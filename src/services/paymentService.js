import api from './api'

export const paymentService = {
  createIntent: data =>
    api.post(
      '/payments/create-intent',
      data
    ),

  confirm: data =>
    api.post(
      '/payments/confirm',
      data
    ),

  cancel: data =>
    api.post(
      '/payments/cancel',
      data
    ),
}