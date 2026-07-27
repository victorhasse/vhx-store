import api from "./api";

export const couponService = {
  getAll: () =>
    api.get("/coupons"),

  create: (data) =>
    api.post("/coupons", data),

  update: (id, data) =>
    api.put(`/coupons/${id}`, data),

  updateStatus: (id, active) =>
    api.patch(`/coupons/${id}/status`, {
      active,
    }),

  validate: (data) =>
    api.post("/coupons/validate", data),
};