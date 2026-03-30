import type { RecipeRow } from "@/lib/supabase";

const MAX_ITEMS = 3;

interface Props {
  recipe: RecipeRow;
}

export function RecipeCard({ recipe }: Props) {
  const allIngredients = recipe.ingredients.flatMap((s) => s.items);
  const allSteps = recipe.preparation.flatMap((s) => s.items);

  const visibleIngredients = allIngredients.slice(0, MAX_ITEMS);
  const remainingIngredients =
    allIngredients.length - visibleIngredients.length;

  const visibleSteps = allSteps.slice(0, MAX_ITEMS);
  const remainingSteps = allSteps.length - visibleSteps.length;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
        {recipe.title}
      </h2>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Ingredientes
        </p>
        <ul className="flex flex-col gap-0.5">
          {visibleIngredients.map((ing, i) => (
            <li
              key={i}
              className="text-sm text-zinc-700 dark:text-zinc-300 truncate"
            >
              {ing.name}
            </li>
          ))}
        </ul>
        {remainingIngredients > 0 && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            y {remainingIngredients} más
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Preparación
        </p>
        <ol className="flex flex-col gap-0.5 list-decimal list-inside">
          {visibleSteps.map((step, i) => (
            <li
              key={i}
              className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2"
            >
              {step.description}
            </li>
          ))}
        </ol>
        {remainingSteps > 0 && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            y {remainingSteps} más
          </p>
        )}
      </div>
    </div>
  );
}
