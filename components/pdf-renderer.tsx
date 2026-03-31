"use client";
import { RecipeRow } from "@/lib/supabase";
import { Recipe } from "@/lib/types/recipe";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  PDFViewer,
  View,
} from "@react-pdf/renderer";
import { FC } from "react";

import "next/dynamic";

type PdfRendererProps = {
  recipes: RecipeRow[];
};

const styles = StyleSheet.create({
  container: {
    padding: 100,
  },
});

export const PdfRenderer: FC<PdfRendererProps> = ({ recipes }) => {
  return (
    <PDFViewer width={"100%"} height={"700px"}>
      <Document>
        {recipes.map(({ ingredients, preparation, title }) => (
          <Page key={title} style={styles.container}>
            <Text>{title}</Text>
            {ingredients.map(({ items, title }, index) => (
              <View key={index}>
                <Text>{title}</Text>
                {items.map(({ name }) => (
                  <Text key={name}>{name}</Text>
                ))}
              </View>
            ))}
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
};
