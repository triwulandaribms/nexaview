"use client";

import {
  AlertCircle,
  ArrowLeft,
  ChevronsUpDown,
  FileText,
  X,
} from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VoiceSelectionModal from "./VoiceSelectionModal";
import LanguageSelectionModal, {
  getLanguageByCode,
} from "./LanguageSelectionModal";
import LLMConfigModal from "./LLMConfigModal";

const EditVoiceAgent = ({ params }) => {
  const { id } = use(params);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentName, setAgentName] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [stability, setStability] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [similarity, setSimilarity] = useState(0);
  const router = useRouter();
  const [isDefaultPersonality, setIsDefaultPersonality] = useState(false);
  const [isInterruptible, setIsInterruptible] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState(null);
  const [additionalLanguages, setAdditionalLanguages] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [tokenLimit, setTokenLimit] = useState(null);
  const [backupMode, setBackupMode] = useState(null);
  const [llms, setLlms] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialState, setInitialState] = useState(null);
  const [secretKey, setSecretKey] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);

  console.log(agent);

  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) {
        setError("Agent ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/voice-agent/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch agent");
        }
        const data = await response.json();
        setAgent(data);
        setAgentName(data.name);
        setFirstMessage(data.conversation_config.agent.first_message);
        setAgentPrompt(data.conversation_config.agent.prompt.prompt);
        setIsDefaultPersonality(
          data.conversation_config.agent.prompt.ignore_default_personality
        );
        setIsInterruptible(
          data.conversation_config.agent.disable_first_message_interruptions
        );
        setSelectedLLM(data.conversation_config.agent.prompt.llm);
        setTemperature(data.conversation_config.agent.prompt.temperature);
        setTokenLimit(data.conversation_config.agent.prompt.max_tokens);
        setBackupMode(
          data.conversation_config.agent.prompt.backup_llm_config.preference
        );
        setStability(data.conversation_config.tts.stability || 0.5);
        setSpeed(data.conversation_config.tts.speed || 1);
        setSimilarity(data.conversation_config.tts.similarity_boost || 80);
        setSecretKey(
          data?.conversation_config?.agent?.prompt?.custom_llm?.api_key
            ?.secret_id || ""
        );
        setModelId(
          data?.conversation_config?.agent?.prompt?.custom_llm?.model_id || ""
        );
        setServerUrl(
          data?.conversation_config?.agent?.prompt?.custom_llm?.url || ""
        );

        setInitialState({
          name: data.name,
          firstMessage: data.conversation_config.agent.first_message,
          agentPrompt: data.conversation_config.agent.prompt.prompt,
          isDefaultPersonality:
            data.conversation_config.agent.prompt.ignore_default_personality,
          isInterruptible:
            data.conversation_config.agent.disable_first_message_interruptions,
          selectedLLM: data.conversation_config.agent.prompt.llm,
          temperature: data.conversation_config.agent.prompt.temperature,
          tokenLimit: data.conversation_config.agent.prompt.max_tokens,
          backupMode:
            data.conversation_config.agent.prompt.backup_llm_config.preference,
          stability: data.conversation_config.tts.stability || 0.5,
          speed: data.conversation_config.tts.speed || 1,
          similarity: data.conversation_config.tts.similarity_boost || 80,
          voiceId: data.conversation_config.tts.voice_id,
          language: data.conversation_config.agent.language,
          secretKey:
            data?.conversation_config?.agent?.prompt?.custom_llm?.api_key
              ?.secret_id || "",
          modelId:
            data?.conversation_config?.agent?.prompt?.custom_llm?.model_id ||
            "",
          serverUrl:
            data?.conversation_config?.agent?.prompt?.custom_llm?.url || "",
        });
      } catch (error) {
        console.error("Error fetching voice agent:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id]);

  useEffect(() => {
    const fetchVoice = async () => {
      const voiceId = agent?.conversation_config?.tts?.voice_id;
      if (!voiceId) {
        return;
      }
      const response = await fetch(`/api/voice-agent/voice/${voiceId}`);
      const data = await response.json();
      setSelectedVoice(data);
    };
    fetchVoice();
  }, [agent?.conversation_config?.tts?.voice_id]);

  useEffect(() => {
    if (agent) {
      const languageCode = agent.conversation_config.agent.language;
      const language = getLanguageByCode(languageCode);
      setDefaultLanguage(language);
    }
  }, [agent]);

  useEffect(() => {
    const fetchLLMUsage = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/llm/${id}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch LLM usage");
        }

        const data = await response.json();

        setLlms(data.llm_prices);
      } catch (error) {
        console.error("Error fetching LLM usage:", error);
      }
    };

    fetchLLMUsage();
  }, [id]);

  // Detect changes
  useEffect(() => {
    if (!initialState) return;

    const currentState = {
      name: agentName,
      firstMessage: firstMessage,
      agentPrompt: agentPrompt,
      isDefaultPersonality: isDefaultPersonality,
      isInterruptible: isInterruptible,
      selectedLLM: selectedLLM,
      temperature: temperature,
      tokenLimit: tokenLimit,
      backupMode: backupMode,
      stability: stability,
      speed: speed,
      similarity: similarity,
      voiceId: selectedVoice?.voice_id,
      language: defaultLanguage?.code,
      secretKey: secretKey,
      modelId: modelId,
      serverUrl: serverUrl,
    };

    const hasChanged =
      JSON.stringify(initialState) !== JSON.stringify(currentState);
    setHasChanges(hasChanged);
  }, [
    agentName,
    firstMessage,
    agentPrompt,
    isDefaultPersonality,
    isInterruptible,
    selectedLLM,
    temperature,
    tokenLimit,
    backupMode,
    stability,
    speed,
    similarity,
    selectedVoice,
    defaultLanguage,
    initialState,
    secretKey,
    modelId,
    serverUrl,
  ]);

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
  };

  const handleLanguageSelect = (language) => {
    setDefaultLanguage(language);
  };

  // const handleAddLanguage = (language) => {
  //   if (!additionalLanguages.find((lang) => lang.code === language.code)) {
  //     setAdditionalLanguages([...additionalLanguages, language]);
  //   }
  // };

  const handleRemoveLanguage = (languageCode) => {
    setAdditionalLanguages(
      additionalLanguages.filter((lang) => lang.code !== languageCode)
    );
  };

  const handleUpdateLLM = (llmName) => {
    setSelectedLLM(llmName);
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const promptConfig = {
        prompt: agentPrompt,
        llm: selectedLLM,
        temperature: temperature,
        max_tokens: tokenLimit,
        ignore_default_personality: isDefaultPersonality,
        backup_llm_config: {
          preference: backupMode,
          order: ["claude-sonnet-4-5", "gpt-4o-mini"],
        },
      };

      if (selectedLLM === "custom-llm") {
        promptConfig.custom_llm = {
          url: serverUrl || "",
          model_id: modelId || "",
        };

        if (secretKey) {
          promptConfig.custom_llm.api_key = {
            secret_id: secretKey,
          };
        }
      }

      const updatePayload = {
        name: agentName,
        conversation_config: {
          agent: {
            first_message: firstMessage,
            language: defaultLanguage?.code,
            disable_first_message_interruptions: isInterruptible,
            prompt: promptConfig,
          },
          tts: {
            voice_id:
              selectedVoice?.voice_id || agent.conversation_config.tts.voice_id,
            stability: stability,
            speed: speed,
            similarity_boost: similarity,
            model_id: defaultLanguage?.model_id,
          },
        },
      };

      console.log("Update Payload:", JSON.stringify(updatePayload, null, 2));
      console.log("Custom LLM Config:", {
        selectedLLM,
        serverUrl,
        modelId,
        secretKey,
      });

      const response = await fetch(`/api/voice-agent/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update agent");
      }

      const data = await response.json();
      setAgent(data);

      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Agent updated successfully!
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);

      setTimeout(() => {
        router.push("/voice-agents");
      }, 1500);
    } catch (error) {
      console.error("Error updating agent:", error);

      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ef4444;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Failed to update agent: ${error.message}
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="relative">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-(--border-light)">
          <div className="flex items-center gap-4 ">
            <button className="cursor-pointer" onClick={() => router.back()}>
              <ArrowLeft className="size-6 text-(--text-secondary)" />
            </button>
            <h1
              className="text-2xl font-semibold max-sm:text-xl"
              style={{ color: "var(--text-primary)" }}
            >
              Edit Agent
            </h1>
          </div>

          <div className="flex items-center gap-2 max-lg:fixed left-0 bottom-0 max-lg:w-full z-10 bg-(--background) max-lg:justify-end max-lg:p-4">
            <button
              onClick={() => router.push("/voice-agents")}
              disabled={isSaving || loading}
              className="px-4 py-2 border border-(--error) text-(--error) rounded-md font-medium hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveChanges()}
              disabled={isSaving || loading || !hasChanges}
              className="px-4 py-2 rounded-md font-medium hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center cursor-pointer"
              style={{
                background: "var(--primary)",
                color: "var(--text-inverse)",
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {/* Left Column */}
          <div className="">
            <div
              className="rounded-xl border p-4 md:p-6 lg:p-8 backdrop-blur-sm"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
              }}
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "var(--primary-light)" }}
                >
                  <FileText
                    className="h-5 w-5"
                    style={{ color: "var(--primary)" }}
                  />
                </div>
                <h3
                  className="text-lg md:text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Agent Details
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Technical Support Assistant"
                    className="w-full px-4 py-4 rounded-xl border-2 border-transparent focus:outline-none focus:border-[var(--primary)] transition-all"
                    style={{
                      background: "var(--surface-secondary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    First Message *
                  </label>
                  <textarea
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    placeholder="Describe what this agent does and its purpose..."
                    rows={4}
                    className="w-full px-4 py-4 rounded-xl border-2 border-transparent focus:outline-none focus:border-[var(--primary)] "
                    style={{
                      background: "var(--surface-secondary)",
                      color: "var(--text-primary)",
                    }}
                  />

                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => setIsInterruptible(!isInterruptible)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        isInterruptible
                          ? "bg-(--primary)"
                          : "bg-(--text-secondary)"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 ${
                          isInterruptible ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>

                    <span
                      className="text-sm font-medium transition-colors duration-300"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Interruptible
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      System Prompt *
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      value={agentPrompt}
                      onChange={(e) => setAgentPrompt(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-4 rounded-xl border-2 border-transparent focus:outline-none focus:border-[var(--primary)]"
                      style={{
                        background: "var(--surface-secondary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <button
                      className="absolute top-3 right-3 p-1 rounded cursor-pointer"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() =>
                        setIsDefaultPersonality(!isDefaultPersonality)
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        isDefaultPersonality
                          ? "bg-(--primary)"
                          : "bg-(--text-secondary)"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 ${
                          isDefaultPersonality
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>

                    <span
                      className="text-sm font-medium transition-colors duration-300"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Default personality
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="max-lg:mb-[74px]">
            {/* Voice Settings */}
            <div
              className="rounded-xl border p-6 backdrop-blur-sm"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
              }}
            >
              <div className="mb-3">
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Voice
                </h3>
                {/* Button Voice Select */}
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-xl border hover:border-[var(--primary)] cursor-pointer hover:bg-(--surface-secondary) transition-all duration-300"
                  style={{
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-(--text-inverse)"
                      style={{
                        background:
                          "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                      }}
                    >
                      {selectedVoice?.name?.charAt(0)?.toUpperCase() || ""}
                    </div>
                    <span
                      className="text-lg font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedVoice.name}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-4" />
                </button>
              </div>

              <div className="flex flex-col">
                {/* Stability Slider */}
                <div className="">
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Stability
                  </h3>
                  <div
                    className=" flex justify-between text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span>More expressive</span>
                    <span>More consistent</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={stability}
                    onChange={(e) => setStability(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--primary) ${Math.ceil(
                        stability * 100
                      )}%, var(--surface-secondary) ${stability * 100}%)`,
                    }}
                  />
                  <p
                    className="text-right text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {Math.ceil(stability * 100)}%
                  </p>
                </div>

                {/* Speed */}
                <div className="">
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Speed
                  </h3>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.20"
                    step="0.01"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--primary) ${
                        (speed / 1.2) * 100
                      }%, var(--surface-secondary) ${(speed / 1.2) * 100}%)`,
                    }}
                  />
                  <p
                    className="text-right text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {speed.toFixed(2)}
                  </p>
                </div>

                {/* Similarity */}
                <div className="">
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Similarity
                  </h3>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={similarity}
                    onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--primary) ${Math.ceil(
                        similarity * 100
                      )}%, var(--surface-secondary) ${Math.ceil(
                        similarity * 100
                      )}%)`,
                    }}
                  />
                  <p
                    className="text-right text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {Math.ceil(similarity * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div
              className="rounded-xl border px-6 py-4 backdrop-blur-sm mt-4"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
              }}
            >
              <div className="mb-2">
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Language
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Choose the default and additional languages the agent will
                  communicate in.
                </p>

                {/* Default Language */}
                {defaultLanguage ? (
                  <button
                    onClick={() => setIsLanguageModalOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-xl border hover:border-[var(--primary)] cursor-pointer hover:bg-(--surface-secondary) transition-all duration-200 mb-3"
                    style={{
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {defaultLanguage.name}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: "var(--primary-light)",
                          color: "var(--primary)",
                        }}
                      >
                        Default
                      </span>
                    </div>
                    <ChevronsUpDown
                      className="size-4"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </button>
                ) : (
                  <div
                    className="w-full flex items-center justify-center px-4 py-3 rounded-xl border"
                    style={{
                      borderColor: "var(--border-light)",
                      background: "var(--surface-secondary)",
                    }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Loading language...
                    </span>
                  </div>
                )}

                {/* Additional Languages List */}
                {additionalLanguages.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {additionalLanguages.map((language) => (
                      <div
                        key={language.code}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border"
                        style={{
                          borderColor: "var(--border-light)",
                          background: "var(--surface-secondary)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                            <span className="text-2xl">{language.flag}</span>
                          </div>
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {language.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveLanguage(language.code)}
                          className="p-1 rounded-lg hover:bg-(--surface-tertiary) transition-colors"
                        >
                          <X
                            className="size-4"
                            style={{ color: "var(--text-secondary)" }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* LLM */}
            <div
              className="rounded-xl border px-6 py-4 backdrop-blur-sm mt-4"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
              }}
            >
              <div className="mb-2">
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  LLM
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Select which provider and model to use for the LLM.
                </p>

                {/* LLM Selector Button */}
                <button
                  onClick={() => setIsLLMModalOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-xl border hover:border-[var(--primary)] cursor-pointer hover:bg-(--surface-secondary) transition-all duration-200"
                  style={{
                    borderColor: "var(--border-light)",
                  }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedLLM}
                  </span>
                  <ChevronsUpDown
                    className="size-4"
                    style={{ color: "var(--text-secondary)" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Selection Modal */}
      <VoiceSelectionModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedVoice={selectedVoice}
        onSelectVoice={handleVoiceSelect}
      />

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={defaultLanguage}
        onSelectLanguage={handleLanguageSelect}
        isDefault={true}
      />

      {/* LLM Configuration Modal */}
      <LLMConfigModal
        isOpen={isLLMModalOpen}
        onClose={() => setIsLLMModalOpen(false)}
        selectedLLM={selectedLLM}
        onUpdateLLM={handleUpdateLLM}
        setTemperature={setTemperature}
        setTokenLimit={setTokenLimit}
        temperature={temperature}
        tokenLimit={tokenLimit}
        backupMode={backupMode}
        setBackupMode={setBackupMode}
        llms={llms}
        secretKey={secretKey}
        modelId={modelId}
        serverUrl={serverUrl}
        setSecretKey={setSecretKey}
        setModelId={setModelId}
        setServerUrl={setServerUrl}
      />
    </div>
  );
};

export default EditVoiceAgent;
