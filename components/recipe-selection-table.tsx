"use client";

import { useEffect, useRef, useState } from "react";
import { Recipe } from "@/lib/types/recipe";
import { useRecipePdfCart } from "@/lib/hooks/use-recipe-pdf-cart";

interface Props {
  recipes: Recipe[];
  totalCount: number;
}

export function RecipeSelectionTable({ recipes, totalCount }: Readonly<Props>) {
  const { cartIds, addToCart, removeFromCart } = useRecipePdfCart();

  // Local selection state for the current page
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Sync selection with cart when recipes change (page navigation) or when
  // cartIds hydrates from localStorage after first mount
  useEffect(() => {
    setSelected(
      new Set(recipes.map((r) => r.id).filter((id) => cartIds.has(id))),
    );
  }, [recipes, cartIds]);

  const pageIds = recipes.map((r) => r.id);
  const selectedOnPage = pageIds.filter((id) => selected.has(id));
  const allSelected =
    pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleHeaderChange = () => {
    if (allSelected) {
      // Deselect all on page — remove from cart immediately
      setSelected((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
      removeFromCart(pageIds);
    } else {
      // Select all on page (handles both empty and indeterminate states) — add to cart immediately
      setSelected((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
      addToCart(recipes);
    }
  };

  const handleRowChange = (recipe: Recipe, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(recipe.id);
      } else {
        next.delete(recipe.id);
      }
      return next;
    });
    if (checked) {
      addToCart([recipe]);
    } else {
      removeFromCart([recipe.id]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Counter */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {totalCount} receta{totalCount === 1 ? "" : "s"} en total
        {selected.size > 0 && (
          <span className="ml-2 font-medium text-zinc-700 dark:text-zinc-300">
            · {selected.size} seleccionada{selected.size === 1 ? "" : "s"}
          </span>
        )}
      </p>

      {/* Table */}
      {recipes.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No hay recetas disponibles.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleHeaderChange}
                    aria-label="Seleccionar todas las recetas de esta página"
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50 accent-zinc-800 dark:accent-zinc-200 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                  Título
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                  Porciones
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                  Tiempo de preparación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recipes.map((recipe) => {
                const isChecked = selected.has(recipe.id);
                return (
                  <tr
                    key={recipe.id}
                    onClick={() => handleRowChange(recipe, !isChecked)}
                    className={`cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${
                      isChecked ? "bg-zinc-100/60 dark:bg-zinc-800/40" : ""
                    }`}
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          handleRowChange(recipe, e.target.checked)
                        }
                        aria-label={`Seleccionar receta ${recipe.title}`}
                        className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 accent-zinc-800 dark:accent-zinc-200 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {recipe.title}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {recipe.servings}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {recipe.preparationTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
