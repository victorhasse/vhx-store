import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { wishlistService } from "../services/wishlistService";

const WishlistContext = createContext(null);

export function WishlistProvider({
  children,
}) {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadWishlist =
    useCallback(async () => {
      if (!isAuthenticated) {
        setItems([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response =
          await wishlistService.getAll();

        setItems(
          Array.isArray(response.data)
            ? response.data
            : [],
        );
      } catch (requestError) {
        console.error(
          "Erro ao carregar wishlist:",
          requestError,
        );

        setError(
          "Não foi possível carregar sua lista de desejos.",
        );
      } finally {
        setLoading(false);
      }
    }, [isAuthenticated]);

  useEffect(() => {
    loadWishlist();
  }, [
    loadWishlist,
    user?.id,
  ]);

  const productIds = useMemo(
    () =>
      new Set(
        items.map((item) =>
          Number(item.product_id),
        ),
      ),
    [items],
  );

  function isInWishlist(productId) {
    return productIds.has(
      Number(productId),
    );
  }

  async function addToWishlist(product) {
    if (!isAuthenticated) {
      return {
        success: false,
        requiresLogin: true,
      };
    }

    const productId = Number(
      product?.id,
    );

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return {
        success: false,
        requiresLogin: false,
      };
    }

    /*
     * Atualização otimista: o coração muda
     * imediatamente, antes da resposta da API.
     */
    const temporaryItem = {
      id: `temporary-${productId}`,
      product_id: productId,
      product,
      createdAt:
        new Date().toISOString(),
    };

    setItems((currentItems) => {
      const alreadyExists =
        currentItems.some(
          (item) =>
            Number(item.product_id) ===
            productId,
        );

      return alreadyExists
        ? currentItems
        : [
            temporaryItem,
            ...currentItems,
          ];
    });

    setError("");

    try {
      await wishlistService.add(
        productId,
      );

      /*
       * Recarrega para substituir o item
       * temporário pelo registro real do banco.
       */
      await loadWishlist();

      return {
        success: true,
        requiresLogin: false,
      };
    } catch (requestError) {
      console.error(
        "Erro ao adicionar à wishlist:",
        requestError,
      );

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            Number(item.product_id) !==
            productId,
        ),
      );

      setError(
        "Não foi possível adicionar o produto.",
      );

      return {
        success: false,
        requiresLogin: false,
      };
    }
  }

  async function removeFromWishlist(
    productId,
  ) {
    const normalizedProductId =
      Number(productId);

    const previousItems = items;

    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          Number(item.product_id) !==
          normalizedProductId,
      ),
    );

    setError("");

    try {
      await wishlistService.remove(
        normalizedProductId,
      );

      return true;
    } catch (requestError) {
      console.error(
        "Erro ao remover da wishlist:",
        requestError,
      );

      /*
       * Desfaz a atualização visual se
       * a requisição falhar.
       */
      setItems(previousItems);

      setError(
        "Não foi possível remover o produto.",
      );

      return false;
    }
  }

  async function toggleWishlist(
    product,
  ) {
    if (
      isInWishlist(product.id)
    ) {
      const success =
        await removeFromWishlist(
          product.id,
        );

      return {
        success,
        requiresLogin: false,
        added: false,
      };
    }

    const result =
      await addToWishlist(product);

    return {
      ...result,
      added: result.success,
    };
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        error,
        count: items.length,
        isInWishlist,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(
    WishlistContext,
  );

  if (!context) {
    throw new Error(
      "useWishlist deve ser usado dentro de <WishlistProvider>",
    );
  }

  return context;
}