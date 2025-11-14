"use client";

import { Search, X, Check, Language, Languages } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LANGUAGES = [
  { name: "Arabic", code: "ar", model_id: "eleven_flash_v2_5" },
  { name: "Bulgarian", code: "bg", model_id: "eleven_flash_v2_5" },
  { name: "Chinese", code: "zh", model_id: "eleven_flash_v2_5" },
  { name: "Croatian", code: "hr", model_id: "eleven_flash_v2_5" },
  { name: "Czech", code: "cs", model_id: "eleven_flash_v2_5" },
  { name: "Danish", code: "da", model_id: "eleven_flash_v2_5" },
  { name: "Dutch", code: "nl", model_id: "eleven_flash_v2_5" },
  { name: "English", code: "en", model_id: "eleven_flash_v2" },
  { name: "Filipino", code: "fil", model_id: "eleven_flash_v2_5" },
  { name: "Finnish", code: "fi", model_id: "eleven_flash_v2_5" },
  { name: "French", code: "fr", model_id: "eleven_flash_v2_5" },
  { name: "German", code: "de", model_id: "eleven_flash_v2_5" },
  { name: "Greek", code: "el", model_id: "eleven_flash_v2_5" },
  { name: "Hindi", code: "hi", model_id: "eleven_flash_v2_5" },
  { name: "Hungarian", code: "hu", model_id: "eleven_flash_v2_5" },
  { name: "Indonesian", code: "id", model_id: "eleven_flash_v2_5" },
  { name: "Italian", code: "it", model_id: "eleven_flash_v2_5" },
  { name: "Japanese", code: "ja", model_id: "eleven_flash_v2_5" },
  { name: "Korean", code: "ko", model_id: "eleven_flash_v2_5" },
  { name: "Malay", code: "ms", model_id: "eleven_flash_v2_5" },
  { name: "Norwegian", code: "no", model_id: "eleven_flash_v2_5" },
  { name: "Polish", code: "pl", model_id: "eleven_flash_v2_5" },
  { name: "Portuguese", code: "pt", model_id: "eleven_flash_v2_5" },
  { name: "Romanian", code: "ro", model_id: "eleven_flash_v2_5" },
  { name: "Russian", code: "ru", model_id: "eleven_flash_v2_5" },
  { name: "Slovak", code: "sk", model_id: "eleven_flash_v2_5" },
  { name: "Spanish", code: "es", model_id: "eleven_flash_v2_5" },
  { name: "Swedish", code: "sv", model_id: "eleven_flash_v2_5" },
  { name: "Tamil", code: "ta", model_id: "eleven_flash_v2_5" },
  { name: "Turkish", code: "tr", model_id: "eleven_flash_v2_5" },
  { name: "Ukrainian", code: "uk", model_id: "eleven_flash_v2_5" },
  { name: "Vietnamese", code: "vi", model_id: "eleven_flash_v2_5" },
];

export const getLanguageByCode = (code) => {
  return LANGUAGES.find((lang) => lang.code === code) || LANGUAGES[7];
};

const LanguageSelectionModal = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  isDefault = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = LANGUAGES.filter((language) =>
    language?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (language) => {
    onSelectLanguage(language);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-end backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "rgba(0, 0, 0, 0.8)",
          }}
          onClick={onClose}
        >
          <motion.div
            className="relative h-full border-l border-y backdrop-blur-sm shadow-2xl w-[550px] max-sm:w-full"
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
              className="flex items-center justify-between p-2 border-b sticky top-0 z-10"
              style={{
                borderColor: "var(--border-light)",
                background: "var(--surface-elevated)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="size-8 rounded-full flex items-center justify-center"
                  style={{ background: "var(--surface-secondary)" }}
                >
                  <Languages
                    className="size-4"
                    style={{ color: "var(--text-primary)" }}
                  />
                </div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Default Language
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-(--surface-secondary) transition-colors"
              >
                <X
                  className="size-5"
                  style={{ color: "var(--text-secondary)" }}
                />
              </button>
            </div>

            {/* Search Bar */}
            <div
              className="p-4 pb-4 sticky top-[30px] z-10"
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
                  placeholder="Search for a language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-transparent focus:outline-none rounded-xl"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </div>

            {/* Language List */}
            <div className="px-4 pb-6 overflow-y-auto max-h-[calc(100vh-150px)] modal-content">
              {filteredLanguages.length === 0 ? (
                <div
                  className="text-center py-12"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <p className="text-lg">No languages found</p>
                  {searchQuery && (
                    <p className="text-sm mt-2">Try a different search term</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid-cols-2 grid gap-2">
                    {filteredLanguages.map((language) => {
                      const isSelected =
                        selectedLanguage?.code === language.code;
                      return (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageSelect(language)}
                          className="w-full cursor-pointer flex items-center justify-between p-2 rounded-xl border hover:border-[var(--primary)] transition-all duration-200 group hover:shadow-md"
                          style={{
                            background: isSelected
                              ? "var(--primary-light)"
                              : "var(--surface-secondary)",
                            borderColor: isSelected
                              ? "var(--primary)"
                              : "var(--border-light)",
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span
                                  className="font-semibold text-base"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {language.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div
                              className="ml-4 p-1 rounded-full flex-shrink-0"
                              style={{ background: "var(--primary)" }}
                            >
                              <Check className="size-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageSelectionModal;
