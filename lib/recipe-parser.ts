import type {
  Recipe,
  Section,
  Ingredient,
  PreparationStep,
  NutritionalInfo,
  NutritionalType,
  Complementary,
} from "@/lib/types/recipe";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert an ALL-CAPS string to Sentence case. */
function toSentenceCase(str: string): string {
  if (!str) return str;
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** Map Spanish nutritional label to NutritionalType. */
function mapNutritionalType(label: string): NutritionalType | null {
  const normalized = label.trim().toLowerCase();
  if (normalized.startsWith("calor")) return "calories";
  if (normalized.startsWith("prote")) return "protein";
  if (normalized.startsWith("carboh")) return "carbohydrates";
  if (normalized.startsWith("grasa") || normalized.startsWith("fat"))
    return "fat";
  return null;
}

// Keywords that must NOT be treated as subsection titles inside INGREDIENTES
const RESERVED_PREFIXES = /^(ITEM:|PASO\s+\d+:|VALOR:|TIPO:|CONTENIDO:)/i;

// ---------------------------------------------------------------------------
// Section parsing helpers
// ---------------------------------------------------------------------------

function parseIngredients(lines: string[]): Section<Ingredient>[] {
  const sections: Section<Ingredient>[] = [];
  let current: Section<Ingredient> | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.toUpperCase().startsWith("ITEM:")) {
      const name = line.replace(/^ITEM:\s*/i, "").trim();
      if (!current) {
        current = { items: [] };
        sections.push(current);
      }
      current.items.push({ name });
    } else if (line.endsWith(":") && !RESERVED_PREFIXES.test(line)) {
      // Subsection title (e.g. "Masa:", "Relleno:")
      const title = line.slice(0, -1).trim();
      current = { title, items: [] };
      sections.push(current);
    }
  }

  return sections;
}

function parsePreparation(lines: string[]): Section<PreparationStep>[] {
  const items: PreparationStep[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    // Match "PASO 1:", "PASO 2:", etc.
    const match = line.match(/^PASO\s+\d+:\s*/i);
    if (match) {
      const description = line.slice(match[0].length).trim();
      if (description) items.push({ description });
    }
  }

  return items.length > 0 ? [{ items }] : [];
}

function parseNutritionalInfo(lines: string[]): NutritionalInfo[] {
  const result: NutritionalInfo[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.toUpperCase().startsWith("VALOR:")) {
      const rest = line.replace(/^VALOR:\s*/i, "").trim();
      const parts = rest.split("|");
      if (parts.length >= 2) {
        const label = parts[0].trim();
        const content = parts[1].trim();
        const type = mapNutritionalType(label);
        if (type) {
          result.push({ type, content });
        }
      }
    }
  }

  return result;
}

function parseComplementaries(lines: string[]): Complementary[] {
  const result: Complementary[] = [];
  let pendingType: string | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.toUpperCase().startsWith("TIPO:")) {
      pendingType = line
        .replace(/^TIPO:\s*/i, "")
        .trim()
        .toLowerCase();
    } else if (line.toUpperCase().startsWith("CONTENIDO:")) {
      const content = line.replace(/^CONTENIDO:\s*/i, "").trim();
      if (pendingType !== null) {
        result.push({ type: pendingType, content });
        pendingType = null;
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Per-recipe parser
// ---------------------------------------------------------------------------

type SectionName =
  | "header"
  | "ingredientes"
  | "preparacion"
  | "nutricional"
  | "complementarios"
  | "none";

function detectSection(line: string): SectionName | null {
  const upper = line.toUpperCase().trim();
  if (upper.startsWith("INGREDIENTES")) return "ingredientes";
  if (upper.startsWith("PREPARACI")) return "preparacion"; // PREPARACIÓN
  if (upper.startsWith("INFORMACI")) return "nutricional"; // INFORMACIÓN NUTRICIONAL
  if (upper.startsWith("COMPLEMENTARIOS")) return "complementarios";
  return null;
}

function parseOneRecipe(block: string): Recipe | null {
  const lines = block.split("\n");

  let title = "";
  let servings = "";
  let preparationTime = "";

  const sectionLines: Record<SectionName, string[]> = {
    header: [],
    ingredientes: [],
    preparacion: [],
    nutricional: [],
    complementarios: [],
    none: [],
  };

  let currentSection: SectionName = "header";

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const detected = detectSection(line);
    if (detected) {
      currentSection = detected;
      continue;
    }

    if (currentSection === "header") {
      if (line.toUpperCase().startsWith("TÍTULO:")) {
        title = line.replace(/^TÍTULO:\s*/i, "").trim();
      } else if (line.toUpperCase().startsWith("RENDIMIENTO:")) {
        servings = line.replace(/^RENDIMIENTO:\s*/i, "").trim();
      } else if (line.toUpperCase().startsWith("TIEMPO:")) {
        preparationTime = line.replace(/^TIEMPO:\s*/i, "").trim();
      }
    } else {
      sectionLines[currentSection].push(line);
    }
  }

  if (!title) return null;

  const nutritionalInformation = parseNutritionalInfo(
    sectionLines["nutricional"],
  );

  return {
    title: toSentenceCase(title),
    servings,
    preparationTime,
    ingredients: parseIngredients(sectionLines["ingredientes"]),
    preparation: parsePreparation(sectionLines["preparacion"]),
    nutritionalInformation:
      nutritionalInformation.length > 0 ? nutritionalInformation : undefined,
    complementaries: parseComplementaries(sectionLines["complementarios"]),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse one or more recipes in the custom MD format and return a Recipe array.
 * Multiple recipes are separated by a new TÍTULO: line.
 */
export function parseRecipes(input: string): Recipe[] {
  if (!input || !input.trim()) return [];

  // Split on lines that start with TÍTULO: to detect recipe boundaries.
  // We keep the delimiter by using a lookahead split.
  const blocks = input.split(/(?=^\s*TÍTULO:)/im).filter((b) => b.trim());

  const recipes: Recipe[] = [];
  for (const block of blocks) {
    const recipe = parseOneRecipe(block);
    if (recipe) recipes.push(recipe);
  }

  return recipes;
}
