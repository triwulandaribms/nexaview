"use client";

import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LLMSelectionModal = ({
  isOpen,
  onClose,
  onSelectLLM,
  selectedLLM,
  llms,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectLLM = (llm) => {
    onSelectLLM(llm.llm);
    onClose();
  };

  function getCategory(llm) {
    if (llm === "gpt-oss-120b") return "ElevenLabs";
    if (llm.startsWith("claude")) return "Anthropic";
    if (llm.startsWith("gpt")) return "OpenAI";
    if (llm.startsWith("gemini")) return "Google";
    if (llm.startsWith("custom")) return "Custom";
    return "ElevenLabs";
  }

  const showLlm = [
    "qwen3-30b-a3b",
    "glm-45-air-fp8",
    "gpt-oss-120b",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gpt-5",
    "gpt-5-mini",
    "gpt-5-nano",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4-turbo",
    "gpt-3.5-turbo",
    "claude-sonnet-4-5",
    "claude-sonnet-4",
    "claude-haiku-4-5",
    "claude-3-7-sonnet",
    "claude-3-5-sonnet",
    "claude-3-haiku",
    "custom-llm",
  ];

  const categoryOrder = [
    "ElevenLabs",
    "Google",
    "OpenAI",
    "Anthropic",
    "Custom",
  ];

  const filteredLLMs = llms.filter((item) => {
    if (!showLlm.includes(item.llm)) return false;
    return item.llm.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const grouped = filteredLLMs.reduce((acc, item) => {
    if (!showLlm.includes(item.llm)) return acc;
    const category = getCategory(item.llm);

    if (!acc[category]) acc[category] = [];
    acc[category].push(item);

    return acc;
  }, {});

  function formatPrice(value) {
    return `${value.toFixed(4)}/min`;
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="relative h-full border-l border-y backdrop-blur-sm w-[500px] max-sm:w-full overflow-y-auto"
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
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-(--surface-secondary) transition-colors"
              >
                <ChevronLeft
                  className="size-5"
                  style={{ color: "var(--text-primary)" }}
                />
              </button>
              <h2
                className="text-lg font-semibold flex-1"
                style={{ color: "var(--text-primary)" }}
              >
                Select primary LLM
              </h2>
            </div>

            {/* Search Bar */}
            <div
              className="p-4 sticky top-[53px] z-10"
              style={{ background: "var(--surface-elevated)" }}
            >
              <div
                className="relative flex items-center rounded-xl border"
                style={{
                  background: "var(--surface-secondary)",
                  borderColor: "var(--border-light)",
                }}
              >
                <Search
                  className="absolute left-4 size-5"
                  style={{ color: "var(--text-secondary)" }}
                />
                <input
                  type="text"
                  placeholder="Search LLM"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none rounded-xl"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </div>

            {/* LLM List */}
            <div className="px-4 pb-6 space-y-6">
              {Object.entries(grouped)
                .sort(
                  (a, b) =>
                    categoryOrder.indexOf(a[0]) - categoryOrder.indexOf(b[0])
                )
                .map(([category, items]) => (
                  <div key={category}>
                    <h2 className="text-base mb-2 text-(--text-secondary)">
                      {category}
                    </h2>

                    <div className="flex flex-col">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="py-2 px-4 hover:bg-(--surface-secondary) transition-all duration-100 rounded-xl cursor-pointer"
                          onClick={() => handleSelectLLM(item)}
                        >
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="size-4" />
                              <span className="text-base font-medium text-(--text-primary)">
                                {category === "Custom"
                                  ? "Custom LLM"
                                  : item.llm}
                              </span>
                            </div>
                            {category !== "Custom" && (
                              <span className="text-[12px] text-(--text-secondary)">
                                ~${formatPrice(item.price_per_minute)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {(!llms || Object.keys(llms).length === 0) && (
                <div
                  className="text-center py-12"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <p className="text-lg">No LLMs found</p>
                  {searchQuery && (
                    <p className="text-sm mt-2">Try a different search term</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LLMSelectionModal;
