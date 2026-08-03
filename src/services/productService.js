import api from './api'

export const productService = {
  getAll: params =>
    api.get('/products', { params }),

  getById: id =>
    api.get(`/products/${id}`),

  getRecommendations: id =>
    api.get(`/products/${id}/recommendations`),

  create: data =>
    api.post('/products', data),

  update: (id, data) =>
    api.put(`/products/${id}`, data),

  delete: id =>
    api.delete(`/products/${id}`),

  createColor: (productId, data) =>
    api.post(
      `/products/${productId}/colors`,
      data
    ),

  updateColor: (
    productId,
    colorId,
    data
  ) =>
    api.put(
      `/products/${productId}/colors/${colorId}`,
      data
    ),

  deleteColor: (productId, colorId) =>
    api.delete(
      `/products/${productId}/colors/${colorId}`
    ),

  createImage: (productId, data) =>
    api.post(
      `/products/${productId}/images`,
      data
    ),

  updateImage: (
    productId,
    imageId,
    data
  ) =>
    api.put(
      `/products/${productId}/images/${imageId}`,
      data
    ),

  deleteImage: (productId, imageId) =>
    api.delete(
      `/products/${productId}/images/${imageId}`
    ),

  createVariant: (productId, data) =>
    api.post(
      `/products/${productId}/variants`,
      data
    ),

  updateVariant: (
    productId,
    variantId,
    data
  ) =>
    api.put(
      `/products/${productId}/variants/${variantId}`,
      data
    ),

  deleteVariant: (
    productId,
    variantId
  ) =>
    api.delete(
      `/products/${productId}/variants/${variantId}`
    ),
}