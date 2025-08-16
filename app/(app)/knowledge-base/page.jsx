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
  X,
  AlertTriangle,
  Check,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useRouter } from "next/navigation";
import { kbApi } from "@/app/lib/knowledgeBaseApi";
import { withTimeout } from "@/app/lib/http";
import Alert from "@/app/components/Alert";


export default function KnowledgeBase() {
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedKB, setSelectedKB] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // const [editOpen, setEditOpen] = useState(false);
  // const [saving, setSaving] = useState(false);
  // const [editForm, setEditForm] = useState({ name: "", email: "" });

  const router = useRouter();

  // Simulate loading state
  useEffect(() => {
    let mounted = true;

    (async () => {

      const { signal, cancel } = withTimeout(20000);
      setIsLoading(true);
      try {
        const { data } = await kbApi.all({ signal });
        if (mounted) setKnowledgeBases(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (mounted) setKnowledgeBases([]);
      } finally {
        if (mounted) setIsLoading(false);
        cancel();
      }
    })();

    return () => { mounted = false; };
  }, []);


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

  const openDelete = (kb) => {
    setSelectedKB(kb);
    setConfirmOpen(true);
  }

  const closeDelete = () => {
    if (!deleting) setConfirmOpen(false);
  }

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") closeDelete(); }
    if (confirmOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, deleting]);

  async function handleConfirmDelete() {
    if (!selectedKB?.id || deleting) return;

    const { signal, cancel } = withTimeout(20_000);
    setDeleting(true);
    setErrorMsg('');

    try {
      const res = await kbApi.remove(selectedKB.id, { signal });

      if (!res?.data?.success) {
        setErrorMsg(res?.data?.error || 'Failed to delete knowledge base');
        return;
      }

      // optimistic remove from list
      setKnowledgeBases((list) => list.filter((kb) => kb.id !== selectedKB.id));
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || 'Failed to delete knowledge base');
    } finally {
      cancel();
      setDeleting(false);
      setConfirmOpen(false);
    }
  }



  // function openEdit(kb) {

  //   setSelectedKB(kb);
  //   setEditForm({ name: kb.name || "", email: kb.created_by_name || "" });
  //   setEditOpen(true);
  // }
  function openEdit(kb) {
    if (!kb?.id) return;
    router.push(`/knowledge-base/update/${kb.id}`);
  }
  function closeEdit() { if (!saving) setEditOpen(false); }

  // useEffect(() => {
  //   function onKey(e) { if (e.key === "Escape") closeEdit(); }
  //   if (editOpen) window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, [editOpen, saving]);

  // async function handleSaveEdit(e) {
  //   e?.preventDefault?.();
  //   if (!editForm.name.trim()) return; // validasi sederhana
  //   setSaving(true);
  //   try {
  //  await new Promise(r => setTimeout(r, 800)); // simulasi
  //   } finally {
  //     setSaving(false);
  //     setEditOpen(false);
  //   }
  // }

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

      {errorMsg && (
        <Alert variant="error" onDismiss={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

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
                        onClick={() => openEdit(kb)}
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openDelete(kb)}
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
                            {kb?.name || ""}
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
                          <span>{kb?.created_by_name || ""}</span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>{kb?.created_at || ""}</span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <FileText className="h-4 w-4" />
                          <span>{kb?.docs_count || 0} documents</span>
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
                          onClick={() => openEdit(kb)}
                          className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDelete(kb)}
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
                              {kb?.name || ""}
                            </h3>
                          </div>
                          <div
                            className="flex items-center gap-4 text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{kb?.created_by_name || ""}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{kb?.created_at || ""}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{kb?.docs_count || ""} documents</span>
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
              onClick={() => router.push("/knowledge-base/create")}
            >
              <Plus className="h-4 w-4" />
              New Knowledge Base
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {confirmOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={closeDelete}
            />

            {/* Dialog */}
            <motion.div
              key="dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              aria-describedby="delete-desc"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            >
              <div
                className="w-full max-w-[28rem] sm:max-w-md rounded-2xl border shadow-xl"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border-light)",
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5">
                  <div className="p-2 rounded-xl" style={{ background: "var(--surface-secondary)" }}>
                    <AlertTriangle className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h2 id="delete-title" className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    Delete Knowledge Base?
                  </h2>
                </div>

                {/* Body */}
                <div className="px-5 pt-3 pb-5">
                  <p id="delete-desc" className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    This action cannot be undone. You will delete:
                  </p>

                  <div
                    className="mt-3 rounded-lg border px-4 py-3 text-sm"
                    style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", background: "var(--surface-secondary)" }}
                  >
                    <span className="font-medium">{selectedKB?.name}</span>
                    <div className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {selectedKB?.created_by_name} • {selectedKB?.created_at} • {selectedKB?.docs_count} documents
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    {/* Cancel */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeDelete}
                      disabled={deleting}
                      aria-label="Cancel"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--surface-elevated)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-light)",
                        outline: "none",
                        boxShadow: "0 1px 0 rgba(255,255,255,.04) inset, 0 6px 20px rgba(0,0,0,.04)",
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </motion.button>

                    {/* Delete */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmDelete}
                      disabled={deleting}
                      aria-label="Delete"
                      aria-busy={deleting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--primary)",
                        color: "var(--text-inverse)",
                        outline: "none",
                        boxShadow: "0 10px 24px rgba(0,0,0,.10)",
                      }}
                    >
                      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      <span>{deleting ? "Deleting…" : "Delete"}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* <AnimatePresence>
        {editOpen && (
          <>
            Overlay
            <motion.div
              key="overlay-edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={closeEdit}
            />

            Dialog
            <motion.div
              key="dialog-edit"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-title"
              aria-describedby="edit-desc"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            >
              <form
                onSubmit={handleSaveEdit}
                className="w-full max-w-[28rem] sm:max-w-md rounded-2xl border shadow-xl"
                style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
              >
                Header
                <div className="flex items-center gap-3 px-5 pt-5">
                  <div className="p-2 rounded-xl" style={{ background: "var(--surface-secondary)" }}>
                    <Edit className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h2 id="edit-title" className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    Edit Knowledge Base
                  </h2>
                </div>

                Body
                <div className="px-5 pt-3 pb-5">
                  <p id="edit-desc" className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                    Perbarui informasi di bawah ini.
                  </p>

                  Name
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                    Nama
                  </label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm(v => ({ ...v, name: e.target.value }))}
                    required
                    minLength={2}
                    className="w-full px-3 py-2 rounded-lg border mb-3 focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      "--tw-ring-color": "var(--primary)"
                    }}
                    placeholder="Nama KB"
                  />

                  Email
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(v => ({ ...v, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      "--tw-ring-color": "var(--primary)"
                    }}
                    placeholder="email@domain.com"
                  />

                  <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    Cancel
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeEdit}
                      disabled={saving}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--surface-elevated)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-light)",
                        boxShadow: "0 1px 0 rgba(255,255,255,.04) inset, 0 6px 20px rgba(0,0,0,.04)",
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span>Batal</span>
                    </motion.button>

                    Save
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={saving || !editForm.name.trim()}
                      aria-busy={saving}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--primary)",
                        color: "var(--text-inverse)",
                        boxShadow: "0 10px 24px rgba(0,0,0,.10)",
                      }}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      <span>{saving ? "Menyimpan..." : "Simpan"}</span>
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence> */}

    </motion.main>
  );
}
