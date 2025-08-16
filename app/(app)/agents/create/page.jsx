"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bot,
  Search,
  ChevronDown,
  Database,
  Globe,
  Brain,
  Code,
  Check,
  AlertCircle,
  Cpu,
  Zap,
  Rocket,
  Sparkles,
  BookOpen,
  Server,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { kbApi } from "@/app/lib/knowledgeBaseApi";
import { mbApi } from "@/app/lib/modelBaseApi";
import { abApi } from "@/app/lib/agentBaseApi";

const ICONS = { Bot, Sparkles, Rocket, Zap, Brain, Database };

export default function CreateAgent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [agentName, setAgentName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant who..."
  );
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [selectedProvider, setSelectedProvider] = useState("OpenAI");
  const [selectedDataSource, setSelectedDataSource] =
    useState("Knowledge Bases");
  // KB state
  const [kbLoading, setKbLoading] = useState(true);
  const [kbError, setKbError] = useState("");
  const [knowledgeBases, setKnowledgeBases] = useState([]);

  const [searchKnowledgeBases, setSearchKnowledgeBases] = useState("");
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState([]);
  // Model Providers state
  const [modelProviders, setModelProviders] = useState([]);
  const [providersError, setProvidersError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");



  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      setKbLoading(true);
      setKbError("");
      setProvidersError("");

      try {
        const [resKB, resMB] = await Promise.all([kbApi.all({ signal }), mbApi.list({ signal })]);

        if (!resKB || resKB.error) throw new Error(resKB?.error || "Failed to load knowledge bases.");
        const rawKB = Array.isArray(resKB.data) ? resKB.data : [];
        const mappedkb = rawKB.map((it, i) => ({
          id: it.id ?? String(i),
          name: it.name ?? `KB ${i + 1}`,
          documents:
            typeof it.docs_count === "number"
              ? it.docs_count
              : Array.isArray(it.documents)
                ? it.documents.length
                : 0,
          description: it.description ?? "",
          color: it.color ?? "#4F46E5",
          createdAt: it.created_at ?? null,
          updatedAt: it.updated_at ?? null,
          roles: Array.isArray(it.roles) ? it.roles : [],
          _raw: it,
        }));
        setKnowledgeBases(mappedkb);

        if (!resMB || resMB.error) throw new Error(resMB?.error || "Failed to load model providers.");
        const mbRaw = Array.isArray(resMB.data) ? resMB.data : [];
        const order = ["openai", "anthropic", "deepseek", "mistral", "qwen", "ollama"];
        const iconMap = {
          openai: "Bot",
          anthropic: "Sparkles",
          deepseek: "Rocket",
          mistral: "Zap",
          qwen: "Brain",
          ollama: "Database",
        };

        const toIconKey = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "Bot");
        const mappedProviders = (Array.isArray(mbRaw) ? mbRaw : [])
          .map((p) => {
            const hasKey = !!p.apiKeyPreview;                   

            const iconName = iconMap[p.id] ?? toIconKey(p.icon) ?? "Bot";

            const rawModels = Array.isArray(p.models) ? p.models : [];

            const models = rawModels.filter(
              (m) => m && m.id && m.name && (hasKey ? m.enabled === true : true)
            );

            return {
              ...p,
              icon: iconName,                                    
              connected: hasKey,                                  
              status: hasKey ? "Connected" : "Not configured",
              models,
            };
          })
          .sort((a, b) => {
            const ia = order.indexOf(a.id);
            const ib = order.indexOf(b.id);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return (a.name || "").localeCompare(b.name || "");
          });

        setModelProviders(mappedProviders);

      } catch (e) {
        if (e.name !== "AbortError") {
          if (!kbError) setKbError(e?.message || "Unexpected error.");
          if (!providersError) setProvidersError(e?.message || "Unexpected error.");
        }
      } finally {
        setKbLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const dataSourceOptions = [
    {
      id: "Knowledge Bases",
      title: "Knowledge Bases",
      description: "Upload documents for your agent to use",
      icon: BookOpen,
    },
    {
      id: "Database Connections",
      title: "Database Connections",
      description: "Connect to your database resources",
      icon: Server,
    },
    {
      id: "API Features",
      title: "API Features",
      description: "Use API endpoints in your agent",
      icon: Code,
    },
  ];

  const filteredKnowledgeBases = knowledgeBases.filter((kb) =>
    kb.name.toLowerCase().includes(searchKnowledgeBases.toLowerCase())
  );

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleKnowledgeBaseToggle = (kbId) => {
    setSelectedKnowledgeBases((prev) =>
      prev.includes(kbId) ? prev.filter((id) => id !== kbId) : [...prev, kbId]
    );
  };

  const handleCreateAgent = () => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      setIsSubmitting(true);
      setSubmitErr("");

      try {
        // cari provider & model yang dipilih
        const prov =
          modelProviders.find((p) => p.models.some((m) => m.id === selectedModel)) ||
          modelProviders.find((p) => p.id === selectedProviderId) ||
          null;

        const providerId = (prov?.id || "").toLowerCase();
        const mdl = prov?.models.find((m) => m.id === selectedModel) || null;

        const kbList =
          selectedDataSource === "Knowledge Bases"
            ? knowledgeBases
              .filter((kb) => selectedKnowledgeBases.includes(kb.id))
              .map((kb) => ({
                name: kb.name,
                description: kb.description || "",
                documentCount:
                  typeof kb.documents === "number" ? kb.documents : 0,
              }))
            : [];
        const DATA_SOURCE_KEY = {
          "Knowledge Bases": "knowledge-bases",
          "Database Connections": "database-connections",
          "API Features": "api-features",
        };
        const chosenType = DATA_SOURCE_KEY[selectedDataSource] || "";

        const payload = {
          name: agentName.trim(),
          description: description.trim(),
          system_prompt: systemPrompt,
          color: "#4F46E5",
          default_model: {
            providerId,
            id: selectedModel,
            name: mdl?.name || selectedModel,
          },
          knowledgebases: kbList,
          databases: [],          
          features_knowledge: [],  
          data_source_type: chosenType ? [chosenType] : [],
        };

        if (!payload.name) throw new Error("Please provide an agent name.");
        if (!payload.default_model.providerId || !payload.default_model.id) {
          throw new Error("Please select a model.");
        }

        const res = await abApi.create(payload, { signal });
        if (!res || res.error) throw new Error(res?.error || "Failed to create agent.");

        router.push("/agents");
      } catch (e) {
        if (e.name !== "AbortError") setSubmitErr(e?.message || "Terjadi kesalahan.");
      } finally {
        setIsSubmitting(false);
      }
    })();
  };


  // Skeleton Components
  const FormFieldSkeleton = ({ rows = 1 }) => (
    <div className="space-y-2">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
      {rows === 1 ? (
        <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-xl animate-pulse" />
      ) : (
        <div
          className={`h-${rows * 6
            } w-full bg-gray-200 dark:bg-gray-400 rounded-xl animate-pulse`}
        />
      )}
    </div>
  );

  const CardSkeleton = ({ children }) => (
    <div
      className="rounded-xl border p-4 md:p-6 lg:p-8 backdrop-blur-sm"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-9 h-9 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
      </div>
      {children}
    </div>
  );

  const DataSourceSkeleton = () => (
    <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 md:p-6 rounded-xl border-2"
          style={{
            background: "var(--background)",
            borderColor: "var(--border-light)",
          }}
        >
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-3 md:gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse shrink-0" />
            <div className="flex-1 text-center sm:text-left lg:text-center xl:text-left">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
              <div className="h-3 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ModelProviderSkeleton = () => (
    <div className="space-y-4 md:space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2 md:space-y-3 ml-3 sm:ml-6">
            {[1, 2].map((j) => (
              <div
                key={j}
                className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const SidebarSkeleton = () => (
    <div
      className="w-full xl:w-80 border-t xl:border-t-0 xl:border-l p-4 md:p-6"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4" />
      <div
        className="rounded-lg border p-4 md:p-4 mb-6"
        style={{
          background: "var(--background)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="flex flex-col sm:flex-row xl:flex-col items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-1" />
              <div className="h-3 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-400 rounded-xl animate-pulse" />
    </div>
  );

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[var(--background)]"
      >
        <div className="">
          <div
            className="sticky top-0 z-10 border-b bg-[var(--background)]/80 backdrop-blur-sm"
            style={{ borderColor: "var(--border-light)" }}
          >
            {/* Header Skeleton */}
            <div className="flex items-center justify-between p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row">
            {/* Main Content Skeleton */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Left Column Skeleton */}
                  <div className="space-y-6 lg:space-y-8">
                    {/* Agent Details Skeleton */}
                    <CardSkeleton>
                      <div className="space-y-6">
                        <FormFieldSkeleton />
                        <FormFieldSkeleton rows={4} />
                        <FormFieldSkeleton rows={6} />
                      </div>
                    </CardSkeleton>

                    {/* Data Source Skeleton */}
                    <CardSkeleton>
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-6" />
                      <DataSourceSkeleton />
                    </CardSkeleton>
                  </div>

                  {/* Right Column Skeleton */}
                  <div>
                    <CardSkeleton>
                      <ModelProviderSkeleton />
                    </CardSkeleton>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <SidebarSkeleton />
          </div>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[var(--background)]"
    >
      <div className="">
        <div
          className="sticky top-0 z-10 border-b bg-[var(--background)]/80 backdrop-blur-sm"
          style={{ borderColor: "var(--border-light)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>
              <h1
                className="text-2xl font-semibold max-sm:text-xl"
                style={{ color: "var(--text-primary)" }}
              >
                Create New Agent
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Agent Details */}
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
                          Description *
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe what this agent does and its purpose..."
                          rows={4}
                          className="w-full px-4 py-4 rounded-xl border-2 border-transparent focus:outline-none focus:border-[var(--primary)] resize-none transition-all"
                          style={{
                            background: "var(--surface-secondary)",
                            color: "var(--text-primary)",
                          }}
                        />
                        <div className="flex justify-between mt-2">
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Brief description of the agent's purpose and
                            capabilities
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {description.length}/500
                          </p>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "var(--text-primary)" }}
                        >
                          System Prompt *
                        </label>
                        <div className="relative">
                          <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-4 rounded-xl border-2 border-transparent focus:outline-none focus:border-[var(--primary)] resize-none transition-all"
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
                      </div>
                    </div>
                  </div>

                  {/* Data Source */}
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
                        <Database
                          className="h-5 w-5"
                          style={{ color: "var(--primary)" }}
                        />
                      </div>
                      <h3
                        className="text-lg md:text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Data Source
                      </h3>
                    </div>

                    <p
                      className="text-sm mb-6"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Select a data source type:
                    </p>

                    <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6">
                      {dataSourceOptions.map((option) => (
                        <motion.div
                          key={option.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedDataSource(option.id)}
                          className={`p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-3 md:gap-4 ${selectedDataSource === option.id
                            ? "border-[var(--primary)] bg-[var(--primary)]/10"
                            : "border-transparent hover:border-[var(--border-light)] hover:bg-[var(--surface-secondary)]"
                            }`}
                          style={{
                            background:
                              selectedDataSource === option.id
                                ? "var(--primary-light)"
                                : "var(--background)",
                          }}
                        >
                          <div
                            className="p-3 rounded-lg shrink-0"
                            style={{ background: "var(--primary-light)" }}
                          >
                            <option.icon
                              className="h-5 w-5 md:h-6 md:w-6"
                              style={{ color: "var(--primary)" }}
                            />
                          </div>
                          <div className="flex-1 text-center sm:text-left lg:text-center xl:text-left">
                            <h4
                              className="font-semibold text-sm md:text-base mb-1"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {option.title}
                            </h4>
                            <p
                              className="text-xs md:text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {option.description}
                            </p>
                          </div>
                          {selectedDataSource === option.id && (
                            <Check
                              className="h-5 w-5"
                              style={{ color: "var(--primary)" }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Knowledge Bases Selection */}
                    {selectedDataSource === "Knowledge Bases" && (
                      <div>
                        <h4
                          className="font-medium mb-4"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Select Knowledge Bases
                        </h4>

                        <div className="relative mb-4">
                          <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <input
                            type="text"
                            value={searchKnowledgeBases}
                            onChange={(e) =>
                              setSearchKnowledgeBases(e.target.value)
                            }
                            placeholder="Search knowledge bases..."
                            className="w-full pl-10 pr-4 py-4 rounded-xl border-2 border-transparent focus:outline-none focus:border-[var(--primary)] transition-all"
                            style={{
                              background: "var(--surface-secondary)",
                              color: "var(--text-primary)",
                            }}
                          />
                        </div>

                        <div className="space-y-3">
                          {filteredKnowledgeBases.map((kb) => (
                            <label
                              key={kb.id}
                              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                              style={{
                                background: "var(--background)",
                                borderColor: "var(--border-light)",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedKnowledgeBases.includes(kb.id)}
                                onChange={() =>
                                  handleKnowledgeBaseToggle(kb.id)
                                }
                                className="h-4 w-4 rounded"
                                style={{ accentColor: "var(--primary)" }}
                              />
                              <div className="flex-1">
                                <h5
                                  className="font-medium"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {kb.name}
                                </h5>
                                <p
                                  className="text-xs"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {kb.documents} document
                                  {kb.documents !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Model Selection */}
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
                        <Cpu
                          className="h-5 w-5"
                          style={{ color: "var(--primary)" }}
                        />
                      </div>
                      <h3
                        className="text-lg md:text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Model Selection
                      </h3>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {modelProviders.map((provider) => (
                        <div key={provider.name}>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                            <div
                              className="p-2 rounded-lg"
                              style={{ background: "var(--surface-secondary)" }}
                            >
                              <div className="p-2 rounded-lg" style={{ background: "var(--surface-secondary)" }}>
                                {(() => {
                                  const Icon = ICONS[provider.icon] || Bot;
                                  return <Icon className="h-5 w-5" style={{ color: "var(--text-primary)" }} />;
                                })()}
                              </div>
                            </div>
                            <h4
                              className="font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {provider.name}
                            </h4>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${provider.status === "Connected"
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : "bg-gray-50 text-gray-600 border border-gray-200"
                                }`}
                            >
                              {provider.status}
                            </span>
                          </div>

                          <div className="space-y-2 md:space-y-3 ml-3 sm:ml-6">
                            {provider.models.map((model) => (
                              <label
                                key={model.id}
                                className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedModel === model.id
                                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                  : "border-transparent hover:border-[var(--border-light)] hover:bg-[var(--surface-secondary)]"
                                  } ${provider.status !== "Connected"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                  }`}
                                style={{
                                  background:
                                    selectedModel === model.id
                                      ? "var(--primary-light)"
                                      : "var(--background)",
                                }}
                              >
                                <input
                                  type="radio"
                                  name="model"
                                  value={model.id}
                                  checked={selectedModel === model.id}
                                  onChange={() => {
                                    setSelectedModel(model.id);
                                    setSelectedProvider(provider.name);
                                  }}
                                  disabled={provider.status !== "Connected"}
                                  className="h-4 w-4"
                                  style={{
                                    accentColor:
                                      selectedModel === model.id
                                        ? "white"
                                        : "var(--primary)",
                                  }}
                                />
                                <span
                                  className={`text-sm font-medium flex-1 ${provider.status !== "Connected"
                                    ? "text-gray-400"
                                    : ""
                                    }`}
                                  style={{
                                    color:
                                      provider.status !== "Connected"
                                        ? "rgb(156, 163, 175)"
                                        : "var(--text-primary)",
                                  }}
                                >
                                  {model.name}
                                </span>
                                {selectedModel === model.id && (
                                  <Check
                                    className="h-5 w-5"
                                    style={{ color: "var(--primary)" }}
                                  />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Agent Preview Sidebar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full xl:w-80 border-t xl:border-t-0 xl:border-l p-4 md:p-6 overflow-y-auto xl:sticky xl:top-[88px] xl:h-[calc(100vh-88px)]"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Agent Preview
            </h3>

            <div
              className="rounded-lg border p-4 md:p-4 mb-6"
              style={{
                background: "var(--background)",
                borderColor: "var(--border-light)",
              }}
            >
              <div className="flex flex-col sm:flex-row xl:flex-col items-center sm:items-start xl:items-center gap-3 mb-4 text-center sm:text-left xl:text-center">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: "var(--primary)",
                    color: "var(--text-inverse)",
                  }}
                >
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h4
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {agentName || "New Agent"}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Using {selectedModel} ({selectedProvider})
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Description
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {description || "No description provided yet."}
                  </p>
                </div>

                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Data Sources
                  </p>
                  <span
                    className="inline-block px-2 py-1 text-xs rounded-md font-medium"
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                    }}
                  >
                    {selectedDataSource}
                  </span>
                </div>

                {selectedDataSource === "Knowledge Bases" && (
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {selectedKnowledgeBases.length > 0
                        ? `${selectedKnowledgeBases.length} knowledge base${selectedKnowledgeBases.length !== 1 ? "s" : ""
                        } selected`
                        : "No data sources selected"}
                    </p>
                  </div>
                )}

                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Created By
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    demo@ifabula.com
                  </p>
                </div>
              </div>

              <div
                className="mt-4 p-3 rounded-lg flex items-start gap-2"
                style={{ background: "var(--surface-secondary)" }}
              >
                <AlertCircle
                  className="h-4 w-4 mt-0.5 flex-shrink-0"
                  style={{ color: "var(--text-secondary)" }}
                />
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  When created, this agent will be available in your Agents list
                  and can be used to chat with your knowledge bases.
                </p>
              </div>
            </div>

            <div className="">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateAgent}
                disabled={isSubmitting || !agentName.trim() || !description.trim() || !selectedModel}
                className="px-6 py-3 md:px-4 md:py-2 text-sm md:text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center cursor-pointer"
                style={{
                  background:
                    !isSubmitting && agentName.trim() && description.trim() && selectedModel
                      ? "var(--primary)"
                      : "var(--surface-secondary)",
                  color:
                    !isSubmitting && agentName.trim() && description.trim() && selectedModel
                      ? "var(--text-inverse)"
                      : "var(--text-secondary)",
                }}
              >
                {isSubmitting ? "Creating..." : "Create Agent"}
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              </motion.button>

              {submitErr && (
                <p className="mt-2 text-xs" style={{ color: "var(--danger)" }}>
                  {submitErr}
                </p>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
