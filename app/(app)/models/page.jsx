"use client";
import React, { useEffect, useState } from "react";
import {
  Settings,
  Info,
  Bot,
  Sparkles,
  Rocket,
  Zap,
  Brain,
  Database,
  RefreshCw,
  Check,
  Lock as LockIcon,
} from "lucide-react";

import PageHeader from "../../components/PageHeader";
import ModelConfigModal from "../../components/ModelConfigModal";
import { motion, AnimatePresence } from "framer-motion";
import { mbApi } from "@/app/lib/modelBaseApi";
import Alert from "@/app/components/Alert";

export default function Models() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isModelConfigModalOpen, setIsModelConfigModalOpen] = useState(false);
  const [isAddModelModalOpen, setIsAddModelModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSavingApiKey, setIsSavingApiKey] = useState(false);
  const [saveDone, setSaveDone] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isPremiumModelSelected, setIsPremiumModelSelected] = useState(false);
  const [editedApiKey, setEditedApiKey] = useState("");
  const [providers, setProviders] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [modelStates, setModelStates] = useState({});
  const [toggling, setToggling] = useState({});
  const [phase, setPhase] = useState("save");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);

  console.log(providers);

  const iconMap = {
    bot: Bot,
    sparkles: Sparkles,
    rocket: Rocket,
    zap: Zap,
    brain: Brain,
    database: Database,
  };

  const handleSettingsClick = (provider) => {
    setSelectedProvider(provider);
    setEditedApiKey(provider.apiKeyPreview || "");
    setPhase(provider.connected ? "save" : "generate");
    setIsSavingApiKey(false);
    setIsGenerating(false);
    setSaveDone(false);
    setIsApiKeyModalOpen(true);
  };

  const handleToggleModel = async (providerId, model) => {
    const key = `${providerId}-${model.id}`;
    const current = modelStates[key] ?? model.enabled;
    const next = !current;

    // optimistic
    setModelStates((prev) => ({ ...prev, [key]: next }));
    setToggling((prev) => ({ ...prev, [key]: true }));

    try {
      const controller = new AbortController();
      const res = await mbApi.toggle(
        { id: model._id },
        { providerId, modelId: model.id, enabled: next },
        { signal: controller.signal }
      );
      if (res?.error) throw new Error(res.error);
    } catch (e) {
      setModelStates((prev) => ({ ...prev, [key]: current }));
      const errorMessage =
        e?.message || e?.error || "An unknown error occurred.";

      setErrorMsg(errorMessage);
    } finally {
      setToggling((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Skeleton Components
  const ProviderCardSkeleton = () => (
    <div
      className="rounded-xl border"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      {/* Header Skeleton */}
      <div
        className="p-4 border-b"
        style={{ borderColor: "var(--border-light)" }}
      >
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

      {/* Models Skeleton */}
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

      {/* Button Skeleton */}
      {/* <div className="p-4 pt-0">
        <div className="w-full h-8 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
      </div> */}
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

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const res = await mbApi.list({ signal });
        if (!res || res.error) {
          throw new Error(res?.error || "Gagal memuat dataset.");
        }
        setProviders(
          (res?.data || []).map((p) => ({
            ...p,
            connected: !!(p.apiKey || p.apiKeyPreview || p.connected),
          }))
        );
      } catch (e) {
        if (e.name !== "AbortError") {
          setErrorMsg(e?.message || "Terjadi kesalahan.");
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          </div>

          {/* Info Banner Skeleton */}
          <div className="mb-6 p-4 rounded-lg ">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-400 rounded animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Models Skeleton */}
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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div>
          <PageHeader
            title="Models"
            subtitle="Add and manage AI model connections from various providers. Configure API keys and control model availability."
          />
        </div>
        {/* Info Banner */}

        {errorMsg && (
          <Alert variant="error" onDismiss={() => setErrorMsg("")}>
            {errorMsg}
          </Alert>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`mb-6 p-4 rounded-lg border ${
            errorMsg ? "hidden" : "flex"
          }`}
          style={{
            background: "var(--primary-light)",
            borderColor: "var(--primary)",
            color: "var(--primary)",
          }}
        >
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Connect your preferred AI providers by adding their API keys.
              Toggle models on/off to control which ones are available to your
              users.
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
                borderColor: provider.connected
                  ? "var(--primary)"
                  : "var(--border-light)",
              }}
            >
              <div className="flex-1">
                {/* Simple Header */}
                <div
                  className="p-4 border-b"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: provider.connected
                            ? "var(--primary)"
                            : "var(--surface-secondary)",
                          color: provider.connected
                            ? "white"
                            : "var(--text-secondary)",
                        }}
                      >
                        {(() => {
                          const Icon = iconMap[provider.icon] || Bot;
                          return <Icon className="h-4 w-4" />;
                        })()}
                      </div>
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {provider.name}
                        </h3>
                        {/* <div className="flex items-center gap-1 mt-0.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${provider.connected
                              ? "bg-green-500"
                              : "bg-gray-400"
                              }`}
                          />
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {provider.connected ? "Connected" : "Not connected"}
                          </span>
                        </div> */}
                      </div>
                    </div>

                    {/* Settings / Add API Key */}

                    {/* Settings / Add API Key (selalu tampil) */}
                    {provider.connected ? (
                      <button
                        onClick={() => handleSettingsClick(provider)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
                        style={{ color: "var(--text-secondary)" }}
                        aria-label={`Settings ${provider.name}`}
                        title="API Key / Settings"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSettingsClick(provider)}
                        className="px-3 py-1.5 rounded-lg font-medium cursor-pointer"
                        style={{
                          background: "var(--primary)",
                          color: "white",
                          border: "none",
                        }}
                        aria-label={`Add API Key for ${provider.name}`}
                        title="Add API Key"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Settings className="h-3.5 w-3.5" />
                          <span>Add API Key</span>
                        </div>
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Models Section */}
                <div className="p-4">
                  {provider?.models?.length > 0 ? (
                    <div className="space-y-2">
                      {provider?.models
                        .slice(0, showAllModels ? provider?.models?.length : 4)
                        .map((model) => (
                          <div
                            key={model.id}
                            className="flex items-center justify-between py-1"
                          >
                            <span
                              className="text-sm truncate flex-1 mr-2"
                              style={{
                                color:
                                  provider.connected && model.enabled
                                    ? "var(--text-primary)"
                                    : "var(--text-secondary)",
                              }}
                              title={model.name}
                            >
                              {model.name}
                            </span>
                            {(() => {
                              const key = `${provider.id}-${model.id}`;
                              const isOn =
                                (modelStates[key] ?? model.enabled) === true;
                              const busy = !!toggling[key];

                              return (
                                <motion.button
                                  whileHover={{
                                    scale:
                                      provider.connected && !busy ? 1.1 : 1,
                                  }}
                                  whileTap={{
                                    scale:
                                      provider.connected && !busy ? 0.9 : 1,
                                  }}
                                  onClick={() =>
                                    handleToggleModel(provider.id, model)
                                  }
                                  disabled={!provider.connected || busy}
                                  aria-label={`Toggle ${model.name}`}
                                  aria-pressed={isOn}
                                  aria-busy={busy}
                                  className={`w-8 h-4 rounded-full transition-colors flex items-center ${
                                    isOn ? "bg-green-500" : "bg-gray-300"
                                  } ${
                                    !provider.connected || busy
                                      ? "opacity-50 cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                >
                                  <div
                                    className={`w-3 h-3 bg-white rounded-full transition-transform ${
                                      isOn ? "translate-x-4" : "translate-x-0.5"
                                    }`}
                                  />
                                </motion.button>
                              );
                            })()}
                          </div>
                        ))}
                      <div className="flex">
                        {provider?.models?.length > 4 && (
                          <div
                            className="pt-1 cursor-pointer flex"
                            onClick={() => setShowAllModels(!showAllModels)}
                          >
                            <span
                              className="text-sm cursor-pointer"
                              style={{ color: "var(--primary)" }}
                            >
                              {showAllModels
                                ? "Show Less"
                                : `+${
                                    provider?.models?.length - 4
                                  } more models`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        No models available
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {/* <div className="p-4 pt-0">
                {provider.connected ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedProvider(provider);
                      setIsAddModelModalOpen(true);
                    }}
                    className="w-full py-2 text-sm font-medium rounded-lg border border-dashed transition-colors cursor-pointer"
                    style={{
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                      background: "transparent",
                    }}
                  >
                    Add Model
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Connect
                  </motion.button>
                )}
              </div> */}
            </motion.div>
          ))}
        </motion.div>

        {/* Add Model Modal */}
        {/* <AnimatePresence>
          {isAddModelModalOpen && (
            <>
              Backdrop
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm"
                onClick={() => {
                  setIsAddModelModalOpen(false);
                  setIsPremiumModelSelected(false);
                }}
              />

              Modal
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  duration: 0.4,
                }}
                className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
                style={{
                  background: "var(--surface-elevated)",
                  borderLeft: "1px solid var(--border-light)",
                }}
              >
                Header
                <div
                  className="flex items-center justify-between p-6 border-b"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Add New AI Model
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsAddModelModalOpen(false);
                      setIsPremiumModelSelected(false);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                Content
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    Select Model Section
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className="text-lg font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Select a Model
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg cursor-pointer"
                          style={{ color: "var(--primary)" }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Refresh
                        </motion.button>
                      </div>

                      Model Options
                      <div className="space-y-3">
                        {selectedProvider && selectedProvider.connected ? (
                          <>
                            No Models Available Message
                            <div
                              className="p-4 rounded-lg border border-dashed text-center"
                              style={{
                                borderColor: "var(--border-light)",
                                color: "var(--text-secondary)",
                                background: "var(--surface-secondary)",
                              }}
                            >
                              <p className="text-sm">
                                No models available. Check API connection.
                              </p>
                            </div>

                            Premium Model Option
                            <div
                              className="p-4 rounded-lg border hover:bg-opacity-80 transition-colors"
                              style={{
                                borderColor: "var(--border-light)",
                                background: "var(--background)",
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    id="premium-model"
                                    checked={isPremiumModelSelected}
                                    onChange={(e) =>
                                      setIsPremiumModelSelected(
                                        e.target.checked
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    className="peer w-4 h-4 rounded border-2 transition-all cursor-pointer appearance-none hover:border-opacity-70"
                                    style={{
                                      borderColor: isPremiumModelSelected
                                        ? "var(--primary)"
                                        : "var(--border-light)",
                                      backgroundColor: isPremiumModelSelected
                                        ? "var(--primary)"
                                        : "transparent",
                                    }}
                                  />
                                </div>
                                <label
                                  htmlFor="premium-model"
                                  className="text-sm font-medium cursor-pointer select-none"
                                  style={{ color: "var(--text-primary)" }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Premium Model (higher cost)
                                </label>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div
                            className="p-6 rounded-lg border border-dashed text-center"
                            style={{
                              borderColor: "var(--border-light)",
                              color: "var(--text-secondary)",
                              background: "var(--surface-secondary)",
                            }}
                          >
                            <p className="text-sm">
                              Please connect to{" "}
                              {selectedProvider?.name || "provider"} first to
                              add models.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                Footer
                <div
                  className="p-6 border-t"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsAddModelModalOpen(false);
                        setIsPremiumModelSelected(false);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-lg border font-medium cursor-pointer"
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
                      className="flex-1 py-2.5 px-4 rounded-lg font-medium cursor-pointer"
                      style={{
                        background: "var(--primary)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Add Model
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence> */}

        {/* API Key Modal */}
        <AnimatePresence>
          {isApiKeyModalOpen && (
            <>
              {/* Backdrop */}
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

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="w-full max-w-md rounded-xl shadow-2xl"
                  style={{
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <h2
                      className="text-xl font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      API Key
                    </h2>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Your API key is securely stored and never shared with
                      third parties.
                    </p>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      {/* API Key Input */}
                      <div className="relative">
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg border"
                          style={{
                            background: "var(--surface-secondary)",
                            borderColor: "var(--border-light)",
                          }}
                        >
                          <LockIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />

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

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsApiKeyModalOpen(false);
                            setEditedApiKey("");
                            setIsSavingApiKey(false);
                            setSaveDone(false);
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
                          disabled={isSavingApiKey || !editedApiKey?.trim()}
                          onClick={async () => {
                            if (!editedApiKey?.trim()) return;
                            setIsSavingApiKey(true);
                            setSaveDone(false);
                            try {
                              const controller = new AbortController();
                              const res = await mbApi.saveKey(
                                {
                                  providerId: selectedProvider?.id,
                                  api_key: editedApiKey,
                                },
                                { signal: controller.signal }
                              );
                              if (res?.error) throw new Error(res.error);

                              // update UI jadi connected + tampil mask
                              setProviders((prev) =>
                                prev.map((p) =>
                                  p.id === selectedProvider?.id
                                    ? {
                                        ...p,
                                        connected: true,
                                        apiKeyPreview: editedApiKey,
                                      }
                                    : p
                                )
                              );
                              setSaveDone(true);
                              await new Promise((r) => setTimeout(r, 400));
                              setIsApiKeyModalOpen(false);
                              setEditedApiKey("");
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setIsSavingApiKey(false);
                            }
                          }}
                          className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                          style={{
                            background: "var(--primary)",
                            color: "white",
                            border: "none",
                          }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {isSavingApiKey ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : saveDone ? (
                              <Check className="h-4 w-4" />
                            ) : null}
                            <span>
                              {saveDone
                                ? "Saved"
                                : isSavingApiKey
                                ? "Saving..."
                                : "Save"}
                            </span>
                          </div>
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
