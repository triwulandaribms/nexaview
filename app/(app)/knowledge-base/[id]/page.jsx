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
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function KnowledgeBaseDetails() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [knowledgeBase, setKnowledgeBase] = useState(null);

  // Mock data - in real app, fetch based on params.id
  const mockKnowledgeBases = {
    1: {
      id: 1,
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
    2: {
      id: 2,
      name: "BUKA Finance",
      email: "demo@ifabula.com",
      date: "24 Jun 2025",
      documentCount: 4,
      documents: [
        {
          id: 1,
          name: "Financial Report Q1 2025.pdf",
          category: "finance, report",
          lastUpdated: "24 Jun 2025",
          tags: ["quarterly", "finance"],
          type: "document",
        },
        {
          id: 2,
          name: "Budget Analysis.xlsx",
          category: "finance, analysis",
          lastUpdated: "24 Jun 2025",
          tags: ["budget", "analysis"],
          type: "document",
        },
        {
          id: 3,
          name: "Investment Strategy.pptx",
          category: "finance, strategy",
          lastUpdated: "23 Jun 2025",
          tags: ["investment", "strategy"],
          type: "document",
        },
        {
          id: 4,
          name: "Market Research.pdf",
          category: "finance, research",
          lastUpdated: "22 Jun 2025",
          tags: ["market", "research"],
          type: "document",
        },
      ],
    },
    3: {
      id: 3,
      name: "GoTo Finance",
      email: "demo@ifabula.com",
      date: "24 Jun 2025",
      documentCount: 4,
      documents: [
        {
          id: 1,
          name: "GoTo Financial Overview.pdf",
          category: "finance, overview",
          lastUpdated: "24 Jun 2025",
          tags: ["overview", "finance"],
          type: "document",
        },
        {
          id: 2,
          name: "Revenue Analysis Q2.xlsx",
          category: "finance, analysis",
          lastUpdated: "23 Jun 2025",
          tags: ["revenue", "Q2"],
          type: "document",
        },
        {
          id: 3,
          name: "Budget Forecast.pdf",
          category: "finance, forecast",
          lastUpdated: "22 Jun 2025",
          tags: ["budget", "forecast"],
          type: "document",
        },
        {
          id: 4,
          name: "Expense Report.xlsx",
          category: "finance, expenses",
          lastUpdated: "21 Jun 2025",
          tags: ["expenses", "report"],
          type: "document",
        },
      ],
    },
    4: {
      id: 4,
      name: "Hukum",
      email: "demo1@gmail.com",
      date: "16 May 2025",
      documentCount: 2,
      documents: [
        {
          id: 1,
          name: "Legal Contract Template.docx",
          category: "legal, contract",
          lastUpdated: "16 May 2025",
          tags: ["legal", "contract"],
          type: "document",
        },
        {
          id: 2,
          name: "Compliance Guidelines.pdf",
          category: "legal, compliance",
          lastUpdated: "15 May 2025",
          tags: ["compliance", "guidelines"],
          type: "document",
        },
      ],
    },
    5: {
      id: 5,
      name: "Data CRM",
      email: "demo@ifabula.com",
      date: "05 May 2025",
      documentCount: 4,
      documents: [
        {
          id: 1,
          name: "Customer Database Schema.sql",
          category: "data, database",
          lastUpdated: "05 May 2025",
          tags: ["database", "schema"],
          type: "document",
        },
        {
          id: 2,
          name: "CRM User Manual.pdf",
          category: "data, manual",
          lastUpdated: "04 May 2025",
          tags: ["CRM", "manual"],
          type: "document",
        },
        {
          id: 3,
          name: "Data Migration Plan.xlsx",
          category: "data, migration",
          lastUpdated: "03 May 2025",
          tags: ["migration", "plan"],
          type: "document",
        },
        {
          id: 4,
          name: "Analytics Dashboard.png",
          category: "data, analytics",
          lastUpdated: "02 May 2025",
          tags: ["analytics", "dashboard"],
          type: "image",
        },
      ],
    },
    6: {
      id: 6,
      name: "General Information",
      email: "demo@ifabula.com",
      date: "29 Apr 2025",
      documentCount: 3,
      documents: [
        {
          id: 1,
          name: "Company Handbook.pdf",
          category: "general, handbook",
          lastUpdated: "29 Apr 2025",
          tags: ["handbook", "company"],
          type: "document",
        },
        {
          id: 2,
          name: "Employee Onboarding.pptx",
          category: "general, onboarding",
          lastUpdated: "28 Apr 2025",
          tags: ["onboarding", "employee"],
          type: "document",
        },
        {
          id: 3,
          name: "Office Policies.docx",
          category: "general, policies",
          lastUpdated: "27 Apr 2025",
          tags: ["policies", "office"],
          type: "document",
        },
      ],
    },
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const kb = mockKnowledgeBases[params.id];
      setKnowledgeBase(kb);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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
                    Created by {knowledgeBase.email} on {knowledgeBase.date}
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
            >
              <Edit className="h-5 w-5 text-[var(--text-secondary)]" />
            </motion.button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Calendar className="h-4 w-4" />
              <span>Last Updated: {knowledgeBase.date}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <FileText className="h-4 w-4" />
              <span>Documents: {knowledgeBase.documentCount} total</span>
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
                          className="p-2 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                        >
                          <Eye className="h-4 w-4 text-[var(--text-secondary)]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                        >
                          <Edit className="h-4 w-4 text-[var(--text-secondary)]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
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
    </motion.main>
  );
}
