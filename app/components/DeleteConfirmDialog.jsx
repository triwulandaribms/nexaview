"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function DeleteConfirmDialog({
  open = false,
  onClose,
  onConfirm,
  deleting = false,
  item,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    dialogRef.current?.focus();

    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, [open, onClose]);

  const formatSize = (bytes) =>
    bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : "-";

  const metaList = [
    item?.file_type,
    item?.processing_status,
    item?.created_at ? `Created: ${item.created_at}` : null,
    item?.updated_at ? `Updated: ${item.updated_at}` : null,
    item?.file_size ? `Size: ${formatSize(item.file_size)}` : null,
    item?.category ? `${item.category.length} categories` : null,
    item?.tags ? `${item.tags.length} tags` : null,
  ].filter(Boolean);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="overlay"
            aria-label="Close dialog"
            onClick={() => !deleting && onClose?.()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] cursor-default"
            style={{ background: "rgba(0,0,0,0.5)" }}
          />

          <motion.div
            key="container"
            className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              aria-describedby="delete-desc"
              ref={dialogRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-[28rem] sm:max-w-md rounded-t-3xl sm:rounded-2xl border shadow-xl outline-none"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
              }}
            >
              <div className="flex items-center gap-3 px-5 pt-5">
                <div
                  className="p-2 rounded-xl"
                  style={{ background: "var(--surface-secondary)" }}
                >
                  <AlertTriangle
                    className="h-5 w-5"
                    style={{ color: "var(--primary)" }}
                  />
                </div>
                <h2
                  id="delete-title"
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Delete this dataset?
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !deleting && onClose?.()}
                  aria-label="Close"
                  className="ml-auto p-2 rounded"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="px-5 pt-3 pb-5">
                <p
                  id="delete-desc"
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  This action <span className="font-medium">cannot be undone</span>.
                  The following item will be removed permanently:
                </p>

                <div
                  className="mt-3 rounded-lg border px-4 py-3 text-sm flex items-center gap-3"
                  style={{
                    borderColor: "var(--border-light)",
                    background: "var(--surface-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <div
                    className="shrink-0 rounded-md flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      background: "rgba(99,102,241,.12)",
                      color: "rgb(99,102,241)",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {item?.name?.[0]?.toUpperCase() ?? "F"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item?.name}</div>
                    <div
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {item?.categories ? `${item.categories.length} categories` : "0 categories"} •{" "}
                      {item?.tags ? `${item.tags.length} tags` : "0 tags"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !deleting && onClose?.()}
                    disabled={deleting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all disabled:opacity-60"
                    style={{
                      background: "var(--surface-elevated)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    disabled={deleting}
                    aria-busy={deleting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                    style={{
                      background: "var(--primary)",
                      color: "var(--text-inverse)",
                      boxShadow: "0 8px 20px rgba(0,0,0,.1)",
                    }}
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span>{deleting ? "Deleting…" : "Delete"}</span>
                  </motion.button>
                </div>
              </div>


            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
