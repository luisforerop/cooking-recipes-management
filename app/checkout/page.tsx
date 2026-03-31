"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecipePdfCart } from "@/lib/hooks/use-recipe-pdf-cart";
import { RecipeCard } from "@/components/recipe-card";
import type { RecipeRow } from "@/lib/supabase";

const PAGE_SIZE = 5;

export default function CheckoutPage() {
  const { cart } = useRecipePdfCart();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(cart.length / PAGE_SIZE);
  const paginatedRecipes = cart.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const isEmpty = cart.length === 0;

  return (
    <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        Mi carrito
      </h1>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-base">
            Tu carrito está vacío.
          </p>
          <Link
            href="/recipes/select"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50 underline underline-offset-4"
          >
            Seleccionar recetas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8 items-start">
          {/* Left column — recipe cards (2/3 width) */}
          <div className="col-span-2 flex flex-col gap-4">
            {paginatedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe as unknown as RecipeRow}
              />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 rounded-md text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 rounded-md text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>

          {/* Right column — summary (1/3 width) */}
          <aside className="col-span-1 sticky top-24 flex flex-col gap-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-1">
                Resumen
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {cart.length}{" "}
                <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">
                  {cart.length === 1 ? "receta" : "recetas"}
                </span>
              </p>
            </div>

            <button
              disabled={isEmpty}
              onClick={() => router.push("/checkout/pdf")}
              className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continuar
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
