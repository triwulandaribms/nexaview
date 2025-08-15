"use client";
import React, { useState } from "react";
import {
  Settings,
  Info,
  Bot,
  Sparkles,
  Rocket,
  Zap,
  Brain,
  Database,
  X,
  RefreshCw,
  Lock,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import ModelConfigModal from "../../components/ModelConfigModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Models() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isModelConfigModalOpen, setIsModelConfigModalOpen] = useState(false);

  // Nonaktifkan Add Model modal (diminta di-comment)
  // const [isAddModelModalOpen, setIsAddModelModalOpen] = useState(false);
  // const [isPremiumModelSelected, setIsPremiumModelSelected] = useState(false);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [editedApiKey, setEditedApiKey] = useState("");

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setIsModelConfigModalOpen(true);
  };

  const handleSettingsClick = (provider) => {
    setSelectedProvider(provider);
    setEditedApiKey(provider.apiKey || "");
    setIsApiKeyModalOpen(true);
  };

  const [modelStates, setModelStates] = useState({});

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleModel = (providerId, modelId) => {
    setModelStates((prev) => ({
      ...prev,
      [`${providerId}-${modelId}`]: !prev[`${providerId}-${modelId}`],
    }));
  };

  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      icon: Bot,
      connected: true,
      // ⚠️ Jangan commit API key ke repo (hanya contoh).
      apiKey: "********-masked-openai-key",
      models: [
        { id: "gpt-4", name: "gpt-4", enabled: true },
        { id: "gpt-3.5-turbo-16k", name: "gpt-3.5-turbo-16k", enabled: true },
        { id: "gpt-4o", name: "gpt-4o", enabled: true },
      ],
    },
    {
      id: "anthropic",
      name: "Anthropic",
      icon: Sparkles,
      connected: false,
      apiKey: "",
      models: [
        { id: "claude-3-7-sonnet-20250219", name: "claude-3-7-sonnet-20250219", enabled: false },
        { id: "claude-3-5-sonnet-20241022", name: "claude-3-5-sonnet-20241022", enabled: false },
        { id: "claude-3-sonnet", name: "Claude 3 Sonnet", enabled: false },
        { id: "claude-3-haiku", name: "Claude 3 Haiku", enabled: false },
      ],
    },
    {
      id: "deepseek",
      name: "Deepseek",
      icon: Rocket,
      connected: true,
      apiKey: "********-masked-deepseek-key",
      models: [{ id: "deepseek-chat", name: "deepseek-chat", enabled: true }],
    },
    {
      id: "mistral",
      name: "Mistral",
      icon: Zap,
      connected: false,
      apiKey: "",
      models: [],
    },
    {
      id: "qwen",
      name: "Qwen",
      icon: Brain,
      connected: true,
      apiKey: "********-masked-qwen-key",
      models: [
        { id: "qwen2-7b-instruct", name: "qwen2-7b-instruct", enabled: true },
        { id: "qwen-max", name: "qwen-max", enabled: true },
      ],
    },
    {
      id: "ollama",
      name: "Ollama",
      icon: Database,
      connected: false,
      apiKey: "",
      models: [],
    },
  ];

  // Skeleton Components (tidak diubah)
  const ProviderCardSkeleton = () => (
    <div
      className="rounded-xl border"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="p-4 border-b" style={{ borderColor: "var(--border-light)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
            <div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-1" />
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              <div className="w-8 h-4 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="w-full h-8 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
      </div>
    </div>
  );

  const ModelsSkeleton = () => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </motion.div>
  );

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
      >
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-6">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          </div>
          <div className="mb-6 p-4 rounded-lg ">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-400 rounded animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <ModelsSkeleton />
        </motion.div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
    >
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div>
          <PageHeader
            title="Models"
            subtitle="Kelola koneksi model dari berbagai provider. Tambah/hapus model dinonaktifkan sementara."
          />
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 p-4 rounded-lg border"
          style={{
            background: "var(--primary-light)",
            borderColor: "var(--primary)",
            color: "var(--primary)",
          }}
        >
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Pengaturan API Key tetap tersedia lewat tombol <b>Settings</b>. Aksi <i>Add Model</i> dan
              <i> Connect</i> dinonaktifkan sesuai permintaan.
            </p>
          </div>
        </motion.div>

        {/* Provider Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group rounded-xl border hover:shadow-lg transition-all duration-300 flex flex-col"
              style={{
                background: "var(--surface-elevated)",
                borderColor: provider.connected ? "var(--primary)" : "var(--border-light)",
              }}
            >
              <div className="flex-1">
                {/* Simple Header */}
                <div className="p-4 border-b" style={{ borderColor: "var(--border-light)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: provider.connected ? "var(--primary)" : "var(--surface-secondary)",
                          color: provider.connected ? "white" : "var(--text-secondary)",
                        }}
                      >
                        <provider.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {provider.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              provider.connected ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {provider.connected ? "Connected" : "Not connected"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {provider.connected && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSettingsClick(provider)}
                        className="p-1.5 rounded-lg opacity-100 transition-opacity cursor-pointer"
                        style={{ color: "var(--text-secondary)" }}
                        aria-label={`Settings ${provider.name}`}
                        title="API Key / Settings"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Models Section */}
                <div className="p-4">
                  {provider.models.length > 0 ? (
                    <div className="space-y-2">
                      {provider.models.slice(0, 4).map((model) => (
                        <div key={model.id} className="flex items-center justify-between py-1">
                          <span
                            className="text-sm truncate flex-1 mr-2"
                            style={{
                              color:
                                provider.connected && (modelStates[`${provider.id}-${model.id}`] ?? model.enabled)
                                  ? "var(--text-primary)"
                                  : "var(--text-secondary)",
                            }}
                            title={model.name}
                          >
                            {model.name}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleModel(provider.id, model.id)}
                            disabled={!provider.connected}
                            className={`w-8 h-4 rounded-full transition-colors cursor-pointer flex items-center ${
                              provider.connected &&
                              (modelStates[`${provider.id}-${model.id}`] ?? model.enabled)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            } ${!provider.connected ? "opacity-50 cursor-not-allowed" : ""}`}
                            aria-label={`Toggle ${model.name}`}
                          >
                            <div
                              className={`w-3 h-3 bg-white rounded-full transition-transform ${
                                provider.connected &&
                                (modelStates[`${provider.id}-${model.id}`] ?? model.enabled)
                                  ? "translate-x-4"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </motion.button>
                        </div>
                      ))}
                      {provider.models.length > 4 && (
                        <div className="pt-1">
                          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                            +{provider.models.length - 4} more models
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        No models available
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Area (Add Model / Connect dinonaktifkan) */}
              <div className="p-4 pt-0">
                {/* --- BEGIN: Commented out per request --- */}
                {/*
                {provider.connected ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedProvider(provider);
                      setIsAddModelModalOpen(true);
                    }}
                    className="w-full py-2 text-sm font-medium rounded-lg border border-dashed transition-colors cursor-pointer"
                    style={{ borderColor: "var(--primary)", color: "var(--primary)", background: "transparent" }}
                  >
                    Add Model
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    style={{ background: "var(--primary)", color: "white", border: "none" }}
                  >
                    Connect
                  </motion.button>
                )}
                */}
                {/* --- END: Commented out per request --- */}

                {/* Placeholder non-interaktif agar UI seimbang */}
                <div
                  className="w-full py-2 text-sm font-medium rounded-lg border border-dashed text-center select-none"
                  style={{
                    borderColor: "var(--border-light)",
                    color: "var(--text-tertiary)",
                    background: "transparent",
                  }}
                  title="Actions disabled"
                >
                  Actions disabled
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Model Modal DINONAKTIFKAN (di-comment) */}
        {/*
        <AnimatePresence>
          {isAddModelModalOpen && (
            <>
              <motion.div ...>...</motion.div>
              <motion.div ...>...</motion.div>
            </>
          )}
        </AnimatePresence>
        */}

        {/* API Key Modal (tetap aktif melalui Settings) */}
        <AnimatePresence>
          {isApiKeyModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm"
                onClick={() => {
                  setIsApiKeyModalOpen(false);
                  setEditedApiKey("");
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="w-full max-w-md rounded-xl shadow-2xl"
                  style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-light)" }}
                >
                  <div className="p-6 pb-4">
                    <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      API Key
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      API key disimpan secara aman dan tidak dibagikan ke pihak ketiga.
                    </p>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg border"
                          style={{ background: "var(--surface-secondary)", borderColor: "var(--border-light)" }}
                        >
                          <Lock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <input
                            type="text"
                            value={editedApiKey}
                            onChange={(e) => setEditedApiKey(e.target.value)}
                            placeholder="Enter your API key..."
                            className="flex-1 bg-transparent outline-none font-mono text-sm"
                            style={{ color: "var(--text-primary)" }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsApiKeyModalOpen(false);
                            setEditedApiKey("");
                          }}
                          className="flex-1 py-3 px-4 rounded-lg font-medium border transition-colors"
                          style={{
                            borderColor: "var(--border-light)",
                            color: "var(--text-secondary)",
                            background: "var(--background)",
                          }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            console.log(`Saving API key for ${selectedProvider?.name}:`, editedApiKey);
                            setIsApiKeyModalOpen(false);
                            setEditedApiKey("");
                          }}
                          className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors"
                          style={{ background: "var(--primary)", color: "white", border: "none" }}
                        >
                          Save
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.main>
  );
}
