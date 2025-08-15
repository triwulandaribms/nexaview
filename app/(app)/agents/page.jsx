"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Download,
  List,
  Grid3X3,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Database,
  User,
  Bot,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useRouter } from "next/navigation";
import { abApi } from "@/app/lib/agentBaseApi";

export default function Agents() {
  const [activeTab, setActiveTab] = useState("My agents");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  // const tabs = ["My agents", "Favourite agents"];


  // Simulate data loading
  useEffect(() => {

    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const res = await abApi.list({ signal });
        if (!res || res.error) {
          throw new Error(res?.error || "Gagal memuat dataset.");
        }
        console.log(res.data, " <===  check hasil nya ");


        setAgents(res?.data);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e?.message || "Terjadi kesalahan.");
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1200);


  //   return () => clearTimeout(timer);
  // }, []);


  const agents2 = [
    {
      id: 1,
      name: "Meeting Summary",
      description: "-",
      dataSources: "Knowledge Bases",
      timestamp: "26 Jun 2025 11:50",
      model: "gpt-4",
      knowledgeBases: 1,
      createdBy: "demo@ifabula.com",
      icon: "🤖",
    },
    {
      id: 2,
      name: "Agent testing pinter",
      description:
        "Agent testing pinter untuk melakukan pencarian data di internet",
      dataSources: "Knowledge Bases",
      timestamp: "11 Jun 2025 14:24",
      model: "gpt-4o",
      knowledgeBases: 1,
      createdBy: "demo@ifabula.com",
      icon: "🤖",
    },
    {
      id: 3,
      name: "Credit Analyst",
      description: "-",
      dataSources: "Knowledge Bases",
      timestamp: "24 Jun 2025 09:34",
      model: "qwen-max",
      knowledgeBases: 2,
      createdBy: "demo@ifabula.com",
      icon: "🤖",
    },
    {
      id: 4,
      name: "Agent Summary",
      description: "-",
      dataSources: "Knowledge Bases",
      timestamp: "17 Jun 2025 12:00",
      model: "gpt-4o",
      knowledgeBases: 2,
      createdBy: "demo@ifabula.com",
      icon: "🤖",
    },
    {
      id: 5,
      name: "Assistant Hukum",
      description: "-",
      dataSources: "Knowledge Bases",
      timestamp: "16 May 2025 17:10",
      model: "gpt-4o",
      knowledgeBases: 1,
      createdBy: "demo@ifabula.com",
      icon: "🤖",
    },
    {
      id: 6,
      name: "Agent Whatsapp",
      description: "revision 6",
      dataSources: "API Features",
      timestamp: "11 Jun 2025 18:00",
      model: "gpt-4o",
      apiFeatures: 4,
      createdBy: "demo@ifabula.com",
      icon: "🤖",
    },
  ];

  // Skeleton Components
  const HeaderSkeleton = () => (
    <div>
      {/* Title and New Agent Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative max-w-md">
          <div className="h-12 w-80 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-20 bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );

  const GridSkeletonCard = () => (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      {/* Card Header */}
      <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />

      <div className="p-6">
        {/* Actions Menu */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
        </div>

        {/* Agent Icon and Name */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          </div>
        </div>

        {/* Data Sources */}
        <div className="mb-4">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* View Button */}
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
      </div>
    </div>
  );

  const ListSkeletonCard = () => (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      {/* Card Header */}
      <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />

      <div className="p-4">
        {/* Actions Menu */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
        </div>

        {/* Horizontal Layout */}
        <div className="flex gap-4">
          {/* Agent Icon */}
          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />

          {/* Agent Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
            </div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* View Button */}
          <div className="flex-shrink-0 flex items-end">
            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const GridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="relative">
          <GridSkeletonCard />
        </div>
      ))}
    </div>
  );

  const ListSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="relative">
          <ListSkeletonCard />
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
      >
        <div>
          <HeaderSkeleton />

          {/* Content Skeleton */}
          {viewMode === "grid" ? <GridSkeleton /> : <ListSkeleton />}
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              AI Agents
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/agents/create")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer"
            style={{
              background: "var(--primary)",
              color: "var(--text-inverse)",
            }}
          >
            <Plus className="h-4 w-4" />
            New Agent
          </motion.button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          {/* Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative max-w-md"
          >
            <div>
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--text-tertiary)" }}
              />
            </div>
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--primary)",
              }}
            />
          </motion.div>

          {/* View Toggle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <motion.div
              className="flex items-center rounded-md border overflow-hidden"
              style={{ borderColor: "var(--border-light)" }}
            >
              <motion.button
                className="px-3 py-2 cursor-pointer flex items-center gap-2"
                style={{
                  background:
                    viewMode === "list"
                      ? "var(--primary)"
                      : "var(--surface-elevated)",
                  color:
                    viewMode === "list"
                      ? "var(--text-inverse)"
                      : "var(--text-secondary)",
                }}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </motion.button>
              <motion.button
                className="px-3 py-2 cursor-pointer border-l flex items-center gap-2"
                style={{
                  background:
                    viewMode === "grid"
                      ? "var(--primary)"
                      : "var(--surface-elevated)",
                  color:
                    viewMode === "grid"
                      ? "var(--text-inverse)"
                      : "var(--text-secondary)",
                  borderColor: "var(--border-light)",
                }}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Agents Content */}
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {activeTab === "My agents" && (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {isLoading
                      ? Array.from({ length: 6 }, (_, index) => (
                        <SkeletonCard key={index} />
                      ))
                      : agents.map((agent, index) => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="relative rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-200"
                          style={{
                            background: "var(--surface-elevated)",
                            borderColor: "var(--border-light)",
                          }}
                        >
                          {/* Card Header */}
                          <div
                            className="h-1"
                            style={{ background: "var(--primary)" }}
                          />

                          <div className="p-6 flex flex-col h-full">
                            {/* Actions Menu */}
                            <div className="flex-1">
                              <div className="absolute top-4 right-4 flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    router.push(`/agents/edit/${agent.id}`)
                                  }
                                  className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <Edit className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>

                              {/* Agent Icon and Name */}
                              <div className="flex items-start gap-3 mb-4">
                                <div
                                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                  style={{
                                    background: "var(--primary)",
                                    color: "var(--text-inverse)",
                                  }}
                                >
                                  <Bot className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3
                                    className="font-semibold text-lg mb-1 truncate"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    {agent.name}
                                  </h3>
                                  <p
                                    className="text-sm line-clamp-2"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {agent.description}
                                  </p>
                                </div>
                              </div>

                              {/* Data Sources */}
                              <div className="mb-4">
                                <p
                                  className="text-xs font-medium mb-2"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Data Sources
                                </p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="px-2 py-1 text-xs rounded-md font-medium"
                                    style={{
                                      background: "var(--primary-light)",
                                      color: "var(--primary)",
                                    }}
                                  >
                                    {agent.data_source_type[0]}
                                  </span>
                                </div>
                              </div>

                              {/* Metadata */}
                              <div className="space-y-2 mb-6">
                                <div
                                  className="flex items-center gap-2 text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <Calendar className="h-4 w-4" />
                                  <span>{agent.created_at}</span>
                                </div>

                                <div
                                  className="flex items-center gap-2 text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <Bot className="h-4 w-4" />
                                  <span>{agent.model}</span>
                                </div>

                                <div
                                  className="flex items-center gap-2 text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <Database className="h-4 w-4" />
                                  <span>
                                    {agent.knowledgebases
                                      ? `Knowledge Bases: ${agent?.knowledgebases.length}`
                                      : agent.apiFeatures
                                        ? `API Features: ${agent.apiFeatures}`
                                        : "No data sources"}
                                  </span>
                                </div>

                                <div
                                  className="flex items-center gap-2 text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <User className="h-4 w-4" />
                                  <span>Created by {agent.created_at}</span>
                                </div>
                              </div>
                            </div>

                            {/* View Button */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                router.push(`/agents/${agent.id}`)
                              }
                              className="w-full py-2 px-4 rounded-md font-medium cursor-pointer"
                              style={{
                                background: "var(--surface-secondary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-light)",
                              }}
                            >
                              View
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {isLoading
                      ? Array.from({ length: 6 }, (_, index) => (
                        <SkeletonList key={index} />
                      ))
                      : agents.map((agent, index) => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="relative rounded-lg border overflow-hidden hover:shadow-md transition-shadow duration-200"
                          style={{
                            background: "var(--surface-elevated)",
                            borderColor: "var(--border-light)",
                          }}
                        >
                          {/* Card Header */}
                          <div
                            className="h-1"
                            style={{ background: "var(--primary)" }}
                          />

                          <div className="p-4">
                            {/* Actions Menu */}
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  router.push(`/agents/edit/${agent.id}`)
                                }
                                className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <Edit className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>

                            {/* Horizontal Layout for List */}
                            <div className="flex gap-4">
                              {/* Agent Icon */}
                              <div
                                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: "var(--primary)",
                                  color: "var(--text-inverse)",
                                }}
                              >
                                <Bot className="h-7 w-7" />
                              </div>

                              {/* Agent Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-2">
                                  <h3
                                    className="font-semibold text-lg"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    {agent.name}
                                  </h3>
                                  <span
                                    className="px-2 py-1 text-xs rounded-md font-medium"
                                    style={{
                                      background: "var(--primary-light)",
                                      color: "var(--primary)",
                                    }}
                                  >
                                    {agent.dataSources}
                                  </span>
                                </div>
                                <p
                                  className="text-sm mb-2 line-clamp-1"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {agent.description}
                                </p>
                                <div
                                  className="flex items-center gap-4 text-xs"
                                  style={{ color: "var(--text-tertiary)" }}
                                >
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{agent.created_at}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Bot className="h-3 w-3" />
                                    <span>{agent.model}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Database className="h-3 w-3" />
                                    <span>
                                      {agent.knowledgebases
                                        ? `KB: ${agent.knowledgebases.length}`
                                        : agent.apiFeatures
                                          ? `API: ${agent.apiFeatures}`
                                          : "No data"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{agent.created_by_name}</span>
                                  </div>
                                </div>
                              </div>

                              {/* View Button */}
                              <div className="flex-shrink-0 items-end flex">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    router.push(`/agents/${agent.id}`)
                                  }
                                  className="px-4 py-2 rounded-lg font-medium cursor-pointer"
                                  style={{
                                    background: "var(--surface-secondary)",
                                    color: "var(--text-primary)",
                                    border: "1px solid var(--border-light)",
                                  }}
                                >
                                  View
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </LayoutGroup>

        {/* Placeholder content for Favourite agents tab */}
        {activeTab === "Favourite agents" && (
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
              Favourite Agents
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Your favourite agents will be displayed here
            </p>
          </div>
        )}
      </motion.div>
    </motion.main>
  );
}
