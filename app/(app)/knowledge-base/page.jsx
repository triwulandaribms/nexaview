"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  BookOpen,
  MoreHorizontal,
  List,
  Grid3X3,
  Calendar,
  Mail,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useRouter } from "next/navigation";

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const knowledgeBases = [
    {
      id: 1,
      name: "Meeting",
      email: "demo@ifabula.com",
      date: "26 Jun 2025",
      documentCount: 1,
      color: "#8BC34A",
    },
    {
      id: 2,
      name: "BUKA Finance",
      email: "demo@ifabula.com",
      date: "24 Jun 2025",
      documentCount: 4,
      color: "#FF5252",
    },
    {
      id: 3,
      name: "GoTo Finance",
      email: "demo@ifabula.com",
      date: "24 Jun 2025",
      documentCount: 4,
      color: "#E91E63",
    },
    {
      id: 4,
      name: "Hukum",
      email: "demo1@gmail.com",
      date: "16 May 2025",
      documentCount: 2,
      color: "#26A69A",
    },
    {
      id: 5,
      name: "Data CRM",
      email: "demo@ifabula.com",
      date: "05 May 2025",
      documentCount: 4,
      color: "#42A5F5",
    },
    {
      id: 6,
      name: "General Information",
      email: "demo@ifabula.com",
      date: "29 Apr 2025",
      documentCount: 3,
      color: "#9CCC65",
    },
  ];

  const filteredKnowledgeBases = knowledgeBases.filter(
    (kb) =>
      kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kb.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const HeaderSkeleton = () => (
    <div>
      {/* Title and New Button */}
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
      className="relative rounded-lg border overflow-hidden"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      {/* Border Top */}
      <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />

      <div className="p-6">
        {/* Actions Menu */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
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
      className="relative rounded-lg border overflow-hidden"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      {/* Border Top */}
      <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />

      <div className="px-6 pt-8 pb-6">
        {/* Actions Menu */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
        </div>

        {/* Horizontal Layout */}
        <div className="flex gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((i) => (
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
              Knowledge Base
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer"
            style={{
              background: "var(--primary)",
              color: "var(--text-inverse)",
            }}
            onClick={() => router.push("/knowledge-base/create")}
          >
            <Plus className="h-4 w-4" />
            New Knowledge Base
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
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Knowledge Base Content */}
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              // Grid View
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredKnowledgeBases.map((kb, index) => (
                  <motion.div
                    layout
                    key={kb.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    {/* Border Top */}
                    <div
                      className="h-1"
                      style={{ background: "var(--primary)" }}
                    />

                    {/* Actions Menu */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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

                    <div className="p-6">
                      {/* KB Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: "var(--primary)" }}
                        >
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className="font-semibold text-lg mb-1 truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {kb.name}
                          </h3>
                        </div>
                      </div>

                      {/* KB Details */}
                      <div className="space-y-2 mb-6">
                        <div
                          className="flex items-center gap-2 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Mail className="h-4 w-4" />
                          <span>{kb.email}</span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>{kb.date}</span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <FileText className="h-4 w-4" />
                          <span>{kb.documentCount} documents</span>
                        </div>
                      </div>

                      {/* View Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(`/knowledge-base/${kb.id}`)}
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
            ) : (
              // List View
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {filteredKnowledgeBases.map((kb, index) => (
                  <motion.div
                    layout
                    key={kb.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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

                    <div className="px-6 pt-8 pb-6">
                      {/* Actions Menu */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
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
                        {/* KB Icon */}
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--primary)" }}
                        >
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>

                        {/* KB Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4 mb-2">
                            <h3
                              className="font-semibold text-lg"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {kb.name}
                            </h3>
                          </div>
                          <div
                            className="flex items-center gap-4 text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{kb.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{kb.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{kb.documentCount} documents</span>
                            </div>
                          </div>
                        </div>

                        {/* View Button */}
                        <div className="flex-shrink-0 items-end flex">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              router.push(`/knowledge-base/${kb.id}`)
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
          </AnimatePresence>
        </LayoutGroup>

        {/* No Results Message */}
        {filteredKnowledgeBases.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-lg border text-center"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
              color: "var(--text-primary)",
            }}
          >
            <h3 className="text-lg font-medium mb-2">
              No knowledge bases found
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No knowledge bases found matching "{searchTerm}"
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {knowledgeBases.length === 0 && !searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-lg border text-center"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
              color: "var(--text-primary)",
            }}
          >
            <h3 className="text-lg font-medium mb-2">No knowledge bases yet</h3>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Create your first knowledge base to enable semantic search across
              your data.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 mx-auto rounded-lg font-medium cursor-pointer"
              style={{
                background: "var(--primary)",
                color: "var(--text-inverse)",
              }}
            >
              <Plus className="h-4 w-4" />
              New Knowledge Base
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}
