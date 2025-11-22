"use client";

import {
  X,
  ChevronRight,
  Brain,
  CirclePlus,
  CircleAlert,
  ChevronDown,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LLMSelectionModal from "./LLMSelectionModal";
import AddSecretModal from "./AddSecretModal";

const LLMConfigModal = ({
  isOpen,
  onClose,
  selectedLLM,
  onUpdateLLM,
  setTemperature,
  setTokenLimit,
  temperature,
  tokenLimit,
  backupMode,
  setBackupMode,
  llms,
  secretKey,
  modelId,
  serverUrl,
  setSecretKey,
  setModelId,
  setServerUrl,
}) => {
  const [isLLMSelectionOpen, setIsLLMSelectionOpen] = useState(false);
  const [isAddSecretOpen, setIsAddSecretOpen] = useState(false);
  const [isApiKeyDropdownOpen, setIsApiKeyDropdownOpen] = useState(false);
  const [savedSecrets, setSavedSecrets] = useState([]);
  const [selectedSecret, setSelectedSecret] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const response = await fetch("/api/secret");
        if (!response.ok) {
          throw new Error("Failed to fetch secrets");
        }
        const data = await response.json();
        console.log("Fetched secrets:", data);
        // data.secrets adalah array dari API ElevenLabs
        if (data.secrets && Array.isArray(data.secrets)) {
          setSavedSecrets(data.secrets);
        }
      } catch (error) {
        console.error("Error fetching secrets:", error);
      }
    };
    fetchSecrets();
  }, []);

  useEffect(() => {
    if (secretKey && savedSecrets.length > 0) {
      const matchedSecret = savedSecrets.find((s) => s.secret_id === secretKey);
      if (matchedSecret) {
        setSelectedSecret(matchedSecret);
      }
    } else if (!secretKey) {
      setSelectedSecret(null);
    }
  }, [secretKey, savedSecrets]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsApiKeyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleSelectLLM = (llmName) => {
    onUpdateLLM(llmName);
  };

  const handleAddSecret = async (secret) => {
    try {
      const createResponse = await fetch("/api/secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "string",
          name: secret.name,
          value: secret.value,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to create secret");
      }

      const newSecretData = await createResponse.json();
      console.log("New secret created - Full Response:", newSecretData);
      console.log("Secret ID from response:", newSecretData.secret_id);

      const listResponse = await fetch("/api/secret");
      if (listResponse.ok) {
        const data = await listResponse.json();
        console.log("Fetched secrets list:", data);
        if (data.secrets && Array.isArray(data.secrets)) {
          setSavedSecrets(data.secrets);

          // Try to find by secret_id or by name as fallback
          let newSecret = data.secrets.find(
            (s) => s.secret_id === newSecretData.secret_id
          );

          // Fallback: find by name if secret_id not found
          if (!newSecret && newSecretData.name) {
            newSecret = data.secrets.find((s) => s.name === newSecretData.name);
          }

          // Last resort: select the last secret in the list
          if (!newSecret && data.secrets.length > 0) {
            newSecret = data.secrets[data.secrets.length - 1];
          }

          console.log("Selected new secret:", newSecret);

          if (newSecret) {
            setSelectedSecret(newSecret);
            setSecretKey(newSecret.secret_id);
          }
        }
      }
    } catch (error) {
      console.error("Error adding secret:", error);
      alert(`Failed to create secret: ${error.message}`);
    }
  };

  const handleSelectSecret = (secret) => {
    setSelectedSecret(secret);
    // Simpan secret_id ke setSecretKey
    setSecretKey(secret.secret_id);
    setIsApiKeyDropdownOpen(false);
  };

  const handleSelectNone = () => {
    setSelectedSecret(null);
    setSecretKey("");
    setIsApiKeyDropdownOpen(false);
  };

  return (
    <>
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
                  <Brain
                    className="size-4"
                    style={{ color: "var(--text-primary)" }}
                  />
                </div>
                <h2
                  className="text-sm font-semibold flex-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  LLM
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
                {/* Backup LLM Configuration */}
                {selectedLLM !== "custom-llm" && (
                  <div>
                    <h3
                      className="text-sm font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Backup LLM configuration
                    </h3>
                    <p
                      className="text-sm mb-4"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Configure how backup LLMs are used when the primary LLM
                      fails.
                    </p>

                    {/* Backup Mode Tabs */}
                    <div
                      className="flex gap-2 p-1 rounded-xl"
                      style={{ background: "var(--surface-secondary)" }}
                    >
                      {["default", "override", "disabled"].map(
                        (mode, index) => (
                          <button
                            key={index}
                            onClick={() => setBackupMode(mode)}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                              backupMode === mode ? "" : ""
                            }`}
                            style={{
                              background:
                                backupMode === mode
                                  ? "var(--surface-elevated)"
                                  : "transparent",
                              color:
                                backupMode === mode
                                  ? "var(--text-primary)"
                                  : "var(--text-secondary)",
                              boxShadow:
                                backupMode === mode
                                  ? "0 1px 3px rgba(0,0,0,0.1)"
                                  : "none",
                            }}
                          >
                            {mode === "override" ? "Custom" : mode}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* LLM Selector */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    LLMS
                  </h3>

                  {backupMode === "disabled" && (
                    <div className="flex items-start gap-2 bg-(--error) mb-2 p-4 rounded-xl text-(--text-inverse)">
                      <CircleAlert
                        className="size-4"
                        style={{ color: "var(--text-inverse)" }}
                      />
                      <div className="flex-1">
                        We recommend using at least two backup LLMs from
                        different model providers to keep your conversations
                        going in case of an outage.
                      </div>
                    </div>
                  )}
                  <div
                    className="rounded-xl border overflow-hidden  "
                    style={{
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <button
                      onClick={() => setIsLLMSelectionOpen(true)}
                      className="w-full flex items-center justify-between  cursor-pointer px-4 py-2 hover:bg-(--surface-secondary) transition-all duration-200"
                    >
                      <div className="flex gap-2 items-center">
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {selectedLLM}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                          }}
                        >
                          Primary
                        </span>
                      </div>
                      <ChevronRight
                        className="size-5"
                        style={{ color: "var(--text-secondary)" }}
                      />
                    </button>
                    {backupMode === "override" && (
                      <>
                        <div className=" px-4 py-2 bg-(--surface-secondary) text-(--text-secondary) border-y border-(--border-light)">
                          We recommend using at least two backup LLMs from
                          different model providers to keep your conversations
                          going in case of an outage.
                        </div>
                        <button className="w-full flex items-center gap-2  cursor-pointer px-4 py-2 hover:bg-(--surface-secondary) transition-all duration-200">
                          <CirclePlus
                            className="size-5"
                            style={{ color: "var(--text-secondary)" }}
                          />
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Add backup LLM
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {selectedLLM === "custom-llm" && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Server URL
                      </h3>
                      <div className="text-sm text-(--text-secondary)">
                        The server is expected to match the OpenAI{" "}
                        <span className=" underline">
                          create chat completions API
                        </span>
                        .
                      </div>

                      <div className="border border-(--border-light) flex mt-2 text-sm rounded-lg overflow-hidden">
                        <div className="flex-1 p-2">
                          <input
                            type="text"
                            placeholder="https://api.openai.com/v1"
                            className=" outline-none w-full"
                            value={serverUrl}
                            onChange={(e) => setServerUrl(e.target.value)}
                          />
                        </div>
                        <div className="text-(--text-secondary) bg-(--surface-secondary) p-2">
                          /chat/completions
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Model ID
                      </h3>

                      <div className="border border-(--border-light) flex mt-2 text-sm rounded-lg overflow-hidden">
                        <div className="flex-1 p-2">
                          <input
                            type="text"
                            className=" outline-none w-full"
                            value={modelId}
                            onChange={(e) => setModelId(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-(--text-secondary)">
                        Some providers (e.g., Azure OpenAI) may require an API
                        version parameter.
                        <span className=" underline">
                          Add API version field
                        </span>
                        .
                      </div>
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        API Key
                      </h3>
                      <div className="text-sm text-(--text-secondary) mb-2">
                        We strongly suggest using an API key to authenticate
                        with your LLM server.
                      </div>

                      <div className="relative" ref={dropdownRef}>
                        {/* Dropdown Button */}
                        <button
                          onClick={() =>
                            setIsApiKeyDropdownOpen(!isApiKeyDropdownOpen)
                          }
                          className="w-full flex items-center justify-between p-3 border border-(--border-light) cursor-pointer rounded-xl text-sm hover:bg-(--surface-secondary) transition-all duration-200"
                          style={{
                            background: "var(--surface-secondary)",
                            borderColor: "var(--border-light)",
                          }}
                        >
                          <span
                            style={{
                              color: selectedSecret
                                ? "var(--text-primary)"
                                : "var(--text-secondary)",
                            }}
                          >
                            {selectedSecret ? selectedSecret.name : "None"}
                          </span>
                          <ChevronDown
                            className={`size-5 transition-transform duration-200 ${
                              isApiKeyDropdownOpen ? "rotate-180" : ""
                            }`}
                            style={{ color: "var(--text-secondary)" }}
                          />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {isApiKeyDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute z-10 w-full mt-2 border rounded-xl overflow-hidden shadow-lg"
                              style={{
                                background: "var(--surface-elevated)",
                                borderColor: "var(--border-light)",
                              }}
                            >
                              {/* None Option */}
                              <button
                                onClick={handleSelectNone}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-(--surface-secondary) transition-all duration-200 border-b"
                                style={{
                                  borderColor: "var(--border-light)",
                                }}
                              >
                                <span
                                  className="text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  None
                                </span>
                                {!selectedSecret && (
                                  <Check
                                    className="size-5"
                                    style={{ color: "var(--primary)" }}
                                  />
                                )}
                              </button>

                              {/* Saved Secrets List */}
                              {savedSecrets.map((secret) => (
                                <button
                                  key={secret.secret_id}
                                  onClick={() => handleSelectSecret(secret)}
                                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-(--surface-secondary) transition-all duration-200 border-b"
                                  style={{
                                    borderColor: "var(--border-light)",
                                  }}
                                >
                                  <span
                                    className="text-sm"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    {secret.name}
                                  </span>
                                  {selectedSecret?.secret_id ===
                                    secret.secret_id && (
                                    <Check
                                      className="size-5"
                                      style={{ color: "var(--primary)" }}
                                    />
                                  )}
                                </button>
                              ))}

                              {/* Create New Secret Button */}
                              <button
                                onClick={() => {
                                  setIsApiKeyDropdownOpen(false);
                                  setIsAddSecretOpen(true);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-(--surface-secondary) transition-all duration-200"
                              >
                                <CirclePlus
                                  className="size-5"
                                  style={{ color: "var(--text-secondary)" }}
                                />
                                <span
                                  className="text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Create new secret
                                </span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Request headers
                      </h3>
                      <div className="text-sm text-(--text-secondary) mb-1">
                        Define headers that will be sent with requests to your
                        LLM
                      </div>

                      <div className="flex items-center justify-start gap-2 p-2 border border-(--border-light) cursor-pointer rounded-lg text-sm hover:bg-(--surface-secondary) transition-all duration-200">
                        <CirclePlus
                          className="size-4"
                          style={{ color: "var(--text-secondary)" }}
                        />
                        <span
                          className=""
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Add header
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Temperature */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Temperature
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Control the creativity and randomness of the responses
                    generated by the LLM.
                  </p>
                  <div
                    className="flex justify-between text-sm mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span>More deterministic</span>
                    <span>More expressive</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--primary) ${
                        temperature * 100
                      }%, var(--surface-secondary) ${temperature * 100}%)`,
                    }}
                  />
                  <p
                    className="text-right text-sm mt-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {temperature.toFixed(2)}
                  </p>
                </div>

                {/* Limit token usage */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Limit token usage
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    The maximum number of tokens that the LLM can predict. A
                    value of -1 means no limit.
                  </p>
                  <input
                    type="number"
                    value={tokenLimit}
                    onChange={(e) => setTokenLimit(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-[var(--primary)] transition-all"
                    style={{
                      background: "var(--surface-secondary)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                    }}
                    placeholder="-1"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* LLM Selection Modal */}
      <LLMSelectionModal
        isOpen={isLLMSelectionOpen}
        onClose={() => setIsLLMSelectionOpen(false)}
        onSelectLLM={handleSelectLLM}
        selectedLLM={selectedLLM}
        llms={llms}
      />

      {/* Add Secret Modal */}
      <AddSecretModal
        isOpen={isAddSecretOpen}
        onClose={() => setIsAddSecretOpen(false)}
        onAddSecret={handleAddSecret}
      />
    </>
  );
};

export default LLMConfigModal;
