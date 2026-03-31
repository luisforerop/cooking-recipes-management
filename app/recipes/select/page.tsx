import { getRecipesFullData } from "@/lib/supabase";
import { mapRowToRecipe } from "@/lib/recipe-mapper";
import { RecipeSelectionTable } from "@/components/recipe-selection-table";
import { RecipeSelectionPagination } from "@/components/recipe-selection-pagination";
import { PageSizeSelector } from "@/components/page-size-selector";

const DEFAULT_PAGE_SIZE = 25;
const VALID_PAGE_SIZES = new Set([10, 25, 50]);

export default async function RecipeSelectPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}>) {
  const { page: pageParam, pageSize: pageSizeParam } = await searchParams;

  const currentPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const parsedPageSize = Number.parseInt(
    pageSizeParam ?? String(DEFAULT_PAGE_SIZE),
    10,
  );
  const pageSize = VALID_PAGE_SIZES.has(parsedPageSize)
    ? parsedPageSize
    : DEFAULT_PAGE_SIZE;

  const { data: rows, count } = await getRecipesFullData(currentPage, pageSize);
  const recipes = rows.map(mapRowToRecipe);
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <a
          href="/recipes"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← Recetas
        </a>
        <h1 className="flex-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Seleccionar recetas para PDF
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-8 flex flex-col gap-4">
        {/* Controls row */}
        <div className="flex items-center justify-end">
          <PageSizeSelector currentPageSize={pageSize} />
        </div>

        {/* Selection table */}
        <RecipeSelectionTable recipes={recipes} totalCount={count} />

        {/* Pagination */}
        {totalPages > 1 && (
          <RecipeSelectionPagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </main>
    </div>
  );
}
