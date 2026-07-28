import api from "./api";

export const orderService = {
  getAll: () => api.get("/orders"),

  getById: (id) => api.get(`/orders/${id}`),

  getAdminOrders: () => api.get("/orders/admin/all"),

  updateAdminOrder: (id, data) => api.patch(`/orders/admin/${id}`, data),
};
