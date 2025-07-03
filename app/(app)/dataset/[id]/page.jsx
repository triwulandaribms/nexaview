"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Sparkles,
  Eye,
  Folder,
  Tag,
  Database,
  Download,
  Share2,
  MoreVertical,
  Clock,
  HardDrive,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

export default function DatasetDetail() {
  const router = useRouter();
  const params = useParams();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample dataset data (in a real app, this would come from an API based on the ID)
  const datasets = [
    {
      id: 1,
      name: "Discussion-20250626_100327-Meeting Recording.mp4",
      description:
        "Meeting recording discussing project milestones and quarterly review",
      type: "video",
      createdAt: "26 Jun 2025",
      categories: ["financial analysis", "data sourcing", "import quota"],
      tags: ["company evaluation", "trade data"],
      lastEditedAt: "26 Jun 2025",
      documentId: "d85abc4e93bc8c5e9bec2947",
      fileType: "video/mp4",
      fileSize: "21.87 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains important information related to report. It was uploaded on June 26, 2025 and categorized under report.",
    },
    {
      id: 2,
      name: "PT BUKA.pdf",
      description: "Company profile and business overview document",
      type: "document",
      createdAt: "24 Jun 2025",
      categories: ["company profile", "stock exchange", "e-commerce"],
      tags: ["technology", "indonesia"],
      lastEditedAt: "24 Jun 2025",
      documentId: "f95def6e83bc8c5e9bec2845",
      fileType: "application/pdf",
      fileSize: "2.1 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains company profile and business overview information. It was uploaded on June 24, 2025 and categorized under report.",
    },
    {
      id: 3,
      name: "FinancialStatement-2024-Tahunan-BUKA.pdf",
      description: "Annual financial statement and reports for 2024",
      type: "document",
      createdAt: "24 Jun 2025",
      categories: ["financial statements", "subsidiaries", "assets"],
      tags: ["currency exchange", "liabilities"],
      lastEditedAt: "24 Jun 2025",
      documentId: "g85def6e93bc8c5e9bec2946",
      fileType: "application/pdf",
      fileSize: "15.7 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains financial statements and subsidiary information. It was uploaded on June 24, 2025 and categorized under report.",
    },
    {
      id: 4,
      name: "FinancialStatement-2023-Tahunan-BUKA.pdf",
      description:
        "Annual financial statement and comprehensive business analysis for 2023",
      type: "document",
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
      documentId: "h95def6e83bc8c5e9bec2844",
      fileType: "application/pdf",
      fileSize: "18.2 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains comprehensive financial statements and business analysis for 2023. It includes subsidiary information and short-term loan details.",
    },
    {
      id: 5,
      name: "FinancialStatement-2025-I-GOTO.pdf",
      description: "Q1 2025 financial statement and quarterly business review",
      type: "document",
      createdAt: "24 Jun 2025",
      categories: [
        "financial statement",
        "unconsolidated report",
        "subsidiaries",
      ],
      tags: ["credit risk", "interim"],
      lastEditedAt: "24 Jun 2025",
      documentId: "i85def6e93bc8c5e9bec2843",
      fileType: "application/pdf",
      fileSize: "12.4 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains Q1 2025 financial statement and quarterly business review. It includes unconsolidated report and subsidiary information.",
    },
    {
      id: 6,
      name: "PT GoTo Gojek Tokopedia.pdf",
      description:
        "Company profile and digital platform technology services overview",
      type: "document",
      createdAt: "23 Jun 2025",
      categories: [
        "company profile",
        "digital platform",
        "technology services",
      ],
      tags: ["stock exchange", "indonesia"],
      lastEditedAt: "23 Jun 2025",
      documentId: "j85def6e93bc8c5e9bec2842",
      fileType: "application/pdf",
      fileSize: "5.8 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains company profile and digital platform technology services overview. It was uploaded on June 23, 2025 and categorized under report.",
    },
    {
      id: 7,
      name: "FinancialStatement-2023-Tahunan-GOTO.pdf",
      description:
        "Complete annual financial statements and business operations report",
      type: "document",
      createdAt: "20 Jun 2025",
      categories: ["annual report", "subsidiaries", "financial statements"],
      tags: ["currency", "bank loans", "consolidation", "currency exchange"],
      lastEditedAt: "20 Jun 2025",
      documentId: "k85def6e93bc8c5e9bec2841",
      fileType: "application/pdf",
      fileSize: "22.3 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains complete annual financial statements and business operations report for 2023. It includes comprehensive subsidiary information and currency exchange details.",
    },
    {
      id: 8,
      name: "FinancialStatement-2024-Tahunan-GOTO.pdf",
      description:
        "2024 annual financial statement with comprehensive business analysis",
      type: "document",
      createdAt: "20 Jun 2025",
      categories: ["financial statement", "subsidiaries", "debt management"],
      tags: ["consolidation", "currency exchange"],
      lastEditedAt: "20 Jun 2025",
      documentId: "l85def6e93bc8c5e9bec2840",
      fileType: "application/pdf",
      fileSize: "19.6 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains 2024 annual financial statement with comprehensive business analysis. It includes subsidiary information and debt management details.",
    },
    {
      id: 9,
      name: "FinancialStatement-2022-Tahunan-GOTO.pdf",
      description: "2022 annual financial reports and subsidiary information",
      type: "document",
      createdAt: "13 Jun 2025",
      categories: ["financial statements", "subsidiaries", "employee benefits"],
      tags: ["bank loans", "interest rates"],
      lastEditedAt: "13 Jun 2025",
      documentId: "m85def6e93bc8c5e9bec2839",
      fileType: "application/pdf",
      fileSize: "16.9 MB",
      uploadedBy: "Admin User",
      summary:
        "This document contains 2022 annual financial reports and subsidiary information. It includes employee benefits and bank loan details with interest rate information.",
    },
  ];

  const dataset =
    datasets.find((d) => d.id === parseInt(params.id)) || datasets[0];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    // Simulate API call
    setTimeout(() => {
      setAiSummary({
        keyPoints: [
          "Financial performance analysis for Q1 2025",
          "Strategic decisions regarding market expansion",
          "Resource allocation and budget planning",
          "Risk assessment and mitigation strategies",
        ],
        overview:
          "The meeting recording provides comprehensive insights into the company's quarterly performance and strategic planning initiatives. Key discussions covered financial metrics, operational challenges, and future growth opportunities.",
      });
      setIsGeneratingSummary(false);
    }, 2000);
  };

  // Skeleton placeholder components
  const SkeletonDetailPage = () => (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-32" />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Document Header */}
          <div
            className="p-8 rounded-xl border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-8 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-4" />
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }, (_, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border-light)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-5 h-5 bg-gray-200 animate-pulse rounded" />
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-20" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }, (_, j) => (
                    <div
                      key={j}
                      className="h-6 bg-gray-200 animate-pulse rounded w-16"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* File Information */}
          <div
            className="p-6 rounded-xl border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="h-6 bg-gray-200 animate-pulse rounded w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
                  </div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div
            className="p-6 rounded-xl border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 bg-gray-200 animate-pulse rounded" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Document Preview */}
          <div
            className="p-6 rounded-xl border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="h-6 bg-gray-200 animate-pulse rounded w-32 mb-4" />
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-xl bg-gray-200 animate-pulse mx-auto mb-4" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mx-auto mb-4" />
              <div className="h-12 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>

          {/* Quick Stats */}
          <div
            className="p-6 rounded-xl border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
                  </div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div
        className="p-8 rounded-xl border"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 bg-gray-200 animate-pulse rounded w-48" />
          </div>
          <div className="h-12 bg-gray-200 animate-pulse rounded w-32" />
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 animate-pulse rounded" />
          <div className="h-6 bg-gray-200 animate-pulse rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-72 mx-auto" />
        </div>
      </div>
    </div>
  );

  const getFileIcon = (fileType) => {
    if (fileType.includes("video")) return Database;
    if (fileType.includes("pdf")) return FileText;
    if (fileType.includes("image")) return FileText;
    return Folder;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "video":
        return "var(--primary)";
      case "document":
        return "var(--success)";
      case "image":
        return "var(--warning)";
      default:
        return "var(--text-secondary)";
    }
  };

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
        className=""
      >
        {/* Header */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Datasets
          </button>
        </motion.div>

        {/* Main Content */}
        {isLoading ? (
          <SkeletonDetailPage />
        ) : (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Document Information */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="space-y-8">
                  {/* Document Header */}
                  <div
                    className="p-8 rounded-xl border"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <div className="flex items-start gap-6">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "var(--surface-secondary)",
                          color: getTypeColor(dataset.type),
                        }}
                      >
                        {React.createElement(getFileIcon(dataset.fileType), {
                          className: "h-8 w-8",
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1
                          className="text-2xl font-bold mb-2"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {dataset.name}
                        </h1>
                        <p
                          className="text-base mb-4"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {dataset.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar
                              className="h-4 w-4"
                              style={{ color: "var(--text-tertiary)" }}
                            />
                            <span style={{ color: "var(--text-tertiary)" }}>
                              Uploaded {dataset.createdAt}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User
                              className="h-4 w-4"
                              style={{ color: "var(--text-tertiary)" }}
                            />
                            <span style={{ color: "var(--text-tertiary)" }}>
                              by {dataset.uploadedBy}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Categories */}
                    <div
                      className="p-6 rounded-xl border"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-light)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Folder
                          className="h-5 w-5"
                          style={{ color: "var(--primary)" }}
                        />
                        <h3
                          className="font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Categories
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dataset.categories.map((category, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-lg font-medium"
                            style={{
                              background: "var(--primary)",
                              color: "var(--text-inverse)",
                            }}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div
                      className="p-6 rounded-xl border"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-light)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Tag
                          className="h-5 w-5"
                          style={{ color: "var(--success)" }}
                        />
                        <h3
                          className="font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Tags
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dataset.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-lg"
                            style={{
                              background: "var(--surface-secondary)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* File Information */}
                  <div
                    className="p-6 rounded-xl border"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <h3
                      className="font-semibold mb-4"
                      style={{ color: "var(--text-primary)" }}
                    >
                      File Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Database
                            className="h-4 w-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            Document ID
                          </span>
                        </div>
                        <p
                          className="text-sm font-mono"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {dataset.documentId}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText
                            className="h-4 w-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            File Type
                          </span>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {dataset.fileType}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <HardDrive
                            className="h-4 w-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            File Size
                          </span>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {dataset.fileSize}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div
                    className="p-6 rounded-xl border"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FileText
                        className="h-5 w-5"
                        style={{ color: "var(--text-tertiary)" }}
                      />
                      <h3
                        className="font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Summary
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {dataset.summary}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Preview and Actions */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="space-y-6">
                  {/* Document Preview */}
                  <div
                    className="p-6 rounded-xl border"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <h3
                      className="font-semibold mb-4"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Document Preview
                    </h3>
                    <div className="text-center py-8">
                      <div
                        className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4"
                        style={{
                          background: "var(--surface-secondary)",
                          color: getTypeColor(dataset.type),
                        }}
                      >
                        {React.createElement(getFileIcon(dataset.fileType), {
                          className: "h-10 w-10",
                        })}
                      </div>
                      <p
                        className="text-sm mb-4"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {dataset.fileType} • {dataset.fileSize}
                      </p>
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 cursor-pointer"
                        style={{
                          background: "var(--primary)",
                          color: "var(--text-inverse)",
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        Preview Document
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div
                    className="p-6 rounded-xl border"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                    }}
                  >
                    <h3
                      className="font-semibold mb-4"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Folder
                            className="h-4 w-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Categories
                          </span>
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {dataset.categories.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag
                            className="h-4 w-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Tags
                          </span>
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {dataset.tags.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock
                            className="h-4 w-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Last Modified
                          </span>
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {dataset.lastEditedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* AI Summary Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12"
            >
              <div
                className="p-8 rounded-xl border"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border-light)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Sparkles
                      className="h-6 w-6"
                      style={{ color: "var(--primary)" }}
                    />
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      AI Document Analysis
                    </h2>
                  </div>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    style={{
                      background: "var(--primary)",
                      color: "var(--text-inverse)",
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {isGeneratingSummary ? "Analyzing..." : "Generate Analysis"}
                  </button>
                </div>

                {!aiSummary ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 opacity-50">
                      <Sparkles
                        className="w-full h-full"
                        style={{ color: "var(--text-secondary)" }}
                      />
                    </div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      AI Analysis Not Available
                    </h3>
                    <p
                      className="text-base mb-4"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Generate an AI-powered analysis to extract key insights
                      and summaries from this document.
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Our AI will analyze the document content and provide
                      comprehensive insights.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: "var(--text-primary)" }}
                      >
                        AI-Generated Summary
                      </h3>
                      <p
                        className="text-base leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {aiSummary.overview}
                      </p>
                    </div>

                    <div>
                      <h4
                        className="font-semibold mb-3"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Key Insights:
                      </h4>
                      <ul className="space-y-2">
                        {aiSummary.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span
                              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                              style={{ background: "var(--primary)" }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.main>
  );
}
