"use client";

import { useState } from "react";
import { AddRecipesModal } from "@/components/add-recipes-modal";

export function AddRecipesButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold tracking-wide hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
      >
        AGREGAR RECETAS
      </button>
      <AddRecipesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
