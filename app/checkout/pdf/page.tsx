"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useRecipePdfCart } from "@/lib/hooks/use-recipe-pdf-cart";
import { RecipePdfDocument } from "@/components/recipe-pdf-document";

export default function CheckoutPdfPage() {
  const { cart } = useRecipePdfCart();
  // Avoid SSR mismatch: only render PDF components after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 py-24 text-center px-6">
        <p className="text-zinc-500 dark:text-zinc-400 text-base">
          No hay recetas en el carrito.
        </p>
        <Link
          href="/recipes/select"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-50 underline underline-offset-4"
        >
          Seleccionar recetas
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col gap-4 px-6 py-8 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Previsualización de PDF
      </h1>

      <PDFViewer width="100%" height="700px" className="rounded-lg border border-zinc-200 dark:border-zinc-800">
        <RecipePdfDocument recipes={cart} />
      </PDFViewer>

      <PDFDownloadLink
        document={<RecipePdfDocument recipes={cart} />}
        fileName="recetas.pdf"
        className="self-start inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
      >
        {({ loading }) => (loading ? "Generando PDF…" : "Descargar PDF")}
      </PDFDownloadLink>
    </main>
  );
}

