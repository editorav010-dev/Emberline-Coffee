import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "../lib/utils";

type Tone = "default" | "success" | "error";

export interface ToastInput {
  title: string;
  message?: string;
  tone?: Tone;
  action?: { label: string; onClick: () => void };
}

interface Toast extends ToastInput {
  id: number;
}

interface ToastContextValue {
  push: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev.slice(-2), { ...input, id }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[95] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="anim-slideup pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-bark bg-espresso px-4 py-3 text-cream shadow-warm"
          >
            <span
              className={cx(
                "mt-1 inline-block h-2 w-2 shrink-0 rounded-full",
                t.tone === "success" && "bg-success",
                t.tone === "error" && "bg-error",
                (!t.tone || t.tone === "default") && "bg-caramel",
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">{t.title}</p>
              {t.message ? <p className="mt-0.5 text-xs leading-relaxed text-cream/70">{t.message}</p> : null}
              {t.action ? (
                <button
                  type="button"
                  onClick={() => {
                    t.action?.onClick();
                    dismiss(t.id);
                  }}
                  className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-caramel underline-offset-4 hover:underline"
                >
                  {t.action.label}
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="rounded p-1 text-cream/50 transition-colors hover:text-cream"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
