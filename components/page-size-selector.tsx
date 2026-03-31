"use client";

import { useRouter, usePathname } from "next/navigation";

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

interface Props {
  currentPageSize: number;
}

export function PageSizeSelector({ currentPageSize }: Readonly<Props>) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    params.set("pageSize", e.target.value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <label htmlFor="page-size-select">Recetas por página:</label>
      <select
        id="page-size-select"
        value={currentPageSize}
        onChange={handleChange}
        className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
