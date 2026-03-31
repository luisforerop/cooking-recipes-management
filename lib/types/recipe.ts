// Generic section type to support simple or multi-part recipes
export interface Section<T> {
  title?: string;
  items: T[];
}

// Ingredient model
export interface Ingredient {
  name: string;
}

// Preparation step model
export interface PreparationStep {
  description: string;
}

// Allowed nutritional information types
export type NutritionalType = "calories" | "protein" | "carbohydrates" | "fat";

// Nutritional information entry
export interface NutritionalInfo {
  type: NutritionalType;
  content: string;
}

// Complementary content (variations, tips, notes, etc.)
export interface Complementary {
  type: string;
  content: string;
}

// Main recipe interface
export interface Recipe {
  /** Supabase UUID — used as unique key for cart deduplication */
  id: string;

  title: string;

  /** Number of portions the recipe yields */
  servings: string;

  /** Time required for preparation and/or cooking */
  preparationTime: string;

  ingredients: Section<Ingredient>[];
  preparation: Section<PreparationStep>[];

  /** Optional nutritional data per serving */
  nutritionalInformation?: NutritionalInfo[];

  complementaries: Complementary[];

  /** Unstructured additional data stored as jsonb in the DB. Omit to use DB default `{}`. */
  additionalInfo?: Record<string, unknown>;
}
