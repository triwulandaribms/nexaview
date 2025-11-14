"use client";

import { Search, X, Check, Grid, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGES } from "./LanguageSelectionModal";

const VoiceSelectionModal = ({
  isOpen,
  onClose,
  selectedVoice,
  onSelectVoice,
}) => {
  const [voices, setVoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [voicesLoading, setVoicesLoading] = useState(false);

  useEffect(() => {
    const fetchVoices = async () => {
      if (!isOpen) return;

      setVoicesLoading(true);
      try {
        const response = await fetch("/api/all-voice");
        const data = await response.json();
        setVoices(data.voices || []);
      } catch (error) {
        console.error("Error fetching voices:", error);
      } finally {
        setVoicesLoading(false);
      }
    };
    fetchVoices();
  }, [isOpen]);

  const getVoiceAvatarGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
      "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
      "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
    ];
    return gradients[index % gradients.length];
  };

  const setLanguage = (languages) => {
    const language = LANGUAGES.find((lang) => lang.code === languages);
    return language?.name;
  };

  const filteredVoices = voices.filter((voice) =>
    voice?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedVoices = filteredVoices.reduce((acc, voice) => {
    const category = voice.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(voice);
    return acc;
  }, {});

  const handleVoiceSelect = (voice) => {
    onSelectVoice(voice);
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
              className="flex items-center justify-between p-2 border-b sticky top-0 z-10 rounded-t-2xl"
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
                  <LayoutGrid
                    className="size-4"
                    style={{ color: "var(--text-primary)" }}
                  />
                </div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Select a voice
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
                  placeholder="Search for a voice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-transparent focus:outline-none rounded-xl"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </div>

            {/* Voice List */}
            <div className="px-4 pb-6 overflow-y-auto max-h-[calc(100vh-150px)] modal-content">
              {voicesLoading ? (
                <div
                  className="text-center py-12"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div
                    className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-4"
                    style={{ borderColor: "var(--primary)" }}
                  ></div>
                  <p>Loading voices...</p>
                </div>
              ) : filteredVoices.length === 0 ? (
                <div
                  className="text-center py-12"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <p className="text-lg">No voices found</p>
                  {searchQuery && (
                    <p className="text-sm mt-2">Try a different search term</p>
                  )}
                </div>
              ) : (
                <>
                  {Object.entries(groupedVoices).map(
                    ([category, categoryVoices]) => (
                      <div key={category} className="mb-8">
                        <div className="space-y-2">
                          {categoryVoices.map((voice, index) => {
                            const isSelected =
                              selectedVoice?.voice_id === voice.voice_id;
                            return (
                              <button
                                key={voice.voice_id}
                                onClick={() => handleVoiceSelect(voice)}
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
                                  <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                                    style={{
                                      background: getVoiceAvatarGradient(
                                        voices.indexOf(voice)
                                      ),
                                    }}
                                  >
                                    <span className="text-white text-sm font-bold">
                                      {voice?.name?.charAt(0)?.toUpperCase() ||
                                        "V"}
                                    </span>
                                  </div>
                                  <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="font-semibold text-base truncate"
                                        style={{ color: "var(--text-primary)" }}
                                      >
                                        {voice?.name || "Unnamed Voice"}
                                      </span>
                                      {voice.labels?.accent && (
                                        <span
                                          className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                                          style={{
                                            background:
                                              "var(--surface-tertiary)",
                                            color: "var(--text-secondary)",
                                          }}
                                        >
                                          {setLanguage(
                                            voice.labels.language ||
                                              voice.fine_tuning.language
                                          )}{" "}
                                          ( {voice.labels.accent} )
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {!isSelected && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {voice.labels?.descriptive && (
                                        <span
                                          className="text-xs px-2 py-1 rounded-full"
                                          style={{
                                            background:
                                              "var(--surface-tertiary)",
                                            color: "var(--text-secondary)",
                                          }}
                                        >
                                          {voice.labels.descriptive}
                                        </span>
                                      )}
                                      {voice.labels?.description && (
                                        <span
                                          className="text-xs px-2 py-1 rounded-full"
                                          style={{
                                            background:
                                              "var(--surface-tertiary)",
                                            color: "var(--text-secondary)",
                                          }}
                                        >
                                          {voice.labels.description}
                                        </span>
                                      )}
                                      {voice.labels?.use_case && (
                                        <span
                                          className="text-xs px-2 py-1 rounded-full"
                                          style={{
                                            background:
                                              "var(--surface-tertiary)",
                                            color: "var(--text-secondary)",
                                          }}
                                        >
                                          {voice.labels.use_case}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {isSelected && (
                                  <div
                                    className="ml-4 p-1.5 rounded-full flex-shrink-0"
                                    style={{ background: "var(--primary)" }}
                                  >
                                    <Check className="size-4 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceSelectionModal;
