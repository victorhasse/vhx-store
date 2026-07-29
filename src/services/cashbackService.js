import api from './api'

export const cashbackService = {
  getBalance: () =>
    api.get('/cashback/balance'),

  getTransactions: (page = 1, limit = 10) =>
    api.get('/cashback/transactions', {
      params: { page, limit },
    }),
}