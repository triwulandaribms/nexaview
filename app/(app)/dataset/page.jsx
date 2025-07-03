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

export default function Datasets() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  const datasets = [
    {
      id: 1,
      name: "Discussion-20250626_100327-Meeting Recording.mp4",
      description:
        "Meeting recording discussing project milestones and quarterly review",
      type: "report",
      createdAt: "26 Jun 2025",
      categories: ["financial analysis", "data sourcing", "import quota"],
      tags: ["company evaluation", "trade data"],
      lastEditedAt: "26 Jun 2025",
    },
    {
      id: 2,
      name: "PT BUKA.pdf",
      description: "Company profile and business overview document",
      type: "report",
      createdAt: "24 Jun 2025",
      categories: ["company profile", "stock exchange", "e-commerce"],
      tags: ["technology", "indonesia"],
      lastEditedAt: "24 Jun 2025",
    },
    {
      id: 3,
      name: "FinancialStatement-2024-Tahunan-BUKA.pdf",
      description: "Annual financial statement and reports for 2024",
      type: "report",
      createdAt: "24 Jun 2025",
      categories: ["financial statements", "subsidiaries", "assets"],
      tags: ["currency exchange", "liabilities"],
      lastEditedAt: "24 Jun 2025",
    },
    {
      id: 4,
      name: "FinancialStatement-2023-Tahunan-BUKA.pdf",
      description:
        "Annual financial statement and comprehensive business analysis for 2023",
      type: "report",
      createdAt: "24 Jun 2025",
      categories: [
        "financial statement",
        "subsidiary information",
        "short-term loans",
      ],
      tags: [
        "financial statements",
        "bank loans",
        "subsidiaries",
        "business acquisition",
      ],
      lastEditedAt: "24 Jun 2025",
    },
    {
      id: 5,
      name: "FinancialStatement-2025-I-GOTO.pdf",
      description: "Q1 2025 financial statement and quarterly business review",
      type: "report",
      createdAt: "24 Jun 2025",
      categories: [
        "financial statement",
        "unconsolidated report",
        "subsidiaries",
      ],
      tags: ["credit risk", "interim"],
      lastEditedAt: "24 Jun 2025",
    },
    {
      id: 6,
      name: "PT GoTo Gojek Tokopedia.pdf",
      description:
        "Company profile and digital platform technology services overview",
      type: "report",
      createdAt: "23 Jun 2025",
      categories: [
        "company profile",
        "digital platform",
        "technology services",
      ],
      tags: ["stock exchange", "indonesia"],
      lastEditedAt: "23 Jun 2025",
    },
    {
      id: 7,
      name: "FinancialStatement-2023-Tahunan-GOTO.pdf",
      description:
        "Complete annual financial statements and business operations report",
      type: "report",
      createdAt: "20 Jun 2025",
      categories: ["annual report", "subsidiaries", "financial statements"],
      tags: ["currency", "bank loans", "consolidation", "currency exchange"],
      lastEditedAt: "20 Jun 2025",
    },
    {
      id: 8,
      name: "FinancialStatement-2024-Tahunan-GOTO.pdf",
      description:
        "2024 annual financial statement with comprehensive business analysis",
      type: "report",
      createdAt: "20 Jun 2025",
      categories: ["financial statement", "subsidiaries", "debt management"],
      tags: ["consolidation", "currency exchange"],
      lastEditedAt: "20 Jun 2025",
    },
    {
      id: 9,
      name: "FinancialStatement-2022-Tahunan-GOTO.pdf",
      description: "2022 annual financial reports and subsidiary information",
      type: "report",
      createdAt: "13 Jun 2025",
      categories: ["financial statements", "subsidiaries", "employee benefits"],
      tags: ["bank loans", "interest rates"],
      lastEditedAt: "13 Jun 2025",
    },
  ];

  const allFilteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.categories.some((cat) =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (dataset.tags &&
        dataset.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const totalPages = Math.ceil(allFilteredDatasets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredDatasets = allFilteredDatasets.slice(startIndex, endIndex);

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

  // Skeleton placeholder component
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
                                  {dataset.name}
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
                                  {dataset.type}
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
                              <div className="flex flex-wrap gap-1">
                                {dataset.categories.map((category, idx) => (
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
                              </div>
                            </div>

                            {/* Tags */}
                            {dataset.tags && dataset.tags.length > 0 && (
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
                                <span>{dataset.createdAt}</span>
                              </div>
                            </div>
                          </div>

                          {/* View Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              router.push(`/dataset/${dataset.id}`)
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
                                  {dataset.name}
                                </h3>
                                <span
                                  className="px-2 py-1 text-xs rounded-md font-medium"
                                  style={{
                                    background: "var(--primary-light)",
                                    color: "var(--primary)",
                                  }}
                                >
                                  {dataset.type}
                                </span>
                                <div className="flex gap-1">
                                  {dataset.categories.map((category, idx) => (
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
                                {dataset.description}
                              </p>
                              <div
                                className="flex items-center gap-4 text-xs"
                                style={{ color: "var(--text-tertiary)" }}
                              >
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{dataset.createdAt}</span>
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
    </motion.main>
  );
}
