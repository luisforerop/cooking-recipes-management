import { createClient } from "@supabase/supabase-js";

export interface RecipeRow {
  id: string;
  title: string;
  ingredients: Array<{ title?: string; items: Array<{ name: string }> }>;
  preparation: Array<{
    title?: string;
    items: Array<{ description: string }>;
  }>;
}

const PAGE_SIZE = 9;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. " +
      "Add it to your .env.local file.",
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Add it to your .env.local file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getRecipes(
  page: number,
  pageSize: number = PAGE_SIZE,
): Promise<{ data: RecipeRow[]; count: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("recipes")
    .select("id, title, ingredients, preparation", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { data: (data as RecipeRow[]) ?? [], count: count ?? 0 };
}
