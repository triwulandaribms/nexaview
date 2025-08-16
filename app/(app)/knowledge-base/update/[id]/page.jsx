"use client";
import React, { useState } from "react";
import { ChevronLeft, BookOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { kbApi } from "@/app/lib/knowledgeBaseApi";
import { withTimeout } from "@/app/lib/http";

const SkeletonLoader = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    <div className="flex items-start gap-4 mb-6 sm:mb-8">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-lg" />
      <div className="flex-1">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-400 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-400 rounded" />
      </div>
    </div>
    <div className="w-full">
      <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6">
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-400 rounded mb-2" />
        <div className="h-10 bg-gray-200 dark:bg-gray-400 rounded mb-6" />
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-400 rounded mb-2" />
        <div className="h-[120px] bg-gray-200 dark:bg-gray-400 rounded" />
      </div>
    </div>
  </div>
);


export default function UpdateKnowledgeBase() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedRoles: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const params = useParams();

  const id = params?.id;

  React.useEffect(() => {
    let mounted = true;
    const { signal, cancel } = withTimeout(20000);

    (async () => {
      if (!id) return;
      setIsLoading(true);
      setErrorMsg('');

      try {
        const { data } = await kbApi.detail(id, { signal });
        if (!mounted) return;

        setFormData(prev => ({
          ...prev,
          name: data?.name || "",
          description: data?.description || "",
          selectedRoles: Array.isArray(data?.roles) ? data.roles : [],
        }));
      } catch (e) {
        if (mounted) setErrorMsg(e?.message || "Failed to load knowledge base");
      } finally {
        if (mounted) setIsLoading(false);
        cancel();
      }
    })();

    return () => { mounted = false; cancel(); };
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  function sanitizePayload({ name, description, selectedRoles }) {
    const payload = {
      name: name?.trim(),
      description: description?.trim() || undefined,
      roles: Array.isArray(selectedRoles) ? selectedRoles : [],
    };
    return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name?.trim()) {
      setErrorMsg('Name is required.');
      return;
    }
    if (!id) {
      setErrorMsg('Invalid knowledge base id.');
      return;
    }

    if (submitting) return;
    const payload = sanitizePayload(formData);
    const { signal, cancel } = withTimeout(20000);

    setSubmitting(true);
    try {
      const { data, message } = await kbApi.update(id, payload, { signal });
      router.back()
    } catch (err) {
      const status = err?.status ?? 500;
      let msg = err?.message || 'Failed to update knowledge base';

      if (status === 400 || status === 422) msg = 'Invalid input. Please check the form fields.';
      else if (status === 401) msg = 'Unauthorized. Please sign in again.';
      else if (status === 403) msg = 'Forbidden. You do not have permission for this action.';
      else if (status === 404) msg = 'Knowledge base not found.';
      else if (status >= 500) msg = 'Server error. Please try again later.';

      setErrorMsg(msg);
    } finally {
      cancel();
      setSubmitting(false);
    }
  }

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <motion.div
        className="px-4 sm:px-6 py-4 border-b border-[var(--border-light)]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ChevronLeft className="h-5 w-5" />
          Edit Knowledge Base
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            transition={{ duration: 0.3 }}
          >

            {/* Header Card */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="h-6 w-6 text-[var(--text-inverse)]" />
                </motion.div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                    Edit  Knowledge Base
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Created by dika@ifabula.com •{" "}
                    {formData.selectedRoles.length} roles selected
                  </p>
                </div>
              </div>
            </div>

            <div>
              {errorMsg && (
                <div className="mt-2 mb-2 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                  {errorMsg}
                </div>
              )}
              <div>
                {errorMsg && (
                  <div className="mt-2 mb-2 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6">
                  <form id="kb-form" onSubmit={handleSubmit}>
                    {/* Knowledge Base Name */}
                    <div className="mb-6">
                      <label className="block mb-2 font-medium text-[var(--text-primary)]">
                        Knowledge Base Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter knowledge base name"
                        className="w-full lg:w-3/4 px-4 py-2.5 rounded-lg border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block mb-2 font-medium text-[var(--text-primary)]">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter knowledge base description"
                        className="w-full lg:w-3/4 px-4 py-2.5 rounded-lg border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[120px] resize-none transition-all duration-200"
                        maxLength={500}
                      />
                      <div className="text-sm text-[var(--text-tertiary)] mt-2">
                        500 characters remaining
                      </div>
                    </div>
                  </form>
                </div>
              </div>




              {/* Action Buttons */}
              <motion.div
                className="flex justify-end gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 rounded-lg font-medium text-[var(--text-primary)] bg-[var(--surface-secondary)] hover:bg-[var(--surface-secondary-hover)] transition-colors duration-200"
                >
                  Cancel
                </button>
                <motion.button

                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  form="kb-form"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg font-medium text-[var(--text-inverse)] bg-[var(--primary)] hover:opacity-90 flex items-center gap-2 transition-opacity duration-200
    ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {submitting ? 'Saving…' : 'Save Changes'}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
