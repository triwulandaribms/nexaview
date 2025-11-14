"use client";

import { X, Lock } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddSecretModal = ({ isOpen, onClose, onAddSecret }) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const handleClose = () => {
    setName("");
    setValue("");
    onClose();
  };

  const handleAddSecret = () => {
    if (name.trim() && value.trim()) {
      onAddSecret({ name: name.trim(), value: value.trim() });
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative h-full border-l border-y backdrop-blur-sm shadow-2xl w-[500px] max-sm:w-full overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center gap-3 p-2 border-b sticky top-0 z-10"
              style={{
                borderColor: "var(--border-light)",
                background: "var(--surface-elevated)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--surface-secondary)" }}
              >
                <Lock
                  className="size-4"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
              <h2
                className="text-sm font-semibold flex-1"
                style={{ color: "var(--text-primary)" }}
              >
                Add secret
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-(--surface-secondary) transition-colors"
              >
                <X
                  className="size-5"
                  style={{ color: "var(--text-secondary)" }}
                />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-6">
              {/* Description */}
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Securely store a value that can be used by the tools. Once added
                the value cannot be retrieved.
              </p>

              {/* Name Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none transition-all"
                  style={{
                    background: "var(--surface-secondary)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-light)";
                  }}
                  placeholder="Enter secret name"
                />
              </div>

              {/* Value Textarea */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Value
                </label>
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none transition-all resize-none"
                  style={{
                    background: "var(--surface-secondary)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-light)";
                  }}
                  placeholder="Enter secret value"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 absolute bottom-4 right-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl font-medium transition-all hover:bg-opacity-80"
                  style={{
                    background: "var(--surface-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSecret}
                  disabled={!value.trim()}
                  className="px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--primary)",
                    color: "white",
                  }}
                >
                  Add secret
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSecretModal;
