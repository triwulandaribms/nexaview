"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Database,
  User,
  List,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useRouter } from "next/navigation";
import EditDatasetModal from "../../components/EditDatasetModal";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import { withTimeout } from "@/app/lib/http";
import { dsApi } from "@/app/lib/datasetBaseApi";

export default function Datasets() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedKB, setSelectedKB] = useState(null);
  const itemsPerPage = 6;

  const openDelete = (dataset) => {
    setSelectedKB({
      id: dataset.id,
      name: dataset.filename,
      createdAt: dataset.created_at,
      type: dataset?.type || "report",
      categories: dataset.category,
      tags: dataset.tags,
      processing_status: dataset.processing_status,
      file_size: dataset.file_size
    });
    setConfirmOpen(true);
  };

  const closeDelete = () => {
    if (!deleting) setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedKB?.id || deleting) return;

    const { signal, cancel } = withTimeout(20_000);
    setDeleting(true);
    setErrorMsg('');

    try {

      const res = await dsApi.remove(selectedKB.id, { signal });

      if (res?.success == false) {
        setErrorMsg(res.error || 'Gagal menghapus dataset');
        return;
      }

      setDatasets((prev) => prev.filter((d) => d.id !== selectedKB.id));
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal menghapus dataset');
    } finally {
      cancel();
      setDeleting(false);
    }
  };


  const handleEdit = (idx) => {
    router.push("/dataset/update/" + idx);
  };

  // 5️⃣ simpan perubahan
  // const handleSave = (updated) => {
  //   setDatasets((prev) => {
  //     const next = [...prev];
  //     next[editIndex] = updated;
  //     return next;
  //   });
  // };

  // const allFilteredDatasets = datasets?.filter(
  //   (dataset) =>
  //     dataset?.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     dataset?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     dataset?.category?.some((cat) =>
  //       cat?.toLowerCase().includes(searchTerm.toLowerCase())
  //     ) ||
  //     (dataset?.tags &&
  //       dataset?.tags.some((tag) =>
  //         tag.toLowerCase().includes(searchTerm.toLowerCase())
  //       ))
  // );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    const { signal, cancel } = withTimeout();

    (async () => {
      const res = await dsApi.list({ signal });

      if (!mounted) return;

      if (res?.success == false) setErrorMsg(res.error || 'Failed to load datasets');
      else setDatasets(res.data ?? []);

      setIsLoading(false);
    })().catch((e) => {
      if (mounted) {
        console.error(e);
        setErrorMsg(e.message || 'Failed to load datasets');
        setIsLoading(false);
      }
    });

    return () => { mounted = false; cancel(); };
  }, []);



  const SkeletonCard = () => (
    <div
      className="relative rounded-lg border overflow-hidden"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="h-1 bg-gray-200 animate-pulse" />
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-4 pt-4">
          <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="h-6 bg-gray-200 animate-pulse rounded mb-2" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
          </div>
        </div>
        <div className="mb-4">
          <div className="h-3 bg-gray-200 animate-pulse rounded mb-2 w-16" />
          <div className="h-6 bg-gray-200 animate-pulse rounded w-20" />
        </div>
        <div className="mb-4">
          <div className="h-3 bg-gray-200 animate-pulse rounded mb-2 w-20" />
          <div className="flex flex-wrap gap-1">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-16" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-20" />
          </div>
        </div>
        <div className="mb-4">
          <div className="h-3 bg-gray-200 animate-pulse rounded mb-2 w-12" />
          <div className="flex flex-wrap gap-1">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-14" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-18" />
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
        </div>
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div
      className="relative rounded-lg border overflow-hidden"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="h-1 bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-48" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-16" />
              <div className="flex gap-1">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-20" />
                <div className="h-6 bg-gray-200 animate-pulse rounded w-16" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
            <div className="flex items-center gap-4">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-20" />
            </div>
          </div>
          <div className="flex-shrink-0 items-end flex">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );

  const getDatasetIcon = (type) => {
    if (type.includes("Question-Answer")) return "💬";
    if (type.includes("structured")) return "📊";
    if (type.includes("unstructured")) return "📄";
    return "📁";
  };


  const lcSearch = searchTerm.toLowerCase();
  const allFilteredDatasets = (datasets || [])?.filter((ds) => {
    if (!ds) return false;
    const filenameMatch =
      typeof ds?.filename === 'string' &&
      ds.filename.toLowerCase().includes(lcSearch);

    const typeMatch =
      typeof ds?.file_type === 'string' &&
      ds.file_type.toLowerCase().includes(lcSearch);

    const categoryMatch =
      Array.isArray(ds?.category) &&
      ds.category
        .filter(Boolean)
        .some((cat) =>
          String(cat).toLowerCase().includes(lcSearch)
        );

    const tagMatch =
      Array.isArray(ds?.tags) &&
      ds.tags
        .filter(Boolean)
        .some((tag) =>
          String(tag).toLowerCase().includes(lcSearch)
        );

    return filenameMatch || typeMatch || categoryMatch || tagMatch;
  });

  const totalPages = Math.ceil(allFilteredDatasets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredDatasets = allFilteredDatasets.slice(startIndex, endIndex);



  function TagChip({ label, palette = "neutral" }) {
    const colors = {
      neutral: { bg: "var(--surface-secondary)", text: "var(--text-secondary)" },
      primary: { bg: "var(--primary-light)", text: "var(--primary)" },
    }[palette];

    return (
      <span
        className="max-w-xs truncate rounded-md px-2 py-[2px] text-xs font-medium"
        style={{ background: colors.bg, color: colors.text }}
        title={label}
      >
        {label}
      </span>
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
            <PageHeader
              title="Datasets"
              subtitle="Upload and manage your files. These can be used in knowledge bases or for fine-tuning models."
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dataset/create")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer"
            style={{
              background: "var(--primary)",
              color: "var(--text-inverse)",
            }}
          >
            <Plus className="h-4 w-4" />
            Add Document
          </motion.button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          {/* Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative max-w-md"
          >
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
              style={{ color: "var(--text-tertiary)" }}
            />
            <input
              type="text"
              placeholder="Search datasets..."
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
            transition={{ duration: 0.5, delay: 0.2 }}
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

        {/* Datasets Content */}
        <LayoutGroup>
          <AnimatePresence mode="wait">
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
                  : filteredDatasets.map((dataset, index) => (
                    <motion.div
                      key={dataset.id}
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
                              className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                              style={{ color: "var(--text-secondary)" }}
                              onClick={() => handleEdit(dataset?.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                              style={{ color: "var(--text-secondary)" }}
                              onClick={() => openDelete(dataset)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>

                          {/* Dataset Icon and Name */}
                          <div className="flex items-start gap-3 mb-4 pt-4 ">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                              style={{
                                background: "var(--primary)",
                                color: "var(--text-inverse)",
                              }}
                            >
                              <FileText className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3
                                className="font-semibold text-lg mb-1 truncate"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {dataset.filename}
                              </h3>
                              <p
                                className="text-sm line-clamp-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {dataset.description}
                              </p>
                            </div>
                          </div>

                          {/* Dataset Type */}
                          <div className="mb-4">
                            <p
                              className="text-xs font-medium mb-2"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Type
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                className="px-2 py-1 text-xs rounded-md font-medium"
                                style={{
                                  background: "var(--primary-light)",
                                  color: "var(--primary)",
                                }}
                              >
                                {dataset?.type || "report"}
                              </span>
                            </div>
                          </div>

                          {/* Categories */}
                          <div className="mb-4">
                            <p
                              className="text-xs font-medium mb-2"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Categories
                            </p>
                            {/* kategori + tag */}
                            <div className="flex flex-wrap gap-1.5">
                              {dataset.category?.map((cat) => (
                                <TagChip key={cat} label={cat} />
                              ))}

                              {dataset.tags?.map((tag) => (
                                <TagChip key={tag} label={tag} palette="primary" />
                              ))}
                            </div>

                          </div>

                          {/* Tags */}
                          {dataset?.tags && dataset?.tags.length > 0 && (
                            <div className="mb-4">
                              <p
                                className="text-xs font-medium mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Tags
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {dataset.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs rounded-md"
                                    style={{
                                      background: "var(--primary-light)",
                                      color: "var(--primary)",
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="space-y-2 mb-6">
                            <div
                              className="flex items-center gap-2 text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Calendar className="h-4 w-4" />
                              <span>{dataset?.updated_at || dataset?.created_at}</span>
                            </div>
                          </div>
                        </div>

                        {/* View Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            router.push(`/dataset/${dataset?.id}`)
                          }
                          className="w-full py-2 px-4 rounded-md font-medium cursor-pointer"
                          style={{
                            background: "var(--surface-secondary)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-light)",
                          }}
                        >
                          View Dataset
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
                  : filteredDatasets.map((dataset, index) => (
                    <motion.div
                      key={dataset.id}
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
                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                            style={{ color: "var(--text-secondary)" }}
                            onClick={() => handleEdit(dataset?.id)}

                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                            style={{ color: "var(--text-secondary)" }}
                            onClick={() => openDelete(dataset)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>

                        {/* Horizontal Layout for List */}
                        <div className="flex gap-4">
                          {/* Dataset Icon */}
                          <div
                            className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "var(--primary)",
                              color: "var(--text-inverse)",
                            }}
                          >
                            <FileText className="h-7 w-7" />
                          </div>

                          {/* Dataset Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-2">
                              <h3
                                className="font-semibold text-lg"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {dataset.filename}
                              </h3>
                              <span
                                className="px-2 py-1 text-xs rounded-md font-medium"
                                style={{
                                  background: "var(--primary-light)",
                                  color: "var(--primary)",
                                }}
                              >
                                {dataset?.type || "report"}
                              </span>
                              <div className="flex gap-1">
                                {dataset.category.map((category, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs rounded-md"
                                    style={{
                                      background: "var(--surface-secondary)",
                                      color: "var(--text-secondary)",
                                    }}
                                  >
                                    {category}
                                  </span>
                                ))}
                                {dataset.tags &&
                                  dataset.tags.map((tag, idx) => (
                                    <span
                                      key={`tag-${idx}`}
                                      className="px-2 py-1 text-xs rounded-md"
                                      style={{
                                        background: "var(--primary-light)",
                                        color: "var(--primary)",
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                              </div>
                            </div>
                            <p
                              className="text-sm mb-2 line-clamp-1"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {dataset.file_type}
                            </p>
                            <div
                              className="flex items-center gap-4 text-xs"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{dataset.created_at}</span>
                              </div>
                            </div>
                          </div>

                          {/* View Button */}
                          <div className="flex-shrink-0 items-end flex">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                router.push(`/dataset/${dataset.id}`)
                              }
                              className="px-4 py-2 rounded-lg font-medium cursor-pointer"
                              style={{
                                background: "var(--surface-secondary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-light)",
                              }}
                            >
                              View Dataset
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
        {allFilteredDatasets.length === 0 && searchTerm && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-md border text-center"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              No datasets found
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No datasets found matching "{searchTerm}"
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {datasets.length === 0 && !searchTerm && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-md border text-center"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              No datasets yet
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Upload your first dataset to get started with AI training and
              knowledge bases.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 mx-auto rounded-md font-medium transition-all duration-200 cursor-pointer hover:opacity-90"
              style={{
                background: "var(--primary)",
                color: "var(--text-inverse)",
              }}
            >
              <Plus className="h-4 w-4" />
              Add Document
            </motion.button>
          </motion.div>
        )}

        {/* Pagination */}
        {allFilteredDatasets.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-1 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer"
                    style={{
                      background:
                        currentPage === page ? "var(--primary)" : "transparent",
                      color:
                        currentPage === page
                          ? "var(--text-inverse)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
      {/* <EditDatasetModal
        open={editOpen}
        dataset={editIndex !== null ? datasets[editIndex] : null}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />; */}
      <DeleteConfirmDialog
        open={confirmOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        item={selectedKB}
      />

    </motion.main>
  );
}
