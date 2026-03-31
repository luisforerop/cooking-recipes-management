"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Recipe } from "@/lib/types/recipe";

const STORAGE_KEY = "recipe-pdf-cart";

function readCart(): Recipe[] {
  if (globalThis.window === undefined) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Recipe[]) : [];
  } catch {
    return [];
  }
}

function writeCart(recipes: Recipe[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function useRecipePdfCart() {
  const [cart, setCart] = useState<Recipe[]>([]);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setCart(readCart());
  }, []);

  const cartIds = useMemo(() => new Set(cart.map((r) => r.id)), [cart]);

  const addToCart = useCallback((recipes: Recipe[]) => {
    setCart((prev) => {
      const existingIds = new Set(prev.map((r) => r.id));
      const toAdd = recipes.filter((r) => !existingIds.has(r.id));
      const updated = [...prev, ...toAdd];
      writeCart(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((ids: string[]) => {
    setCart((prev) => {
      const idSet = new Set(ids);
      const updated = prev.filter((r) => !idSet.has(r.id));
      writeCart(updated);
      return updated;
    });
  }, []);

  return { cart, cartIds, addToCart, removeFromCart };
}
