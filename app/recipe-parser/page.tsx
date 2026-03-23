"use client";

import { useState, useEffect, useCallback } from "react";
import { parseRecipes } from "@/lib/recipe-parser";
import type { Recipe } from "@/lib/types/recipe";
import { RecipeUploadTable } from "@/components/recipe-upload-table";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function RecipeParserPage() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  const [parsed, setParsed] = useState<Recipe[]>([]);

  useEffect(() => {
    setParsed(parseRecipes(debouncedInput));
  }, [debouncedInput]);

  const jsonOutput = parsed.length > 0 ? JSON.stringify(parsed, null, 2) : "";

  const handleCopy = useCallback(() => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [jsonOutput]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <a
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          ← Home
        </a>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Recipe Parser
        </h1>
        <span className="text-xs text-zinc-400">MD → JSON</span>
      </header>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Input panel */}
        <div className="flex flex-col flex-1 border-r border-zinc-200 dark:border-zinc-800">
          <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Markdown Input
            </span>
          </div>
          <textarea
            className="flex-1 w-full resize-none p-4 text-sm font-mono bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none"
            placeholder={`Paste one or more recipes here…\n\nTÍTULO: NOMBRE DE LA RECETA\nRENDIMIENTO: X porciones\nTIEMPO: X minutos\n\nINGREDIENTES:\n\nITEM: …`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Right: Output panel */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              JSON Output
            </span>
            <button
              onClick={handleCopy}
              disabled={!jsonOutput}
              className="text-xs px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {copied ? "Copied!" : "Copy JSON"}
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-zinc-50 dark:bg-zinc-950">
            {jsonOutput ? (
              <pre className="text-sm font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words">
                {jsonOutput}
              </pre>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400 text-sm">
                {input.trim()
                  ? "No valid recipes found. Check the format."
                  : "Paste a recipe in the left panel to see the JSON output."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload table — rendered below panels when recipes are parsed */}
      {parsed.length > 0 && <RecipeUploadTable recipes={parsed} />}
    </div>
  );
}
