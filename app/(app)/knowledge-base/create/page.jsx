"use client";
import React, { useState } from "react";
import { ChevronLeft, Lock, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
      {/* Form Skeleton */}
      <div className="w-full lg:flex-1 order-2 lg:order-1">
        <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-400 rounded mb-2" />
          <div className="h-10 bg-gray-200 dark:bg-gray-400 rounded mb-6" />
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-400 rounded mb-2" />
          <div className="h-[120px] bg-gray-200 dark:bg-gray-400 rounded" />
        </div>
      </div>

      {/* Permissions Skeleton */}
      <div className="w-full lg:w-[400px] order-1 lg:order-2">
        <div className="bg-[var(--surface-elevated)] rounded-lg border border-[var(--border-light)] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-400 rounded" />
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-400 rounded" />
          </div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-400 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-200 dark:bg-gray-400 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function CreateKnowledgeBase() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedRoles: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const roles = [
    "Admin",
    "Manager",
    "Developer",
    "HR Manager",
    "Product Manager",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => {
      const newRoles = prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter((r) => r !== role)
        : [...prev.selectedRoles, role];
      return { ...prev, selectedRoles: newRoles };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

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
          Create Knowledge Base
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
                    New Knowledge Base
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Created by dika@ifabula.com •{" "}
                    {formData.selectedRoles.length} roles selected
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Main Form Section */}
                <motion.div
                  className="w-full lg:flex-1 order-2 lg:order-1"
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                  }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6">
                    <form onSubmit={handleSubmit}>
                      {/* Knowledge Base Name */}
                      <div className="mb-6">
                        <label className="block mb-2 font-medium text-[var(--text-primary)]">
                          Knowledge Base Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter knowledge base name"
                          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200"
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
                          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[120px] resize-none transition-all duration-200"
                          maxLength={500}
                        />
                        <div className="text-sm text-[var(--text-tertiary)] mt-2">
                          500 characters remaining
                        </div>
                      </div>
                    </form>
                  </div>
                </motion.div>

                {/* Role Permissions Section */}
                <motion.div
                  className="w-full lg:w-[400px] order-1 lg:order-2"
                  variants={{
                    initial: { opacity: 0, x: 20 },
                    animate: { opacity: 1, x: 0 },
                  }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-[var(--surface-elevated)] rounded-lg border border-[var(--border-light)] p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="h-5 w-5 text-[var(--text-tertiary)]" />
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Role Permissions
                      </h3>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                      Select roles that will have access to this knowledge base.
                      Users with these roles will be able to view and interact
                      with the content.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                      {roles.map((role, index) => (
                        <motion.div
                          key={role}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRoleToggle(role)}
                          className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border-light)] bg-white cursor-pointer hover:bg-[var(--surface-hover)] transition-colors duration-200"
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              formData.selectedRoles.includes(role)
                                ? "border-[var(--primary)] bg-[var(--primary)]"
                                : "border-[var(--border-light)]"
                            }`}
                          >
                            {formData.selectedRoles.includes(role) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </motion.svg>
                            )}
                          </div>
                          <span className="text-[var(--text-primary)]">
                            {role}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    {formData.selectedRoles.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-start gap-2 mt-4 p-4 rounded-lg border border-[var(--border-light)] bg-white"
                      >
                        <svg
                          className="w-5 h-5 text-[var(--text-tertiary)] mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-[var(--text-secondary)]">
                          No roles selected. Only administrators will be able to
                          access this knowledge base.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
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
                  className="px-4 py-2 rounded-lg font-medium text-[var(--text-inverse)] bg-[var(--primary)] hover:opacity-90 flex items-center gap-2 transition-opacity duration-200"
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
                  Create Knowledge Base
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
