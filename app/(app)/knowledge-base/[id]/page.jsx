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
import { dsApi } from "@/app/lib/datasetBaseApi";

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
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // id dataset terpilih
  const [query, setQuery] = useState(""); // pencarian/filter

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
    if (selectedIds.length === 0) return;
    setUploading(true);

    const pickType = (mime = "") => {
      if (mime.startsWith("image/")) return "image";
      if (mime.startsWith("video/")) return "video";
      if (mime.startsWith("audio/")) return "audio";
      if (mime.startsWith("text/")) return "text";
      return "document";
    };

    const normalizeDoc = (d = {}) => ({
      id: d.id,
      file_name: d.file_name || d.filename || d.name || "(untitled)",
      category: Array.isArray(d.category) ? d.category.join(", ") : (d.category ?? "-"),
      updated_at: d.updated_at
        ? d.updated_at
        : d.lastUpdated
          ? d.lastUpdated
          : (d.created_at || d.createdAt)
            ? new Date(d.created_at || d.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : "-",
      tags: Array.isArray(d.tags)
        ? d.tags
        : typeof d.tags === "string"
          ? d.tags.split(",").map(t => t.trim()).filter(Boolean)
          : [],
      type: d.type || pickType(String(d.file_type || "")),
    });

    const chosen = selectedIds
      .map(id => availableDatasets.find(d => d.id === id))
      .filter(Boolean);

    const rows = chosen.map(d =>
      normalizeDoc({
        ...d,
        updated_at: new Date(d.updated_at || d.created_at).toLocaleDateString(
          "en-GB",
          { day: "2-digit", month: "short", year: "numeric" }
        ),
      })
    );

    try {
      const existingIds = (knowledgeBase?.documents || [])
        .map(d => (typeof d === "string" ? d : d?.id))
        .filter(Boolean);
      const mergedIds = Array.from(new Set([...existingIds, ...selectedIds]));

      const payload = {
        name: knowledgeBase?.name || "",
        roles: knowledgeBase?.roles || [],
        documents: mergedIds,
      };

      const controller = new AbortController();
      const { signal } = controller;

      const { data, message } = await kbApi.update(knowledgeBase?.id, payload, { signal });

      setKnowledgeBase(kb => {
        const existing = Array.isArray(kb.documents) ? kb.documents : [];
        const normalizedExisting = existing.map(normalizeDoc);

        const byId = new Map();
        [...rows, ...normalizedExisting].forEach(item => {
          if (item?.id && !byId.has(item.id)) byId.set(item.id, item);
        });
        const nextDocs = Array.from(byId.values());

        return {
          ...kb,
          documents: nextDocs,
          documentCount: nextDocs.length,
          docs_count: nextDocs.length,
        };
      });
    } catch (err) {
      console.error("Failed to update KB:", err);
    } finally {
      setUploading(false);
      setUploadOpen(false);
      setSelectedIds([]);
      setQuery("");
    }
  }

  function openDocView(doc) {

    router.push("/dataset/" + doc.id);
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
    function onKey(e) {
      if (e.key === "Escape") closeDocDelete();
    }
    if (docDeleteOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [docDeleteOpen, docDeleting]);

  async function handleConfirmDocDelete() {
    if (docDeleteIndex == null) return;
    setDocDeleting(true);

    const prevKB = knowledgeBase;

    try {
      let removedDocId = null;
      setKnowledgeBase(kb => {
        const docs = Array.isArray(kb.documents) ? [...kb.documents] : [];
        removedDocId = docs[docDeleteIndex]?.id ?? null;
        docs.splice(docDeleteIndex, 1);
        return {
          ...kb,
          documents: docs,
          documentCount: Math.max(0, (kb.documentCount || 0) - 1),
          docs_count: Math.max(0, (kb.docs_count || 0) - 1),
        };
      });

      const remainingIds = (prevKB?.documents || [])
        .filter((_, idx) => idx !== docDeleteIndex)
        .map(d => d.id);

      const payload = {
        name: prevKB?.name || "",
        roles: prevKB?.roles || [],
        documents: remainingIds,
      };

      const controller = new AbortController();
      const { signal } = controller;
      const { data, message } = await kbApi.update(prevKB?.id, payload, { signal });

      setDocDeleteOpen(false);
    } catch (err) {
      console.error("Failed to delete document from KB:", err);
      setKnowledgeBase(prevKB);
    } finally {
      setDocDeleting(false);
    }
  }


  function openDocEdit(doc, index) {
    setDocIndex(index);
    setDocForm({ name: doc?.file_name ?? "" });
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
          file_name: docForm.name,
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
    router.push("update/" + knowledgeBase.id);

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


  useEffect(() => {
    if (!uploadOpen) return;
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const { data } = await dsApi.list({ signal });

        // 1) Normalisasi sumber data API → array dokumen
        const apiDocsRaw = data?.documents ?? data?.items ?? data ?? [];
        const apiDocs = Array.isArray(apiDocsRaw) ? apiDocsRaw : [];

        // 2) Ambil dokumen dari KB (aman saat null/undefined)
        const kbDocs = Array.isArray(knowledgeBase?.documents) ? knowledgeBase.documents : [];

        // 3) Kalau KB kosong → tampilkan semua
        if (kbDocs.length === 0) {
          console.log(`API docs: ${apiDocs.length} (KB kosong, tampilkan semua)`);
          setAvailableDatasets(apiDocs);
          return;
        }

        // 4) Normalisasi ID ke string untuk menghindari mismatch tipe
        const toKey = v => (v === undefined || v === null ? "" : String(v));
        const existingIds = new Set(kbDocs.map(d => toKey(d.id)).filter(Boolean));

        // 5) Filter: buang yang ID-nya sudah ada di KB
        const filtered = apiDocs.filter(d => !existingIds.has(toKey(d.id)));

        // 6) Log bantu debug
        console.table({
          api_docs: apiDocs.length,
          kb_docs: kbDocs.length,
          removed: apiDocs.length - filtered.length,
          shown: filtered.length,
        });

        // 7) (opsional) fallback: kalau filtered kosong padahal apiDocs ada,
        // kemungkinan ID tidak konsisten → coba longgar pakai filename juga
        const result =
          filtered.length === 0 && apiDocs.length > 0
            ? apiDocs.filter(d => {
              const name = d.filename || d.file_name;
              return !kbDocs.some(k => (k.filename || k.file_name) === name);
            })
            : filtered;

        setAvailableDatasets(result);
      } catch (e) {
        console.error(e);
        setAvailableDatasets([]);
      }
    })();

    return () => controller.abort();
  }, [uploadOpen, knowledgeBase?.documents]);



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
                {knowledgeBase?.documents?.map((doc, index) => (
                  <motion.tr
                    key={doc?.id}
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
                          {getDocumentIcon(doc?.type)}
                        </div>
                        <span
                          className="text-[var(--text-primary)] font-medium max-w-[240px] truncate block"
                          title={doc?.file_name || doc?.filename || doc?.name || "(untitled)"}
                        >
                          {doc?.file_name || doc?.filename || doc?.name || "(untitled)"}
                        </span>

                      </div>
                    </td>
                    <td className="py-4 text-[var(--text-secondary)]">
                      {Array.isArray(doc?.category)
                        ? doc.category.length > 3
                          ? `${doc.category.slice(0, 3).join(', ')} …(+${doc.category.length - 3})`
                          : doc.category.join(', ')
                        : doc?.category}
                    </td>
                    <td className="py-4 text-[var(--text-secondary)]">
                      {doc?.updated_at}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-1 flex-wrap">
                        {(() => {
                          const tags = Array.isArray(doc?.tags) ? doc.tags : [];
                          const shown = tags.slice(0, 2);
                          const rest = tags.length > 2 ? tags.slice(2) : [];
                          return (
                            <>
                              {shown.map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-[var(--surface-secondary)] text-[var(--text-secondary)] rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {rest.length > 0 && (
                                <span
                                  className="px-2 py-1 bg-[var(--surface-secondary)] text-[var(--text-secondary)] rounded text-xs"
                                  title={rest.join(", ")}
                                >
                                  … (+{rest.length})
                                </span>
                              )}
                            </>
                          );
                        })()}
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
                        {/* <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDocEdit(doc, index)}
                          className="p-2 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                        >
                          <Edit className="h-4 w-4 text-[var(--text-secondary)]" />
                        </motion.button> */}
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
                      {docViewTarget?.file_name}
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
                      <span className="font-medium text-[var(--text-primary)]">{docViewTarget?.updated_at || "-"}</span>
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
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 backdrop-blur-md"
            >
              <div
                className="
      w-full max-w-2xl
      bg-[var(--surface-elevated)]
      rounded-2xl shadow-2xl focus:outline-none
      max-h-[85vh] flex flex-col
      overflow-hidden
    "
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* Header → STICKY */}
                <div className="px-4 sm:px-6 pt-5 pb-3 flex items-center gap-3 sticky top-0 z-10 bg-[var(--surface-elevated)]">
                  <div className="p-2 rounded-xl bg-[var(--surface-secondary)]">
                    <Upload className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h2 id="upload-title" className="text-lg font-semibold text-[var(--text-primary)]">
                    Upload Document
                  </h2>
                </div>

                {/* Body → SCROLL UTAMA */}
                <div
                  className="flex-1 min-h-0 px-4 sm:px-6 pb-5 overflow-y-auto"
                  style={{ scrollbarGutter: "stable" }}
                >
                  {/* Search */}
                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-[var(--text-secondary)]">Search</label>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type to filter documents…"
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: "var(--border-light)", "--tw-ring-color": "var(--primary)", background: "var(--surface-elevated)", color: "var(--text-primary)" }}
                    />
                  </div>

                  {/* List dokumen → HAPUS max-h & overflow di sini */}
                  <div className="rounded-xl border"
                    style={{ borderColor: "var(--border-light)", background: "var(--surface-secondary)" }}>
                    <div className="divide-y" style={{ divideColor: "var(--border-light)" }}>
                      {availableDatasets
                        .filter(d =>
                          !query.trim()
                          || String(d.filename || d.name || "").toLowerCase().includes(query.toLowerCase())
                          || String(d.file_type || "").toLowerCase().includes(query.toLowerCase())
                        )
                        .map((d) => {
                          const id = d.id;
                          const checked = selectedIds.includes(id);
                          return (
                            <label key={id}
                              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[var(--surface-elevated)]">
                              <input
                                type="checkbox"
                                className="h-5 w-5"
                                checked={checked}
                                onChange={(e) => {
                                  setSelectedIds(prev =>
                                    e.target.checked ? [...prev, id] : prev.filter(x => x !== id)
                                  );
                                }}
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-[var(--text-primary)] truncate">
                                  {d.filename || d.name || "(untitled)"}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] truncate">
                                  {d.file_type} · {(d.file_size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                              <span className="ml-auto text-xs text-[var(--text-tertiary)]">
                                {new Date(d.updated_at || d.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              </span>
                            </label>
                          );
                        })}
                      {availableDatasets.length === 0 && (
                        <div className="p-4 text-sm text-[var(--text-secondary)]">No data</div>
                      )}
                    </div>
                  </div>

                  {/* Chips pilihan */}
                  {selectedIds.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedIds.map(id => {
                        const d = availableDatasets.find(x => x.id === id);
                        return (
                          <span key={id} className="px-3 py-1 rounded-full text-sm bg-[var(--primary)]/10 text-[var(--primary)]">
                            {(d?.filename || d?.name || id).toString().slice(0, 28)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer (tetap fixed di bawah card) */}
                <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setUploadOpen(false)}
                    disabled={uploading}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 min-h-[44px] rounded-xl border font-medium disabled:opacity-60"
                    style={{ borderColor: "var(--border-light)", background: "var(--surface-elevated)", color: "var(--text-primary)" }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    disabled={selectedIds.length === 0 || uploading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium disabled:opacity-60"
                    style={{ background: "var(--primary)", color: "var(--text-inverse)", boxShadow: "0 10px 24px rgba(0,0,0,.10)" }}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    <span>{uploading ? "Saving..." : "Select"}</span>
                  </motion.button>
                </div>
              </div>
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
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-md"
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
                    Delete Document?
                  </h2>
                </div>

                {/* Body */}
                <div className="px-5 pt-3 pb-5">
                  <p id="doc-del-desc" className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    This action cannot be undone. You are about to delete:
                  </p>
                  <div
                    className="mt-3 rounded-lg border px-4 py-3 text-sm"
                    style={{
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      background: "var(--surface-secondary)",
                    }}
                  >
                    <span className="font-medium break-words">{docDeleteTarget?.file_name || docDeleteTarget?.filename}</span>
                    <div className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {Array.isArray(docDeleteTarget?.category)
                        ? docDeleteTarget.category.join(', ')
                        : docDeleteTarget?.category}
                      {' • '}
                      {docDeleteTarget?.updated_at}
                    </div>
                  </div>

                  {/* Actions (mobile-first, tap area 44px) */}
                  <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeDocDelete}
                      disabled={docDeleting}
                      aria-label="Cancel"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--surface-elevated)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-light)",
                        boxShadow: "0 1px 0 rgba(255,255,255,.04) inset, 0 6px 20px rgba(0,0,0,.04)",
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmDocDelete}
                      disabled={docDeleting}
                      aria-label="Delete"
                      aria-busy={docDeleting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--primary)",
                        color: "var(--text-inverse)",
                        boxShadow: "0 10px 24px rgba(0,0,0,.10)",
                      }}
                    >
                      {docDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span>{docDeleting ? "Deleting..." : "Delete"}</span>
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
