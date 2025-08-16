
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

export default function ConfirmDeleteModalAgent({
    open,
    loading = false,
    title = "Delete Item?",
    description = "This action cannot be undone. You will permanently delete:",
    item = {},
    onClose,
    onConfirm,
    confirmText = "Delete",
    cancelText = "Cancel",
}) {
    const metaLines = Array.isArray(item?.meta)
        ? item.meta
        : item?.meta
            ? [item.meta]
            : [];

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60]"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                        onClick={() => !loading && onClose?.()}
                    />

                    {/* Dialog */}
                    <motion.div
                        key="dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-title"
                        aria-describedby="delete-desc"
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="fixed inset-0 z-[61] flex items-end sm:items-center justify-center p-4"
                    >
                        <div
                            className="w-full max-w-[28rem] sm:max-w-md rounded-2xl border shadow-xl"
                            style={{
                                background: "var(--surface-elevated)",
                                borderColor: "var(--border-light)",
                            }}
                        >
                            {/* Header */}
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
                                    {title}
                                </h2>
                            </div>

                            {/* Body */}
                            <div className="px-5 pt-3 pb-5">
                                <p
                                    id="delete-desc"
                                    className="text-sm"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {description}
                                </p>

                                <div
                                    className="mt-3 rounded-lg border px-4 py-3 text-sm"
                                    style={{
                                        borderColor: "var(--border-light)",
                                        color: "var(--text-primary)",
                                        background: "var(--surface-secondary)",
                                    }}
                                >
                                    {!!item?.name && (
                                        <span className="font-medium">{item.name}</span>
                                    )}
                                    {metaLines.length > 0 && (
                                        <div
                                            className="mt-1 text-xs"
                                            style={{ color: "var(--text-tertiary)" }}
                                        >
                                            {metaLines.join(" • ")}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                                    {/* Cancel */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => !loading && onClose?.()}
                                        disabled={loading}
                                        aria-label={cancelText}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all disabled:opacity-60"
                                        style={{
                                            background: "var(--surface-elevated)",
                                            color: "var(--text-primary)",
                                            borderColor: "var(--border-light)",
                                            outline: "none",
                                            boxShadow:
                                                "0 1px 0 rgba(255,255,255,.04) inset, 0 6px 20px rgba(0,0,0,.04)",
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        <span>{cancelText}</span>
                                    </motion.button>

                                    {/* Delete */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => !loading && onConfirm?.()}
                                        disabled={loading}
                                        aria-label={confirmText}
                                        aria-busy={loading}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                                        style={{
                                            background: "var(--primary)",
                                            color: "var(--text-inverse)",
                                            outline: "none",
                                            boxShadow: "0 10px 24px rgba(0,0,0,.10)",
                                        }}
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                        <span>{loading ? "Deleting…" : confirmText}</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
