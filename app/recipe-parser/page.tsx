"use client";

import { useState } from "react";
import { AddRecipesModal } from "@/components/add-recipes-modal";

export default function RecipeParserPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <a
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← Home
        </a>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Recetas
        </h1>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Todavía no hay recetas cargadas.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold tracking-wide hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            AGREGAR RECETAS
          </button>
        </div>
      </main>

      <AddRecipesModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
