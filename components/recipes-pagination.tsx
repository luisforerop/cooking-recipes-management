"use client";

import { useRouter, usePathname } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
}

export function RecipesPagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button
        disabled={isFirst}
        onClick={() => navigate(currentPage - 1)}
        className="px-4 py-2 rounded-md text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        Página {currentPage} de {totalPages}
      </span>
      <button
        disabled={isLast}
        onClick={() => navigate(currentPage + 1)}
        className="px-4 py-2 rounded-md text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
}
