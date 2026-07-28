import api from "./api";

export const wishlistService = {
  getAll() {
    return api.get("/wishlist");
  },

  add(productId) {
    return api.post(`/wishlist/${productId}`);
  },

  remove(productId) {
    return api.delete(`/wishlist/${productId}`);
  },
};