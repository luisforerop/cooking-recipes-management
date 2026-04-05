"use client";

import { Recipe } from "@/lib/types/recipe";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { FC } from "react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isNA(value: string | undefined | null): boolean {
  return !value || value.trim() === "" || value.trim().toUpperCase() === "N/A";
}

function assetUrl(path: string): string {
  if (globalThis.window !== undefined) {
    return `${globalThis.window.location.origin}${path}`;
  }
  return path;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  iconSmall: {
    width: 36,
    height: 36,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 14,
    letterSpacing: 1,
    borderBottom: "1px solid #000",
    borderBottomStyle: "dashed",
    paddingBottom: 8,
    textAlign: "center",
    width: "100%",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sectionContainer: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 10,
  },
  groupTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
    marginBottom: 2,
  },
  item: {
    fontSize: 9,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  iconInlineRow: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 4,
  },
  iconInline: {
    width: 20,
    height: 20,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#888888",
  },
});

// ---------------------------------------------------------------------------
// Sub-renders
// ---------------------------------------------------------------------------

function RecipeHeaderSection({ recipe }: Readonly<{ recipe: Recipe }>) {
  return (
    <>
      <View style={styles.titleContainer}>
        <Image style={styles.iconSmall} src={assetUrl("/cooking-book.png")} />
        <Text style={styles.title}>{recipe.title.toUpperCase()}</Text>
      </View>

      {!isNA(recipe.servings) && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Rendimiento</Text>
          <Text style={styles.sectionValue}>{recipe.servings}</Text>
        </View>
      )}
    </>
  );
}

function IngredientsSection({ recipe }: Readonly<{ recipe: Recipe }>) {
  return (
    <View style={{ ...styles.sectionContainer, marginBottom: 24 }}>
      <View style={styles.iconInlineRow}>
        <Image
          style={{ ...styles.iconInline, marginBottom: 8 }}
          src={assetUrl("/ingredients.png")}
        />
        <Text style={styles.sectionLabel}>Ingredientes</Text>
      </View>
      <View>
        {recipe.ingredients.map((group, gi) => (
          <View
            key={group.title ?? `ing-group-${gi}`}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {group.title && (
              <Text style={styles.groupTitle}>{group.title}</Text>
            )}
            {group.items.map((ing) => (
              <Text
                key={`${gi}-${ing.name}`}
                style={{ ...styles.item, textAlign: "center" }}
              >
                {ing.name}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function PreparationSection({ recipe }: Readonly<{ recipe: Recipe }>) {
  return (
    <View
      style={{
        backgroundColor: "#8FC1B5",
        padding: "20px 24px",
        borderRadius: 4,
      }}
    >
      <View style={{ ...styles.sectionContainer, position: "relative" }}>
        <View
          style={{
            padding: 8,
            borderRadius: 4,
            backgroundColor: "#007566",
            position: "absolute",
            left: 5,
            top: -30,
            display: "flex",
          }}
        >
          <Image
            style={{ ...styles.iconInline }}
            src={assetUrl("/recipe-white.png")}
          />
        </View>
        <Text style={{ ...styles.sectionLabel, marginBottom: 16 }}>
          Procedimiento
        </Text>
        {recipe.preparation.map((group, gi) => (
          <View key={group.title ?? `prep-group-${gi}`}>
            {group.title && (
              <Text style={styles.groupTitle}>{group.title}</Text>
            )}
            {group.items.map((step, si) => (
              <Text
                key={`${gi}-step-${si}`}
                style={{
                  ...styles.item,
                  ...(si < group.items.length - 1 && {
                    borderBottom: "1px solid #000",
                    borderBottomStyle: "dashed",
                    marginBottom: 8,
                    paddingBottom: 8,
                  }),
                }}
              >
                {step.description}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type RecipePdfDocumentProps = {
  recipes: Recipe[];
};

export const RecipePdfDocument: FC<RecipePdfDocumentProps> = ({ recipes }) => {
  return (
    <Document>
      {recipes.flatMap((recipe) => {
        const isComplex =
          recipe.ingredients.length > 1 || recipe.preparation.length > 1;

        if (isComplex) {
          // Two pages: [0] title + rendimiento + ingredients, [1] procedimiento
          return [
            <Page key={`${recipe.id}-p1`} style={styles.page}>
              <RecipeHeaderSection recipe={recipe} />
              <IngredientsSection recipe={recipe} />
              <Text
                style={styles.pageNumber}
                render={({ pageNumber }) => `${pageNumber}`}
                fixed
              />
            </Page>,
            <Page key={`${recipe.id}-p2`} style={styles.page}>
              <PreparationSection recipe={recipe} />
              <Text
                style={styles.pageNumber}
                render={({ pageNumber }) => `${pageNumber}`}
                fixed
              />
            </Page>,
          ];
        }

        // Single page
        return [
          <Page key={recipe.id} style={styles.page}>
            <RecipeHeaderSection recipe={recipe} />
            <IngredientsSection recipe={recipe} />
            <PreparationSection recipe={recipe} />
            <Text
              style={styles.pageNumber}
              render={({ pageNumber }) => `${pageNumber}`}
              fixed
            />
          </Page>,
        ];
      })}
    </Document>
  );
};
