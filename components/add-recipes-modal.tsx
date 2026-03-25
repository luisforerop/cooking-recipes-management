"use client";

import { useState, useEffect } from "react";
import type { Recipe } from "@/lib/types/recipe";
import { parseRecipes } from "@/lib/recipe-parser";
import { RecipeUploadTable } from "@/components/recipe-upload-table";

type FieldType = "string" | "number" | "boolean" | "json";

interface AdditionalInfoEntry {
  key: string;
  type: FieldType;
  value: string;
}

type Step = "format" | "markdown" | "additional-info" | "upload";

const VALUE_PLACEHOLDERS: Record<FieldType, string> = {
  string: "Valor",
  number: "Ej: 42",
  boolean: "true | false",
  json: 'Ej: {"clave": "valor"}',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function AddRecipesModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("format");
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<AdditionalInfoEntry[]>([]);
  const [formKey, setFormKey] = useState("");
  const [formType, setFormType] = useState<FieldType>("string");
  const [formValue, setFormValue] = useState("");
  const [keyError, setKeyError] = useState("");
  const [valueError, setValueError] = useState("");

  const debouncedInput = useDebounce(input, 300);
  const parsed: Recipe[] = debouncedInput.trim()
    ? parseRecipes(debouncedInput)
    : [];

  // Count blocks that look like recipe starts but failed to parse
  const attemptedBlocks = debouncedInput.trim()
    ? (debouncedInput.match(/^\s*TÍTULO:/gim) ?? []).length
    : 0;
  const errorCount = Math.max(0, attemptedBlocks - parsed.length);

  // Build additionalInfo record from the entries list, casting each value to its declared type
  const additionalInfo: Record<string, unknown> = Object.fromEntries(
    entries.map((e) => {
      let v: unknown = e.value;
      if (e.type === "number") v = parseFloat(e.value);
      else if (e.type === "boolean") v = e.value === "true";
      else if (e.type === "json") {
        try {
          v = JSON.parse(e.value);
        } catch {
          v = e.value;
        }
      }
      return [e.key, v];
    }),
  );

  // Enrich parsed recipes with additionalInfo for the upload step
  const parsedWithInfo: Recipe[] = parsed.map((r) => ({
    ...r,
    additionalInfo,
  }));

  function handleAddEntry() {
    if (!formKey.trim()) {
      setKeyError("La propiedad no puede estar vacía");
      return;
    }
    if (formType === "boolean") {
      const v = formValue.trim();
      if (v !== "true" && v !== "false") {
        setValueError('El valor debe ser "true" o "false"');
        return;
      }
    }
    if (formType === "json") {
      try {
        JSON.parse(formValue);
      } catch {
        setValueError("El valor no es un JSON válido");
        return;
      }
    }
    setEntries((prev) => [
      ...prev,
      { key: formKey.trim(), type: formType, value: formValue },
    ]);
    setFormKey("");
    setFormValue("");
    setKeyError("");
    setValueError("");
  }

  function handleClose() {
    onClose();
    // Reset after close animation completes
    setTimeout(() => {
      setStep("format");
      setInput("");
      setEntries([]);
      setFormKey("");
      setFormType("string");
      setFormValue("");
      setKeyError("");
      setValueError("");
    }, 200);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {step === "format" && "Agregar recetas"}
            {step === "markdown" && "Pegar recetas en Markdown"}
            {step === "additional-info" && "Información adicional"}
            {step === "upload" && "Confirmar carga"}
          </h2>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto flex-1">
          {/* ── Step: format ── */}
          {step === "format" && (
            <div className="px-6 py-8">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Elegí el formato en el que vas a cargar las recetas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <FormatButton
                  label="Markdown"
                  description="Formato .md personalizado"
                  enabled
                  onClick={() => setStep("markdown")}
                />
                <FormatButton
                  label="CSV"
                  description="Próximamente"
                  enabled={false}
                  onClick={() => {}}
                />
                <FormatButton
                  label="JSON"
                  description="Próximamente"
                  enabled={false}
                  onClick={() => {}}
                />
              </div>
            </div>
          )}

          {/* ── Step: markdown ── */}
          {step === "markdown" && (
            <div className="flex flex-col sm:flex-row h-[480px]">
              {/* Left: textarea */}
              <div className="flex flex-col flex-1 border-r border-zinc-200 dark:border-zinc-800">
                <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shrink-0">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Markdown
                  </span>
                </div>
                <textarea
                  className="flex-1 w-full resize-none p-4 text-sm font-mono bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none"
                  placeholder={`TÍTULO: NOMBRE DE LA RECETA\nRENDIMIENTO: X porciones\nTIEMPO: X minutos\n\nINGREDIENTES:\n\nITEM: …`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  spellCheck={false}
                  autoFocus
                />
              </div>

              {/* Right: summary */}
              <div className="sm:w-64 flex flex-col bg-zinc-50 dark:bg-zinc-950 shrink-0">
                <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shrink-0">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Resumen
                  </span>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-3">
                  <SummaryItem
                    label="Recetas detectadas"
                    value={parsed.length}
                    variant={parsed.length > 0 ? "success" : "neutral"}
                  />
                  {errorCount > 0 && (
                    <SummaryItem
                      label="Con errores"
                      value={errorCount}
                      variant="error"
                    />
                  )}
                  {!debouncedInput.trim() && (
                    <p className="text-xs text-zinc-400">
                      Pegá recetas en el editor para ver el resumen.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step: additional-info ── */}
          {step === "additional-info" && (
            <div className="flex flex-col gap-6 px-6 py-6">
              {/* Form */}
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Agregá información adicional que se aplicará a todas las
                  recetas del lote (opcional).
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      placeholder="Propiedad"
                      value={formKey}
                      onChange={(e) => {
                        setFormKey(e.target.value);
                        setKeyError("");
                      }}
                      className={`w-full text-sm px-3 py-2 rounded-md border bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 ${
                        keyError
                          ? "border-red-400"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    />
                    {keyError && (
                      <span className="text-xs text-red-500">{keyError}</span>
                    )}
                  </div>
                  <select
                    value={formType}
                    onChange={(e) => {
                      setFormType(e.target.value as FieldType);
                      setValueError("");
                    }}
                    className="text-sm px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="json">json</option>
                  </select>
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      placeholder={VALUE_PLACEHOLDERS[formType]}
                      value={formValue}
                      onChange={(e) => {
                        setFormValue(e.target.value);
                        setValueError("");
                      }}
                      className={`w-full text-sm px-3 py-2 rounded-md border bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 ${
                        valueError
                          ? "border-red-400"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    />
                    {valueError && (
                      <span className="text-xs text-red-500">{valueError}</span>
                    )}
                  </div>
                  <button
                    onClick={handleAddEntry}
                    className="text-sm px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Entries list */}
              {entries.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">
                  No hay propiedades adicionales. Podés continuar sin agregar
                  ninguna.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {entries.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    >
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex-1 truncate">
                        {entry.key}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shrink-0">
                        {entry.type}
                      </span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 flex-1 truncate font-mono">
                        {entry.value}
                      </span>
                      <button
                        onClick={() => {
                          const e = entries[index];
                          setFormKey(e.key);
                          setFormType(e.type);
                          setFormValue(e.value);
                          setEntries((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
                        className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors shrink-0"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          setEntries((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors shrink-0"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step: upload ── */}
          {step === "upload" && (
            <div className="overflow-y-auto">
              <RecipeUploadTable recipes={parsedWithInfo} />
            </div>
          )}
        </div>

        {/* Modal footer */}
        {(step === "markdown" ||
          step === "additional-info" ||
          step === "upload") && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              onClick={() => {
                if (step === "markdown") setStep("format");
                else if (step === "additional-info") setStep("markdown");
                else setStep("additional-info");
              }}
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              ← Atrás
            </button>
            {(step === "markdown" || step === "additional-info") && (
              <button
                onClick={() =>
                  step === "markdown"
                    ? setStep("additional-info")
                    : setStep("upload")
                }
                disabled={step === "markdown" && parsed.length === 0}
                className="text-sm px-4 py-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continuar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──

interface FormatButtonProps {
  label: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}

function FormatButton({
  label,
  description,
  enabled,
  onClick,
}: FormatButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      className={`flex-1 flex flex-col items-start gap-1 px-5 py-4 rounded-lg border text-left transition-colors
        ${
          enabled
            ? "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
            : "border-zinc-100 dark:border-zinc-800 opacity-40 cursor-not-allowed"
        }`}
    >
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {label}
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </span>
    </button>
  );
}

interface SummaryItemProps {
  label: string;
  value: number;
  variant: "success" | "error" | "neutral";
}

function SummaryItem({ label, value, variant }: SummaryItemProps) {
  const colors = {
    success: "text-green-700 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    neutral: "text-zinc-500 dark:text-zinc-400",
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${colors[variant]}`}>
        {value}
      </span>
    </div>
  );
}
