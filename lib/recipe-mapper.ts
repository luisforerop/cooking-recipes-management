import { RecipeFullRow } from "./supabase";
import { Recipe } from "./types/recipe";

/**
 * Maps a Supabase `RecipeFullRow` (snake_case) to the domain `Recipe` type (camelCase).
 */
export function mapRowToRecipe(row: RecipeFullRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    servings: row.servings,
    preparationTime: row.preparation_time,
    ingredients: row.ingredients,
    preparation: row.preparation,
    nutritionalInformation: row.nutritional_information ?? undefined,
    complementaries: row.complementaries,
    additionalInfo: row.additional_info,
  };
}
