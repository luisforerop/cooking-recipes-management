"use server";

import { supabase } from "@/lib/supabase";
import type { Recipe } from "@/lib/types/recipe";

// Maps the camelCase Recipe type to the snake_case column names in the `recipes` table.
// preparationTime        → preparation_time
// nutritionalInformation → nutritional_information
// additionalInfo         → additional_info (omitted when undefined so DB applies DEFAULT '{}')
function toDbRow(recipe: Recipe) {
  return {
    title: recipe.title,
    servings: recipe.servings,
    preparation_time: recipe.preparationTime,
    ingredients: recipe.ingredients,
    preparation: recipe.preparation,
    nutritional_information: recipe.nutritionalInformation ?? null,
    complementaries: recipe.complementaries,
    ...(recipe.additionalInfo !== undefined && {
      additional_info: recipe.additionalInfo,
    }),
  };
}

export type UploadResult =
  | { status: "success" }
  | { status: "error"; message: string };

/**
 * Inserts multiple recipes into Supabase.
 * Returns one result per recipe in the same order as the input array.
 */
export async function uploadRecipes(
  recipes: Recipe[],
): Promise<UploadResult[]> {
  const rows = recipes.map(toDbRow);

  // Supabase insert returns a single error for the whole batch.
  // For per-row granularity we insert one by one.
  const results: UploadResult[] = await Promise.all(
    rows.map(async (row) => {
      const { error } = await supabase.from("recipes").insert(row);
      if (error) {
        return { status: "error", message: error.message } as UploadResult;
      }
      return { status: "success" } as UploadResult;
    }),
  );

  return results;
}

/**
 * Inserts a single recipe into Supabase.
 */
export async function uploadSingleRecipe(
  recipe: Recipe,
): Promise<UploadResult> {
  const results = await uploadRecipes([recipe]);
  return results[0];
}
