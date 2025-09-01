"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Database,
  MessageSquare,
  Bot,
  Calendar,
  User,
  FileText,
  Settings,
  Eye,
  ChevronRight,
  Send,
  Copy,
  RefreshCw,
  Search,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { abApi } from "@/app/lib/agentBaseApi";
import ConfirmDeleteModalAgent from "@/app/components/ConfirmDeleteModalAgent";
import {
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFileAlt,
  FaFileCode,
  FaFileArchive,
  FaFileAudio,
  FaFileVideo,
} from "react-icons/fa";

export default function AgentDetail() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchSessions, setSearchSessions] = useState("");
  const [timeFilter, setTimeFilter] = useState("All time");
  const [agent, setAgent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [detailSession, setDetailSession] = useState("");

  const currentId = agent?.id || params?.id;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const res = await abApi.detail(params.id, { signal });
        const resListSessions = await abApi.detailListSession(params.id, { signal });

        const a = res?.data || {};
        const dataSourceLabel = (() => {
          const t = (a.data_source_type && a.data_source_type[0]) || "";
          if (t === "knowledge-bases") return "Knowledge Bases";
          if (t === "database-connections") return "Database Connections";
          if (t === "api-features") return "API Features";
          return "-";
        })();

        const mapped = {
          id: a.id,
          name: a?.name || "-",
          description: a.description || "",
          dataSources: dataSourceLabel,
          timestamp: a.created_at
            ? new Date(a.created_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "-",
          model: a?.default_model?.id || "-",
          knowledgeBases: Array.isArray(a.knowledgebases)
            ? a.knowledgebases.length
            : 0,
          sessions: a.sessions_count ?? 0,
          createdBy: a.created_by_name || a.created_by || "-",
          agentId: a.id || "-",
          systemPrompt: a.system_prompt || "",
          kbDetails: Array.isArray(a.knowledgebases)
            ? a.knowledgebases.map((k) => ({
              name: k?.name,
              description: k.description || "",
              docs:
                typeof k.documentCount === "number"
                  ? k.documentCount
                  : typeof k.docs === "number"
                    ? k.docs
                    : 0,
              category: "General",
            }))
            : [],
        };

        setAgent(mapped);

        console.log(resListSessions.data);
        setSessions(resListSessions.data || [])
      } catch (e) {
        if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") return;
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort("overview unmount");
  }, [params.id]);

  const tabs = ["Overview", "Chat", "Sessions"];


  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: `I understand you're asking about "${inputMessage}". As ${agent?.name}, I can help you with that. This is a simulated response to demonstrate the chat interface.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsSending(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter sessions based on search and time
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session?.session_name || ""
      .toLowerCase()
      .includes(searchSessions.toLowerCase());
    // For now, we'll just filter by search. Time filtering can be expanded later
    return matchesSearch;
  });

  const knowledgeBaseDetails =
    agent?.dataSources === "Knowledge Bases"
      ? Array.isArray(agent?.kbDetails)
        ? agent.kbDetails
        : []
      : [];

  // Delete modal state
  const [delOpen, setDelOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const openDelete = () => setDelOpen(true);
  const closeDelete = () => {
    if (!delLoading) setDelOpen(false);
  };

  const confirmDelete = () => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        setDelLoading(true);

        if (abApi?.remove) {
          const res = await abApi.remove(currentId, { signal });
          if (!res || res.error)
            throw new Error(res?.error || "Failed to delete agent.");
        } else {
          const r = await fetch(`/api/agent/${currentId}`, {
            method: "DELETE",
            signal,
          });
          if (!r.ok) throw new Error("Failed to delete agent.");
        }

        router.push("/agents");
      } catch (e) {
        if (e?.name !== "AbortError" && e?.code !== "ERR_CANCELED") {
          console.error(e);
        }
      } finally {
        setDelLoading(false);
        setDelOpen(false);
      }
    })();

    return () => controller.abort();
  };

  const handleDetailSession = async (detailSession) => {
    setActiveTab("Chat");

    const controller = new AbortController();
    const { signal } = controller;

    try {
      const resSessionMessages = await abApi.detailListSessionMessages(params.id, detailSession?.id, { signal });
      console.log(resSessionMessages.data);

      setMessages(resSessionMessages.data || []);

    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Failed to fetch session messages:", error);
      }
      setMessages([]);
    }

    return () => controller.abort();
  };

  const handleRefreshSession = async () => {
    try {
      const controller = new AbortController();
      const { signal } = controller;
      const resListSessions = await abApi.detailListSession(params.id, { signal });
      setSessions(resListSessions.data || []);
    } catch (e) {
      if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") return;
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }


  // Skeleton Components
  const HeaderSkeleton = () => (
    <div
      className="rounded-xl border mb-8"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-400 animate-pulse" />
            <div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                <div className="h-4 w-36 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <div
              key={tab}
              className="h-10 w-24 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );

  const OverviewCardsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-lg border"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-light)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          </div>
          <div className="h-5 w-28 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-1" />
          <div className="h-8 w-12 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-1" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  const KnowledgeBaseSkeleton = () => (
    <div className="space-y-4">
      <div
        className="p-4 rounded-lg border"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
            <div className="flex items-center gap-4">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AgentDetailsSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-6 rounded-lg border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
            <div className="h-16 w-full bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div
        className="p-6 rounded-lg border"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
      >
        <div>
          {/* Back Button Skeleton */}
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-6" />

          {/* Header Skeleton */}
          <HeaderSkeleton />

          {/* Content Skeleton */}
          <div
            className="space-y-6 rounded-xl border p-6"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            {/* Overview Cards Skeleton */}
            <div>
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-6" />
              <OverviewCardsSkeleton />
            </div>

            {/* Knowledge Base Details Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              </div>
              <KnowledgeBaseSkeleton />
            </div>

            {/* Agent Details Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              </div>
              <AgentDetailsSkeleton />
            </div>
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
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </motion.button>

        {/* Agent Header Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border mb-8 overflow-hidden"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-light)",
          }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--primary)" }}
                >
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {agent?.name || "-"}
                  </h1>
                  <div
                    className="flex items-center gap-4 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created {agent?.timestamp || ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {agent?.createdBy || ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {agent?.agentId || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg border cursor-pointer"
                  style={{
                    background: "var(--surface-secondary)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-secondary)",
                  }}
                  onClick={() => router.push(`/agents/edit/${currentId}`)}
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg border cursor-pointer"
                  style={{
                    background: "var(--surface-secondary)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-secondary)",
                  }}
                  onClick={openDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition-all"
                  style={{
                    background:
                      activeTab === tab ? "var(--primary)" : "transparent",
                    color:
                      activeTab === tab
                        ? "var(--text-inverse)"
                        : "var(--text-secondary)",
                  }}
                >
                  {tab === "Overview" && <Eye className="h-4 w-4" />}
                  {tab === "Chat" && <MessageSquare className="h-4 w-4" />}
                  {tab === "Sessions" && <Settings className="h-4 w-4" />}
                  {tab}
                  {tab === "Sessions" && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                      1
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        {activeTab === "Overview" && (
          <div
            className="space-y-6 rounded-xl border p-6"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            {/* Agent Overview Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2
                className="text-xl font-semibold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Agent Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Knowledge Bases Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-lg border cursor-pointer"
                  style={{
                    background: "var(--primary)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/80" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Knowledge Bases
                  </h3>
                  <p className="text-2xl font-bold text-white mb-1">
                    {agent?.knowledgeBases || 0}
                  </p>
                  <p className="text-xs text-white/80">
                    {knowledgeBaseDetails.length > 0
                      ? knowledgeBaseDetails[0]?.name
                      : "General"}
                  </p>
                </motion.div>

                {/* Sessions Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-lg border cursor-pointer"
                  style={{
                    background: "var(--primary)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-white/80">
                      <span className="text-xs">View History</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Sessions
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {agent?.sessions || 0}
                  </p>
                </motion.div>

                {/* AI Model Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-lg border cursor-pointer"
                  style={{
                    background: "var(--primary)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-white/80">
                      <span className="text-xs">Change</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    AI Model
                  </h3>
                  <p className="text-xl font-bold text-white">
                    {agent?.model || "-"}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Knowledge Base Details or API Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {agent?.dataSources === "Knowledge Bases"
                    ? "Knowledge Base Details"
                    : "API Features"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm font-medium cursor-pointer hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  Edit
                </motion.button>
              </div>
              <div className="space-y-4">
                {knowledgeBaseDetails.length > 0 ? (
                  knowledgeBaseDetails.map((kb, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="p-4 rounded-lg border"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-light)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: "var(--primary)" }}
                        >
                          <Database className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold mb-1"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {kb?.name}
                          </h3>
                          <p
                            className="text-sm mb-2"
                            style={{
                              color: "var(--text-secondary)",
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {kb?.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs">
                            <span
                              className="px-2 py-1 rounded-md font-medium"
                              style={{
                                background: "var(--primary-light)",
                                color: "var(--primary)",
                              }}
                            >
                              {kb.docs} docs
                            </span>
                            <span
                              className="px-2 py-1 rounded-md font-medium"
                              style={{
                                background: "var(--success-light)",
                                color: "var(--success)",
                              }}
                            >
                              {kb.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div
                    className="p-8 rounded-lg border text-center"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <h3
                      className="text-lg font-medium mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      API Features
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      This agent uses {agent?.apiFeatures || 0} API features for
                      enhanced functionality
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Agent Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Agent Details
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm font-medium cursor-pointer hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  Edit
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <h3
                    className="font-semibold text-sm mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Description
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {agent?.description || "-"}
                  </p>
                </div>
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <h3
                    className="font-semibold text-sm mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    System Prompt
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {agent?.systemPrompt || ""}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <h3
                    className="font-semibold text-sm mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Data Sources:
                  </h3>
                  <span
                    className="inline-block px-3 py-1 rounded-md text-sm font-medium"
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                    }}
                  >
                    {agent?.dataSources}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "Chat" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border overflow-hidden"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            {/* Chat Header */}
            <div
              className="p-4 border-b"
              style={{ borderColor: "var(--border-light)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--primary)" }}
                >
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {agent?.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    AI Assistant • {agent?.model}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message?.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[70%] ${message?.role === "user" ? "order-2" : "order-1"
                      }`}
                  >
                    {message?.role !== "user" && (
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "var(--primary)" }}
                        >
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {agent?.name}
                        </span>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg ${message?.role === "user"
                        ? "rounded-br-sm"
                        : "rounded-bl-sm"
                        }`}
                      style={{
                        background:
                          message?.role === "user"
                            ? "var(--primary)"
                            : message?.role === "system"
                              ? "var(--surface-secondary)"
                              : "var(--surface-secondary)",
                        color:
                          message?.role === "user"
                            ? "var(--text-inverse)"
                            : "var(--text-primary)",
                      }}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs ${message?.role === "user" ? "text-white/70" : ""
                            }`}
                          style={{
                            color:
                              message?.role === "user"
                                ? "rgba(255, 255, 255, 0.7)"
                                : "var(--text-tertiary)",
                          }}
                        >
                          {message.timestamp}
                        </span>
                        {message?.role !== "system" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              navigator.clipboard.writeText(message.content)
                            }
                            className={`ml-2 p-1 rounded ${message?.role === "user"
                              ? "hover:bg-white/20"
                              : "hover:bg-gray-100"
                              }`}
                          >
                            <Copy className="h-3 w-3" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isSending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[70%]">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "var(--primary)" }}
                      >
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {agent?.name}
                      </span>
                    </div>
                    <div
                      className="p-3 rounded-lg rounded-bl-sm"
                      style={{
                        background: "var(--surface-secondary)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="p-4 border-t"
              style={{ borderColor: "var(--border-light)" }}
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full resize-none rounded-lg border px-3 h-[40px] text-sm focus:outline-none focus:ring-2 leading-[40px]"
                    style={{
                      background: "var(--background)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      "--tw-ring-color": "var(--primary)",
                    }}
                    disabled={isSending}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSending}
                  className="size-10 rounded-lg border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{
                    background:
                      inputMessage.trim() && !isSending
                        ? "var(--primary)"
                        : "var(--surface-secondary)",
                    borderColor: "var(--border-light)",
                    color:
                      inputMessage.trim() && !isSending
                        ? "var(--text-inverse)"
                        : "var(--text-secondary)",
                  }}
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
              <p
                className="text-xs mt-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Press Enter to send, Shift+Enter for new line
              </p>

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-4"
                >
                  <p
                    className="text-sm font-medium mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Quick suggestions
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setInputMessage("🤔 What can you help me with?")
                      }
                      className="flex items-center gap-2 p-3 rounded-lg border text-left text-sm cursor-pointer hover:border-opacity-80"
                      style={{
                        background: "var(--background)",
                        borderColor: "var(--border-light)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span>🤔</span>
                      <span>What can you help me with?</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setInputMessage("👋 Tell me more about yourself")
                      }
                      className="flex items-center gap-2 p-3 rounded-lg border text-left text-sm cursor-pointer hover:border-opacity-80"
                      style={{
                        background: "var(--background)",
                        borderColor: "var(--border-light)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span>👋</span>
                      <span>Tell me more about yourself</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setInputMessage("📚 What knowledge do you have?")
                      }
                      className="flex items-center gap-2 p-3 rounded-lg border text-left text-sm cursor-pointer hover:border-opacity-80"
                      style={{
                        background: "var(--background)",
                        borderColor: "var(--border-light)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span>📚</span>
                      <span>What knowledge do you have?</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "Sessions" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border overflow-hidden shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--surface-elevated) 0%, var(--background) 100%)",
              borderColor: "var(--border-light)",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Session Header */}
            <div
              className="px-6 py-5 border-b relative"
              style={{
                borderColor: "var(--border-light)",
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Session History
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    onClick={handleRefreshSession}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                      color: "var(--primary)",
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="relative flex items-center gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Search className="h-3 w-3 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchSessions}
                    onChange={(e) => setSearchSessions(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-transparent shadow-sm hover:shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--background) 0%, rgba(255, 255, 255, 0.8) 100%)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      "--tw-ring-color": "rgba(59, 130, 246, 0.2)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                </div>
                <div className="relative min-w-[140px]">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="appearance-none w-full pl-4 pr-10 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:border-transparent shadow-sm hover:shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--background) 0%, rgba(255, 255, 255, 0.8) 100%)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      "--tw-ring-color": "rgba(59, 130, 246, 0.2)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <option value="All time">All time</option>
                    <option value="Today">Today</option>
                    <option value="This week">This week</option>
                    <option value="This month">This month</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <ChevronDown className="h-3 w-3 text-white pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="border-b text-left relative"
                    style={{
                      borderColor: "var(--border-light)",
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)",
                    }}
                  >
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Session
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Messages
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Last Active
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-right bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredSessions.map((session, index) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group hover:shadow-lg cursor-pointer relative border-b border-(--border-light)"
                      whileHover={{
                        background:
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
                        scale: 1.01,
                      }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg" />
                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse opacity-75" />
                          </div>
                          <div className="flex-1">
                            <span
                              className="font-semibold text-sm group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {session?.session_name || "-"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                            <MessageSquare className="h-3 w-3 text-blue-600" />
                          </div>
                          <span
                            className="text-sm font-medium transition-colors duration-200"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {session?.message_count || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-500/10 to-teal-500/10">
                            <Calendar className="h-3 w-3 text-green-600" />
                          </div>
                          <span
                            className="text-sm font-medium transition-colors duration-200"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {session.last_active}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05, x: 3 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                              color: "var(--primary)",
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                            }}
                            onClick={() => handleDetailSession(session)}
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                            <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md opacity-60 group-hover:opacity-100"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-5 border-t relative overflow-hidden"
              style={{
                borderColor: "var(--border-light)",
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.03) 100%)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <Database className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Showing {filteredSessions.length} of {sessions.length}{" "}
                    sessions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      color: "var(--text-primary)",
                      borderColor: "rgba(59, 130, 246, 0.3)",
                      background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%)",
                    }}
                  >
                    Export
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    style={{
                      color: "white",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                    }}
                  >
                    New Session
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <ConfirmDeleteModalAgent
        open={delOpen}
        loading={delLoading}
        title="Delete Agent?"
        description="This action cannot be undone. You will permanently delete:"
        item={{
          name: agent?.name,
          meta: [
            agent?.createdBy || "Unknown",
            agent?.timestamp || "-",
            `${agent?.knowledgeBases || 0} KB`,
          ],
        }}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </motion.main>
  );
}
