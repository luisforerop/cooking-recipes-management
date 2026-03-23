"use client";

import { useState, useTransition } from "react";
import type { Recipe } from "@/lib/types/recipe";
import {
  uploadRecipes,
  uploadSingleRecipe,
  type UploadResult,
} from "@/lib/actions/upload-recipes";

type RowStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

interface Props {
  recipes: Recipe[];
}

export function RecipeUploadTable({ recipes }: Props) {
  const [rowStatuses, setRowStatuses] = useState<RowStatus[]>(() =>
    recipes.map(() => ({ kind: "idle" })),
  );
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchSummary, setBatchSummary] = useState<string | null>(null);

  // Keep row statuses in sync when recipes prop changes (e.g. user pastes new content)
  const [prevRecipes, setPrevRecipes] = useState(recipes);
  if (recipes !== prevRecipes) {
    setPrevRecipes(recipes);
    setRowStatuses(recipes.map(() => ({ kind: "idle" })));
    setBatchSummary(null);
  }

  const [, startTransition] = useTransition();

  if (recipes.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-sm text-zinc-400">
        No hay recetas para cargar. Pegá recetas en el panel izquierdo.
      </div>
    );
  }

  async function handleUploadSingle(index: number) {
    setRowStatuses((prev) => {
      const next = [...prev];
      next[index] = { kind: "loading" };
      return next;
    });

    startTransition(async () => {
      const result: UploadResult = await uploadSingleRecipe(recipes[index]);
      setRowStatuses((prev) => {
        const next = [...prev];
        next[index] =
          result.status === "success"
            ? { kind: "success" }
            : { kind: "error", message: result.message };
        return next;
      });
    });
  }

  async function handleUploadAll() {
    setBatchLoading(true);
    setBatchSummary(null);
    // Mark all idle rows as loading
    setRowStatuses(recipes.map(() => ({ kind: "loading" })));

    startTransition(async () => {
      const results: UploadResult[] = await uploadRecipes(recipes);
      const nextStatuses: RowStatus[] = results.map((r) =>
        r.status === "success"
          ? { kind: "success" }
          : { kind: "error", message: r.message },
      );
      setRowStatuses(nextStatuses);
      setBatchLoading(false);

      const successCount = results.filter((r) => r.status === "success").length;
      const errorCount = results.length - successCount;

      if (errorCount === 0) {
        setBatchSummary(
          `${successCount} receta${successCount !== 1 ? "s" : ""} guardada${successCount !== 1 ? "s" : ""} correctamente.`,
        );
      } else {
        setBatchSummary(
          `${successCount} guardada${successCount !== 1 ? "s" : ""}, ${errorCount} con error.`,
        );
      }
    });
  }

  const allDone = rowStatuses.every((s) => s.kind === "success");
  const successCount = rowStatuses.filter((s) => s.kind === "success").length;

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Cargar en Supabase
        </span>
        <button
          onClick={handleUploadAll}
          disabled={batchLoading || allDone}
          className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {batchLoading ? (
            <>
              <Spinner />
              Subiendo…
            </>
          ) : allDone ? (
            `${successCount} subida${successCount !== 1 ? "s" : ""} ✓`
          ) : (
            "Subir todas"
          )}
        </button>
      </div>

      {/* Summary message */}
      {batchSummary && (
        <div
          className={`px-6 py-2 text-xs ${
            rowStatuses.some((s) => s.kind === "error")
              ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950"
              : "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950"
          }`}
        >
          {batchSummary}
        </div>
      )}

      {/* Preview table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-left text-xs text-zinc-400 uppercase tracking-wider">
              <th className="px-6 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Servings</th>
              <th className="px-4 py-2 font-medium">Prep Time</th>
              <th className="px-4 py-2 font-medium text-right">
                # Ingredients
              </th>
              <th className="px-4 py-2 font-medium text-right"># Steps</th>
              <th className="px-4 py-2 font-medium text-right">Estado</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe, i) => {
              const status = rowStatuses[i];
              const ingredientCount = recipe.ingredients.reduce(
                (sum, s) => sum + s.items.length,
                0,
              );
              const stepCount = recipe.preparation.reduce(
                (sum, s) => sum + s.items.length,
                0,
              );

              return (
                <tr
                  key={i}
                  className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {recipe.title}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {recipe.servings}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {recipe.preparationTime}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-right">
                    {ingredientCount}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-right">
                    {stepCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {status.kind === "success" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                        Guardado
                      </span>
                    )}
                    {status.kind === "error" && (
                      <span
                        title={status.message}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full cursor-help"
                      >
                        Error
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleUploadSingle(i)}
                      disabled={
                        status.kind === "loading" ||
                        status.kind === "success" ||
                        batchLoading
                      }
                      className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {status.kind === "loading" ? <Spinner /> : "Subir"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-3 w-3"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
