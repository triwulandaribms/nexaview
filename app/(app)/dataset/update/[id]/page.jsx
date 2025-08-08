"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Plus, X, ArrowLeft } from "lucide-react";
import Alert from "@/app/components/Alert";
import { withTimeout } from "@/app/lib/http";
import { dsApi } from "@/app/lib/datasetBaseApi";
import PageHeader from "@/app/components/PageHeader";

export default function UpdateDataset() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const params = useParams();
  const id = params.id;
  const isFileSectionDisabled = true;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton component for the upload section
  const SkeletonUpload = () => (
    <div className="max-w-3xl mx-auto">
      <div
        className="relative border-2 border-dashed rounded-lg p-8 text-center"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 animate-pulse" />
          <div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>

      {/* Skeleton Categories & Tags Button */}
      <div className="mt-6">
        <div
          className="h-12 rounded-lg w-full bg-gray-200 animate-pulse"
          style={{ background: "var(--surface-elevated)" }}
        />
      </div>

      {/* Skeleton Upload Button */}
      <div className="mt-6">
        <div className="h-12 rounded-lg w-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  );

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (uploading) return;

    setUploading(true);
    setErrorMsg("");

    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const payload = { category: categories, tags };
      const res = await dsApi.update(id, payload, { signal });

      if (res?.success == false) {
        setErrorMsg(res?.error || "Failed to update dataset");
        return;
      }
      router.back();
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to update dataset");
    } finally {
      clearTimeout(timeoutId);
      setUploading(false);
    }
  };


  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const { signal, cancel } = withTimeout();

    (async () => {
      const res = await dsApi.detail(id, { signal });

      if (!mounted) return;

      if (res?.success == false) {
        setErrorMsg(res.error || 'Gagal memuat dataset');
      } else {
        setCategories(res.data.category || []);
        setTags(res.data.tags || []);
        setFile({
          name: res.data?.filename || "",
          size: res?.data.file_size || ""
        })
        const hasMeta = (Array.isArray(res.data.category) && res.data.category.length > 0)
          || (Array.isArray(res.data.tags) && res.data.tags.length > 0);
        setIsExpanded(hasMeta);
      }
      setIsLoading(false);
    })();

    return () => { mounted = false; cancel(); };
  }, [id]);

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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 rounded-full cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          {isLoading ? (
            <div className="flex-1">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
            </div>
          ) : (
            <PageHeader
              title="Edit Dataset"
              subtitle="Update your dataset categories and tags." />
          )}
        </div>

        {errorMsg && (
          <Alert variant="error" onDismiss={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        {isLoading ? (
          <SkeletonUpload />
        ) : (
          <motion.div className="max-w-3xl mx-auto">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
    ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}
    ${isFileSectionDisabled ? "opacity-60 pointer-events-none select-none" : "cursor-pointer"}
  `}
              style={{
                background: "var(--surface-elevated)",
                borderColor: isDragging ? "var(--primary)" : "var(--border-light)",
              }}
              onDragEnter={isFileSectionDisabled ? undefined : handleDragEnter}
              onDragLeave={isFileSectionDisabled ? undefined : handleDragLeave}
              onDragOver={isFileSectionDisabled ? undefined : handleDragOver}
              onDrop={isFileSectionDisabled ? undefined : handleDrop}
              onClick={
                isFileSectionDisabled ? undefined : () => !file && document.getElementById("fileInput").click()
              }
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isFileSectionDisabled}
              />
              {!file ? (
                <div className="space-y-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ background: "var(--primary-light)" }}
                  >
                    <Upload
                      className="h-8 w-8"
                      style={{ color: "var(--primary)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-lg font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Drag and drop your file here, or click to select
                    </p>
                    <p
                      className="mt-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Supports PDF, DOCX, TXT, and other document formats
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ background: "var(--surface-secondary)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "var(--primary)" }}
                    >
                      <Upload
                        className="h-5 w-5"
                        style={{ color: "var(--text-inverse)" }}
                      />
                    </div>
                    <div className="text-left">
                      <p
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {file.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {file.size}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X
                      className="h-5 w-5"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Categories & Tags Section */}
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : "48px" }}
              className="mt-6 overflow-hidden"
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg w-full text-left cursor-pointer"
                style={{
                  background: "var(--surface-elevated)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <Plus className="h-4 w-4" />
                Add Category & Tags (Optional)
              </button>

              {isExpanded && (
                <div
                  className="mt-4 space-y-4 p-4 rounded-lg"
                  style={{ background: "var(--surface-elevated)" }}
                >
                  {/* Categories */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                          style={{
                            background: "var(--surface-secondary)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {category}
                          <button
                            onClick={() => handleRemoveCategory(category)}
                            className="hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <form onSubmit={handleAddCategory} className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add a category"
                        className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{
                          background: "var(--surface-secondary)",
                          borderColor: "var(--border-light)",
                          color: "var(--text-primary)",
                        }}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{
                          background: "var(--primary)",
                          color: "var(--text-inverse)",
                        }}
                      >
                        Add
                      </button>
                    </form>
                  </div>

                  {/* Tags */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                          style={{
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                          }}
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <form onSubmit={handleAddTag} className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{
                          background: "var(--surface-secondary)",
                          borderColor: "var(--border-light)",
                          color: "var(--text-primary)",
                        }}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{
                          background: "var(--primary)",
                          color: "var(--text-inverse)",
                        }}
                      >
                        Add
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full mt-6 py-3 rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--primary)",
                color: "var(--text-inverse)",
              }}
            >
              Edit Document
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}
