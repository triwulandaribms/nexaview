"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, X, Check, Loader2 } from "lucide-react";

export default function EditDokumenModal({ open, doc, onSave, onClose }) {

  const [name, setName]       = useState("");
  const [categories, setCats] = useState([]);
  const [tags, setTags]       = useState([]);
  const [newCat, setNewCat]   = useState("");
  const [newTag, setNewTag]   = useState("");
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (open && doc) {
      setName(doc.name ?? "");
      setCats(doc.categories ?? []);
      setTags(doc.tags ?? []);
      setNewCat("");
      setNewTag("");
    }
  }, [open, doc]);

  const pushIfNotEmpty = (v, updater) => v.trim() && updater(p => [...p, v.trim()]);
  const removeIdx      = (idx, updater) => updater(p => p.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ ...doc, name: name.trim(), categories, tags });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* dialog */}
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-4"
          >
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[95vw] sm:max-w-md rounded-2xl border shadow-xl"
              style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
            >
              {/* header */}
              <div
                className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b"
                style={{ borderColor: "var(--border-light)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--surface-secondary)]">
                    <Edit className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    Edit Dokumen
                  </h2>
                </div>
                <button type="button" onClick={onClose} className="p-1 rounded hover:bg-[var(--surface-secondary)]">
                  <X className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
                </button>
              </div>

              {/* body */}
              <div className="px-4 sm:px-5 pt-4 pb-6 space-y-6">
                {/* name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                    Nama Dokumen
                  </label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    minLength={2}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm sm:text-base"
                    style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)", color: "var(--text-primary)", "--tw-ring-color": "var(--primary)" }}
                    placeholder="Nama dokumen"
                  />
                </div>

                {/* categories */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories.map((c, i) => (
                      <span
                        key={i}
                        onClick={() => removeIdx(i, setCats)}
                        className="px-3 py-1 rounded-full text-xs sm:text-sm bg-[var(--surface-secondary)] text-[var(--text-secondary)] cursor-pointer select-none"
                      >
                        {c} <X className="inline h-3 w-3" />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newCat}
                      onChange={e => setNewCat(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), pushIfNotEmpty(newCat, setCats), setNewCat(""))}
                      placeholder="Add category"
                      className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm sm:text-base"
                      style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)", color: "var(--text-primary)", "--tw-ring-color": "var(--primary)" }}
                    />
                    <button
                      type="button"
                      onClick={() => { pushIfNotEmpty(newCat, setCats); setNewCat(""); }}
                      className="px-4 py-2 rounded-lg font-medium text-xs sm:text-base"
                      style={{ background: "var(--primary)", color: "var(--text-inverse)" }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* tags */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((t, i) => (
                      <span
                        key={i}
                        onClick={() => removeIdx(i, setTags)}
                        className="px-3 py-1 rounded-full text-xs sm:text-sm bg-[var(--primary)]/10 text-[var(--primary)] cursor-pointer select-none"
                      >
                        {t} <X className="inline h-3 w-3" />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), pushIfNotEmpty(newTag, setTags), setNewTag(""))}
                      placeholder="Add tag"
                      className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm sm:text-base"
                      style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)", color: "var(--text-primary)", "--tw-ring-color": "var(--primary)" }}
                    />
                    <button
                      type="button"
                      onClick={() => { pushIfNotEmpty(newTag, setTags); setNewTag(""); }}
                      className="px-4 py-2 rounded-lg font-medium text-xs sm:text-base"
                      style={{ background: "var(--primary)", color: "var(--text-inverse)" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* footer */}
              <div
                className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-5 pt-4 pb-8 border-t"
                style={{ borderColor: "var(--border-light)" }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                   whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl border font-medium text-sm sm:text-base"
                  style={{ background: "var(--surface-elevated)", color: "var(--text-primary)", borderColor: "var(--border-light)" }}
                >
                  <X className="h-4 w-4" />
                  Batal
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-medium text-sm sm:text-base"
                  style={{ background: "var(--primary)", color: "var(--text-inverse)" }}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {saving ? "Menyimpan…" : "Simpan"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}