import api from './api'

export const orderService = {
  create:   (data) => api.post('/orders', data),
  getAll:   ()     => api.get('/orders'),
  getById:  (id)   => api.get(`/orders/${id}`),
}