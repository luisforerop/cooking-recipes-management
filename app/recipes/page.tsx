import { getRecipes } from "@/lib/supabase";
import { RecipeCard } from "@/components/recipe-card";
import { RecipesPagination } from "@/components/recipes-pagination";
import { AddRecipesButton } from "@/components/add-recipes-button";

const PAGE_SIZE = 9;

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { data: recipes, count } = await getRecipes(currentPage, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

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
        <h1 className="flex-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Recetas
        </h1>
        <a
          href="/recipes/select"
          className="px-4 py-2 rounded-md text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Generar PDF
        </a>
        <AddRecipesButton />
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-8">
        {recipes.length === 0 ? (
          <div className="flex flex-1 items-center justify-center min-h-[50vh]">
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Todavía no hay recetas cargadas.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
            {totalPages > 1 && (
              <RecipesPagination
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
