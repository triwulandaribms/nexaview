"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Database,
  Calendar,
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  Video,
  File,
  Image,
  X,
  Check,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Download,
  Upload
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { withTimeout } from "@/app/lib/http";
import { kbApi } from "@/app/lib/knowledgeBaseApi";

export default function KnowledgeBaseDetails() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [docEditOpen, setDocEditOpen] = useState(false);
  const [docSaving, setDocSaving] = useState(false);
  const [docIndex, setDocIndex] = useState(null);
  const [docForm, setDocForm] = useState({ name: "", category: "", tags: "" });
  const [docDeleteOpen, setDocDeleteOpen] = useState(false);
  const [docDeleting, setDocDeleting] = useState(false);
  const [docDeleteIndex, setDocDeleteIndex] = useState(null);
  const [docDeleteTarget, setDocDeleteTarget] = useState(null);
  const [docViewOpen, setDocViewOpen] = useState(false);
  const [docViewTarget, setDocViewTarget] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategories, setUploadCategories] = useState([]);
  const [uploadTags, setUploadTags] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [newTag, setNewTag] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [docCategories, setDocCategories] = useState([]);
  const [docTagsArr, setDocTagsArr] = useState([]);
  const [newDocCat, setNewDocCat] = useState("");
  const [newDocTag, setNewDocTag] = useState("");

  const MAX_SIZE = 25 * 1024 * 1024; // 25MB
  const ACCEPT = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/plain",
    "image/png", "image/jpeg", "image/webp",
    "video/mp4"
  ];

  function validateAndSet(file) {
    if (!file) return;
    if (!ACCEPT.includes(file.type)) {
      setErrorMsg("Tipe file tidak didukung.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrorMsg("Ukuran file melebihi 25MB.");
      return;
    }
    setUploadFile(file);
    setErrorMsg("");
  }

  function onBrowse(e) { validateAndSet(e.target.files?.[0]); }
  function onDrop(e) {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    validateAndSet(e.dataTransfer?.files?.[0]);
  }
  function onDragOver(e) { e.preventDefault(); setDragActive(true); }
  function onDragLeave(e) { e.preventDefault(); setDragActive(false); }

  function removeFile() { setUploadFile(null); setErrorMsg(""); }

  async function handleUpload() {
    if (!uploadFile) return;
    setUploading(true);
    setProgress(0);
    // TODO: ganti dengan API upload milikmu
    for (let p = 0; p <= 100; p += 12) {
      // simulasi progres
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 120));
      setProgress(p);
    }
    // Tambahkan ke list (optimistic)
    setKnowledgeBase(kb => ({
      ...kb,
      documentCount: kb.documentCount + 1,
      documents: [
        {
          id: Date.now(),
          name: uploadFile.name,
          category: uploadCategories.join(", "),
          lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          tags: uploadTags,
          type: uploadFile.type.startsWith("image") ? "image" :
            uploadFile.type.startsWith("video") ? "video" : "document",
        },
        ...kb.documents
      ]
    }));
    setUploading(false);
    setUploadOpen(false);
    setUploadFile(null);
    setUploadCategories([]); setUploadTags([]); setNewCat(""); setNewTag("");
  }


  function openDocView(doc) {
    setDocViewTarget(doc);
    setDocViewOpen(true);
  }
  function closeDocView() { setDocViewOpen(false); }

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") closeDocView(); }
    if (docViewOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [docViewOpen]);

  function openDocDelete(doc, index) {
    setDocDeleteIndex(index);
    setDocDeleteTarget(doc);
    setDocDeleteOpen(true);
  }
  function closeDocDelete() { if (!docDeleting) setDocDeleteOpen(false); }

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") closeDocDelete(); }
    if (docDeleteOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [docDeleteOpen, docDeleting]);

  async function handleConfirmDocDelete() {
    if (docDeleteIndex == null) return;
    setDocDeleting(true);
    try {
      // Optimistic UI: hapus dari state
      setKnowledgeBase(kb => {
        const docs = [...kb.documents];
        docs.splice(docDeleteIndex, 1);
        return { ...kb, documents: docs, documentCount: Math.max(0, kb.documentCount - 1) };
      });

      // TODO: panggil API hapus kamu, mis.:
      // await fetch(`/api/documents/${docDeleteTarget.id}`, { method: "DELETE" });
      await new Promise(r => setTimeout(r, 700));
      setDocDeleteOpen(false);
    } finally {
      setDocDeleting(false);
    }
  }

  function openDocEdit(doc, index) {
    setDocIndex(index);
    setDocForm({ name: doc?.name ?? "" });
    setDocForm({
      name: doc?.name ?? "",
      category: doc?.category ?? "",
      tags: Array.isArray(doc?.tags) ? doc.tags.join(", ") : (doc?.tags ?? "")
    });
    setDocEditOpen(true);
  }
  function closeDocEdit() { if (!docSaving) setDocEditOpen(false); }

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") closeDocEdit(); }
    if (docEditOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [docEditOpen, docSaving]);

  async function handleSaveDoc(e) {
    e.preventDefault();
    if (!docForm.name.trim()) return;
    setDocSaving(true);
    try {
      const tagsArr = docForm.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      // Update list dokumen di state
      setKnowledgeBase(kb => {
        const docs = [...kb.documents];
        docs[docIndex] = {
          ...docs[docIndex],
          name: docForm.name,
          category: docForm.category,
          tags: tagsArr
        };
        return { ...kb, documents: docs };
      });

      // TODO: panggil API PATCH kamu di sini
      // await fetch(`/api/documents/${id}`, { method:"PATCH", body: JSON.stringify({...}) })
      await new Promise(r => setTimeout(r, 600));
      setDocEditOpen(false);
    } finally {
      setDocSaving(false);
    }
  }


  const openEdit = () => {
    setEditForm({ name: knowledgeBase?.name ?? "", email: knowledgeBase?.email ?? "" });
    setEditOpen(true);
  }
  const closeEdit = () => { if (!saving) setEditOpen(false); }

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;
    setSaving(true);
    try {
      // TODO: ganti dengan API PATCH kamu
      // await fetch(`/api/knowledge-base/${knowledgeBase.id}`, { method: "PATCH", body: JSON.stringify(editForm) })
      await new Promise(r => setTimeout(r, 600));
      setKnowledgeBase(kb => ({ ...kb, name: editForm.name, email: editForm.email }));
    } finally {
      setSaving(false);
      setEditOpen(false);
    }
  }
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") closeEdit(); }
    if (editOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editOpen, saving]);

  // Mock data - in real app, fetch based on params.id
  const mockKnowledgeBases = {
    "e58cd5da-caeb-40a7-af32-42257d3faaac": {
      id: "e58cd5da-caeb-40a7-af32-42257d3faaac",
      name: "Meeting",
      email: "demo@ifabula.com",
      date: "26 Jun 2025",
      documentCount: 1,
      documents: [
        {
          id: 1,
          name: "Discussion-20250626_100327-Meeting Recording.mp4",
          category: "report, business",
          lastUpdated: "26 Jun 2025",
          tags: ["financial a...", "+4"],
          type: "video",
        },
      ],
    },

  };

  useEffect(() => {
    let mounted = true;
    const { signal, cancel } = withTimeout(20000);
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await kbApi.detail(params.id, { signal });
        if (mounted) setKnowledgeBase({
          ...data,
          email: data?.created_by_name || ""
        });
      } catch (e) {
        console.error(e);
        if (mounted) setKnowledgeBase(null);
      } finally {
        if (mounted) setIsLoading(false);
        cancel();
      }
    })();
    return () => { mounted = false; cancel(); };
  }, [params.id]);


  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-400 rounded" />
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-400 rounded" />
      </div>

      {/* Main Card Skeleton */}
      <div className="bg-white rounded-lg border border-[var(--border-light)] p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-400 rounded-xl" />
          <div className="space-y-2">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-400 rounded" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-400 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-400 rounded" />
        </div>
      </div>

      {/* Documents Section Skeleton */}
      <div className="bg-white rounded-lg border border-[var(--border-light)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-400 rounded" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-400 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-6 gap-4 items-center py-3">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-400 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-400 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-400 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-400 rounded" />
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-400 rounded" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-400 rounded" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-400 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getDocumentIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-[var(--text-secondary)]" />;
      case "document":
        return <File className="h-5 w-5 text-[var(--text-secondary)]" />;
      case "image":
        return <Image className="h-5 w-5 text-[var(--text-secondary)]" />;
      default:
        return <File className="h-5 w-5 text-[var(--text-secondary)]" />;
    }
  };

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
      >
        <SkeletonLoader />
      </motion.main>
    );
  }

  if (!knowledgeBase) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
      >
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Knowledge Base Not Found
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            The knowledge base you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className="text-[var(--primary)] hover:underline"
          >
            Go Back
          </button>
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
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Knowledge Base Details
          </button>
        </motion.div>

        {/* Main Knowledge Base Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg border border-[var(--border-light)] p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                  {knowledgeBase.name}
                </h1>
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                  <User className="h-4 w-4" />
                  <span>
                    Created by {knowledgeBase.email} on {knowledgeBase.created_at}
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openEdit}
              className="p-2 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
            >
              <Edit className="h-5 w-5 text-[var(--text-secondary)]" />
            </motion.button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Calendar className="h-4 w-4" />
              <span>Last Updated: {knowledgeBase.created_at}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <FileText className="h-4 w-4" />
              <span>Documents: {knowledgeBase.docs_count} total</span>
            </div>
          </div>
        </motion.div>

        {/* Documents Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg border border-[var(--border-light)] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Documents
            </h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary)]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Document
            </motion.button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)]">
                  <th className="text-left text-sm font-medium text-[var(--text-secondary)] pb-3">
                    #
                  </th>
                  <th className="text-left text-sm font-medium text-[var(--text-secondary)] pb-3">
                    DOCUMENT
                  </th>
                  <th className="text-left text-sm font-medium text-[var(--text-secondary)] pb-3">
                    CATEGORY
                  </th>
                  <th className="text-left text-sm font-medium text-[var(--text-secondary)] pb-3">
                    LAST UPDATED
                  </th>
                  <th className="text-left text-sm font-medium text-[var(--text-secondary)] pb-3">
                    TAGS
                  </th>
                  <th className="text-left text-sm font-medium text-[var(--text-secondary)] pb-3">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {knowledgeBase.documents.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="border-b border-[var(--border-light)] last:border-b-0"
                  >
                    <td className="py-4 text-[var(--text-secondary)]">
                      {index + 1}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--surface-secondary)] rounded-lg flex items-center justify-center">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <span className="text-[var(--text-primary)] font-medium">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-[var(--text-secondary)]">
                      {doc.category}
                    </td>
                    <td className="py-4 text-[var(--text-secondary)]">
                      {doc.lastUpdated}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-1 flex-wrap">
                        {doc.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-[var(--surface-secondary)] text-[var(--text-secondary)] rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDocView(doc)}
                          className="p-2 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                        >
                          <Eye className="h-4 w-4 text-[var(--text-secondary)]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDocEdit(doc, index)}
                          className="p-2 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                        >
                          <Edit className="h-4 w-4 text-[var(--text-secondary)]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDocDelete(doc, index)}
                          className="p-2 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-[var(--text-secondary)]" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-light)]">
            <div className="text-sm text-[var(--text-secondary)]">
              Showing {knowledgeBase.documents.length} of{" "}
              {knowledgeBase.documentCount} documents
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50">
                ←
              </button>
              <span className="px-3 py-1 bg-[var(--primary)] text-white rounded text-sm">
                1
              </span>
              <span className="px-3 py-1 text-sm text-[var(--text-secondary)]">
                of 1
              </span>
              <button className="px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50">
                →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {editOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay-edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={closeEdit}
            />

            {/* Dialog */}
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
                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5">
                  <div className="p-2 rounded-xl" style={{ background: "var(--surface-secondary)" }}>
                    <Edit className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h2 id="edit-title" className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    Edit Knowledge Base
                  </h2>
                </div>

                {/* Body */}
                <div className="px-5 pt-3 pb-5">
                  <p id="edit-desc" className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                    Perbarui informasi di bawah ini.
                  </p>

                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Nama</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm(v => ({ ...v, name: e.target.value }))}
                    required
                    minLength={2}
                    className="w-full px-3 py-2 rounded-lg border mb-3 focus:outline-none focus:ring-2"
                    style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)", color: "var(--text-primary)", "--tw-ring-color": "var(--primary)" }}
                    placeholder="Nama KB"
                  />

                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(v => ({ ...v, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)", color: "var(--text-primary)", "--tw-ring-color": "var(--primary)" }}
                    placeholder="email@domain.com"
                  />

                  {/* Actions (mobile-first, min 44px) */}
                  <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeEdit}
                      disabled={saving}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all disabled:opacity-60"
                      style={{ background: "var(--surface-elevated)", color: "var(--text-primary)", borderColor: "var(--border-light)", boxShadow: "0 1px 0 rgba(255,255,255,.04) inset, 0 6px 20px rgba(0,0,0,.04)" }}
                    >
                      <X className="h-4 w-4" />
                      <span>Batal</span>
                    </motion.button>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={saving || !editForm.name.trim()}
                      aria-busy={saving}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                      style={{ background: "var(--primary)", color: "var(--text-inverse)", boxShadow: "0 10px 24px rgba(0,0,0,.10)" }}
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

      </AnimatePresence>

      <AnimatePresence>
        {docEditOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay-doc-edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={closeDocEdit}
            />

            {/* Dialog */}
            <motion.div
              key="dialog-doc-edit"
              role="dialog"
              aria-modal="true"
              aria-labelledby="doc-edit-title"
              aria-describedby="doc-edit-desc"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            >
              <form onSubmit={handleSaveDoc}
                className="w-full max-w-[28rem] sm:max-w-md rounded-2xl border shadow-xl"
                style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>

                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5">
                  <div className="p-2 rounded-xl bg-[var(--surface-secondary)]">
                    <Edit className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    Edit Dokumen
                  </h2>
                </div>

                {/* Body */}
                <div className="px-5 pt-3 pb-5">

                  {/* NAMA */}
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                    Nama Dokumen
                  </label>
                  <input value={docForm.name}
                    onChange={e => setDocForm(v => ({ ...v, name: e.target.value }))}
                    required minLength={2}
                    className="w-full px-3 py-2 rounded-lg border mb-4 focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--surface-elevated)", borderColor: "var(--border-light)",
                      color: "var(--text-primary)", "--tw-ring-color": "var(--primary)"
                    }}
                    placeholder="Nama dokumen" />

                  {/* CATEGORIES (chip UI persis seperti upload) */}
                  <label className="block text-sm mb-2 text-[var(--text-secondary)]">Categories</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {docCategories.map((c, i) => (
                      <span key={i}
                        className="px-3 py-1 rounded-full text-sm bg-[var(--surface-secondary)] text-[var(--text-secondary)]">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-4">
                    <input value={newDocCat}
                      onChange={e => setNewDocCat(e.target.value)}
                      placeholder="Add category"
                      className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                      style={{
                        background: "var(--surface-elevated)", borderColor: "var(--border-light)",
                        color: "var(--text-primary)", "--tw-ring-color": "var(--primary)"
                      }} />
                    <button type="button"
                      onClick={() => { if (newDocCat.trim()) { setDocCategories([...docCategories, newDocCat.trim()]); setNewDocCat(""); } }}
                      className="px-4 py-2 rounded-lg font-medium bg-[var(--primary)] text-white">
                      Add
                    </button>
                  </div>

                  {/* TAGS (chip UI) */}
                  <label className="block text-sm mb-2 text-[var(--text-secondary)]">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {docTagsArr.map((t, i) => (
                      <span key={i}
                        className="px-3 py-1 rounded-full text-sm bg-[var(--primary)]/10 text-[var(--primary)]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newDocTag}
                      onChange={e => setNewDocTag(e.target.value)}
                      placeholder="Add tag"
                      className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                      style={{
                        background: "var(--surface-elevated)", borderColor: "var(--border-light)",
                        color: "var(--text-primary)", "--tw-ring-color": "var(--primary)"
                      }} />
                    <button type="button"
                      onClick={() => { if (newDocTag.trim()) { setDocTagsArr([...docTagsArr, newDocTag.trim()]); setNewDocTag(""); } }}
                      className="px-4 py-2 rounded-lg font-medium bg-[var(--primary)] text-white">
                      Add
                    </button>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    <motion.button type="button" onClick={closeDocEdit} disabled={docSaving}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px]
                   rounded-xl border font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--surface-elevated)", color: "var(--text-primary)",
                        borderColor: "var(--border-light)"
                      }}>
                      <X className="h-4 w-4" />
                      <span>Batal</span>
                    </motion.button>

                    <motion.button type="submit" disabled={docSaving || !docForm.name.trim()}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      aria-busy={docSaving}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px]
                   rounded-xl font-medium transition-all disabled:opacity-60"
                      style={{ background: "var(--primary)", color: "var(--text-inverse)" }}>
                      {docSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      <span>{docSaving ? "Menyimpan…" : "Simpan"}</span>
                    </motion.button>
                  </div>
                </div>
              </form>

            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {docDeleteOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay-doc-del"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={closeDocDelete}
            />

            {/* Dialog */}
            <motion.div
              key="dialog-doc-del"
              role="dialog"
              aria-modal="true"
              aria-labelledby="doc-del-title"
              aria-describedby="doc-del-desc"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            >
              <div
                className="w-full max-w-[28rem] sm:max-w-md rounded-2xl border shadow-xl"
                style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5">
                  <div className="p-2 rounded-xl" style={{ background: "var(--surface-secondary)" }}>
                    <AlertTriangle className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h2 id="doc-del-title" className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    Hapus Dokumen?
                  </h2>
                </div>

                {/* Body */}
                <div className="px-5 pt-3 pb-5">
                  <p id="doc-del-desc" className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Aksi ini tidak dapat dibatalkan. Kamu akan menghapus:
                  </p>
                  <div
                    className="mt-3 rounded-lg border px-4 py-3 text-sm"
                    style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", background: "var(--surface-secondary)" }}
                  >
                    <span className="font-medium">{docDeleteTarget?.name}</span>
                    <div className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {docDeleteTarget?.category} • {docDeleteTarget?.lastUpdated}
                    </div>
                  </div>

                  {/* Actions (mobile-first, tap area 44px) */}
                  <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeDocDelete}
                      disabled={docDeleting}
                      aria-label="Batal"
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

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmDocDelete}
                      disabled={docDeleting}
                      aria-label="Hapus"
                      aria-busy={docDeleting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                      style={{ background: "var(--primary)", color: "var(--text-inverse)", boxShadow: "0 10px 24px rgba(0,0,0,.10)" }}
                    >
                      {docDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      <span>{docDeleting ? "Menghapus..." : "Hapus"}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {docViewOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay-doc-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={closeDocView}
            />

            {/* Dialog */}
            <motion.div
              key="dialog-doc-view"
              role="dialog"
              aria-modal="true"
              aria-labelledby="doc-view-title"
              aria-describedby="doc-view-desc"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            >
              <div
                className="w-full max-w-[32rem] sm:max-w-lg rounded-2xl border shadow-xl overflow-hidden"
                style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
              >
                {/* Header */}
                <div className="flex items-start gap-3 px-5 pt-5">
                  <div className="p-2 rounded-xl" style={{ background: "var(--surface-secondary)" }}>
                    <Eye className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="min-w-0">
                    <h2 id="doc-view-title" className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {docViewTarget?.name}
                    </h2>
                    <p id="doc-view-desc" className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                      Pratinjau & detail dokumen
                    </p>
                  </div>
                </div>

                {/* Preview */}
                <div className="px-5 pt-4">
                  <div
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: "var(--border-light)", background: "var(--surface-secondary)" }}
                  >
                    <div className="aspect-video w-full flex items-center justify-center">
                      {/* Placeholder preview berdasarkan type */}
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(docViewTarget?.type)}
                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          {docViewTarget?.type === "image" ? "Image preview (demo)"
                            : docViewTarget?.type === "video" ? "Video preview (demo)"
                              : "Document preview (demo)"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="px-5 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">Kategori:</span>
                      <span className="font-medium text-[var(--text-primary)]">{docViewTarget?.category || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">Terakhir diperbarui:</span>
                      <span className="font-medium text-[var(--text-primary)]">{docViewTarget?.lastUpdated || "-"}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(docViewTarget?.tags ?? []).map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-[var(--surface-secondary)] text-[var(--text-secondary)] rounded text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions (mobile-first, min tap 44px) */}
                <div className="px-5 py-5">
                  <div className="grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeDocView}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all"
                      style={{ background: "var(--surface-elevated)", color: "var(--text-primary)", borderColor: "var(--border-light)" }}
                    >
                      <X className="h-4 w-4" />
                      <span>Tutup</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      // TODO: ganti jadi link asli jika ada URL dokumen
                      onClick={() => alert("Demo: Buka dokumen")}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all"
                      style={{ background: "var(--primary)", color: "var(--text-inverse)" }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Lihat</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      // TODO: ganti jadi download asli jika ada URL file
                      onClick={() => alert("Demo: Download dokumen")}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all"
                      style={{ background: "var(--surface-elevated)", color: "var(--text-primary)", borderColor: "var(--border-light)" }}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {uploadOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay-upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => !uploading && setUploadOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              key="modal-upload"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              role="dialog" aria-modal="true" aria-labelledby="upload-title"
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            >
              <div className="w-full max-w-2xl bg-[var(--surface-elevated)] rounded-2xl shadow-2xl overflow-hidden focus:outline-none">
                {/* Header */}
                <div className="px-6 pt-6 pb-3 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--surface-secondary)]">
                    <Upload className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h2 id="upload-title" className="text-lg font-semibold text-[var(--text-primary)]">
                    Upload Document
                  </h2>
                </div>

                {/* Body */}
                <div className="px-6 pb-6">
                  {/* Dropzone */}
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => !uploading && document.getElementById("uploadInput")?.click()}
                    className={[
                      "rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
                      "outline-none focus:ring-2 focus:ring-[var(--primary)]",
                      dragActive ? "bg-[var(--primary)]/5 border-[var(--primary)]" : "bg-[var(--surface-secondary)] border-[var(--border-light)]"
                    ].join(" ")}
                    tabIndex={0}
                    role="button"
                    aria-label="Drop files here or click to browse"
                  >
                    <input
                      id="uploadInput"
                      type="file"
                      accept={ACCEPT.join(",")}
                      className="hidden"
                      onChange={onBrowse}
                      disabled={uploading}
                    />
                    {!uploadFile ? (
                      <div className="text-[var(--text-secondary)]">
                        <Upload className="mx-auto mb-2 h-6 w-6 text-[var(--primary)]" />
                        <p className="font-medium">Drag & drop file di sini atau klik untuk pilih</p>
                        <p className="text-xs mt-1">PDF, DOCX, PPTX, XLSX, TXT, JPG/PNG/WEBP, MP4 · maks 25MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">{uploadFile.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(); }}
                          disabled={uploading}
                          className="px-3 py-1.5 rounded-lg border text-sm"
                          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {errorMsg && (
                    <div className="mt-3 text-sm text-red-600">{errorMsg}</div>
                  )}

                  {/* Categories */}
                  <div className="mt-5">
                    <label className="block text-sm mb-2 text-[var(--text-secondary)]">Categories</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {uploadCategories.map((c, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-sm bg-[var(--surface-secondary)] text-[var(--text-secondary)]">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        placeholder="Add category"
                        className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{ borderColor: "var(--border-light)", "--tw-ring-color": "var(--primary)", background: "var(--surface-elevated)", color: "var(--text-primary)" }}
                      />
                      <button
                        onClick={() => { if (newCat.trim()) { setUploadCategories([...uploadCategories, newCat.trim()]); setNewCat(""); } }}
                        className="px-4 py-2 rounded-lg font-medium bg-[var(--primary)] text-white"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4">
                    <label className="block text-sm mb-2 text-[var(--text-secondary)]">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {uploadTags.map((t, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-sm bg-[var(--primary)]/10 text-[var(--primary)]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{ borderColor: "var(--border-light)", "--tw-ring-color": "var(--primary)", background: "var(--surface-elevated)", color: "var(--text-primary)" }}
                      />
                      <button
                        onClick={() => { if (newTag.trim()) { setUploadTags([...uploadTags, newTag.trim()]); setNewTag(""); } }}
                        className="px-4 py-2 rounded-lg font-medium bg-[var(--primary)] text-white"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  {uploading && (
                    <div className="mt-5">
                      <div className="h-2 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--primary)] transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-2 text-sm text-[var(--text-secondary)]">{progress}%</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    <button
                      onClick={() => !uploading && setUploadOpen(false)}
                      disabled={uploading}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 min-h-[44px] rounded-xl border font-medium disabled:opacity-60"
                      style={{ borderColor: "var(--border-light)", background: "var(--surface-elevated)", color: "var(--text-primary)" }}
                    >
                      Batal
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpload}
                      disabled={!uploadFile || uploading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium disabled:opacity-60"
                      style={{ background: "var(--primary)", color: "var(--text-inverse)", boxShadow: "0 10px 24px rgba(0,0,0,.10)" }}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      <span>{uploading ? "Uploading..." : "Upload"}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.main>
  );
}
