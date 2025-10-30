"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Bot,
  Wrench,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Users,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import CreateAPIKeyModal from "../../components/CreateAPIKeyModal";
import CreateProjectModal from "../../components/CreateProjectModal";
import AddUserToProjectModal from "../../components/AddUserToProjectModal";
import CreateCategoryModal from "../../components/CreateCategoryModal";
import UserManagement from "./user-management/page";
import RoleManagement from "./role-management/page";

export default function Settings() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState("Manage Users");
  const [activeSubTab, setActiveSubTab] = useState("Overview");
  const [activeSubTabManage, setActiveSubTabManage] = useState("API keys");
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isCreateAPIKeyModalOpen, setIsCreateAPIKeyModalOpen] = useState(false);
  const [isAddUserToProjectModalOpen, setIsAddUserToProjectModalOpen] =
    useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [isCreditLimitExpanded, setIsCreditLimitExpanded] = useState(false);
  const [isRunLimitExpanded, setIsRunLimitExpanded] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      y: -3,
      scale: 1.01,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const mainTabs = [
    "Manage Users",
    "Manage Role",
    "Manage projects",
    "Billings & Plans",
    "Usages",
  ];

  const subTabs = ["Overview", "Invite"];

  const users = [
    {
      id: 1,
      name: "Dika Irwandifika",
      email: "dikairwan0405@gmail.com",
      role: "Owner",
    },
  ];

  return (
    <motion.main
      className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto"
      style={{ background: "var(--background)" }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <PageHeader
            title="Settings"
            subtitle="Manage your account and workspace settings"
          />
        </motion.div>

        {/* Main Tabs */}
        <motion.div className="mb-2" variants={itemVariants}>
          <div
            className="border-b overflow-x-auto scrollbar-hide"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div className="flex items-center gap-2 sm:gap-4 md:gap-8 min-w-max">
              {mainTabs.map((tab, index) => (
                <motion.button
                  key={tab}
                  className="pb-3 px-3 font-medium transition-all duration-200 cursor-pointer relative whitespace-nowrap"
                  style={{
                    color:
                      activeMainTab === tab
                        ? "var(--primary)"
                        : "var(--text-secondary)",
                  }}
                  onClick={() => setActiveMainTab(tab)}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab}
                  {activeMainTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: "var(--primary)" }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sub Tabs - Only show for Manage Users */}
        <AnimatePresence>
          {activeMainTab === "Manage Users" && <UserManagement />}
        </AnimatePresence>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeMainTab === "Manage projects" && (
            <motion.div
              key="manage-projects"
              className="flex gap-5 max-md:flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Sidebar */}
              <div className="w-[220px] flex flex-col gap-4 border-r border-r-border-light pr-8">
                <button
                  className="mt-2 mb-2 px-4 py-2 rounded-md font-medium text-white cursor-pointer hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                  onClick={() => setIsCreateProjectModalOpen(true)}
                >
                  + Create project
                </button>
                <div className="flex flex-col gap-1">
                  {/* Only one project for now, highlight as active */}
                  <button
                    className="px-4 py-2 rounded-md font-medium text-left transition-all border border-transparent bg-[var(--surface-elevated)]"
                    style={{
                      color: "var(--primary)",
                      background: "var(--surface-elevated)",
                      borderColor: "var(--primary)",
                    }}
                  >
                    Studio
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Project Card Header */}
                <motion.div
                  className="flex flex-col mb-8 gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Studio
                    </h2>
                    <div
                      className="flex flex-wrap gap-4 text-sm mt-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span>Created at: 12-06-2025 04:35 PM</span>
                      <span>Created by: System</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="flex items-center justify-center p-3 rounded-md border gap-20"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-light)",
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Bot className="size-5 text-primary" />
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Agent
                        </span>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: "var(--primary)" }}
                      >
                        1
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-center p-3 rounded-md border gap-20"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-light)",
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Wrench className="size-5 text-primary" />
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Tool
                        </span>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: "var(--primary)" }}
                      >
                        4
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-center p-3 rounded-md border gap-20"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-light)",
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <BookOpen className="size-5 text-primary" />
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Knowledge
                        </span>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: "var(--primary)" }}
                      >
                        1
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Project Tabs */}
                <motion.div className="mb-8">
                  <div
                    className="flex gap-2 border-b"
                    style={{ borderColor: "var(--border-light)" }}
                  >
                    {[
                      "API keys",
                      "Credits & Runs limits",
                      "Users",
                      "Categories",
                    ].map((tab, idx) => (
                      <motion.button
                        key={tab}
                        className="pb-3 px-3 font-medium transition-all duration-200 cursor-pointer relative"
                        style={{
                          color:
                            activeSubTabManage === tab
                              ? "var(--primary)"
                              : "var(--text-secondary)",
                        }}
                        onClick={() => setActiveSubTabManage(tab)}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tab}
                        <AnimatePresence>
                          {activeSubTabManage === tab && (
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 h-0.5"
                              style={{ background: "var(--primary)" }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              exit={{ scaleX: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Project Tab Content */}
                <AnimatePresence mode="wait">
                  {activeSubTabManage === "API keys" && (
                    <motion.div
                      key="api-keys"
                      className="p-8 rounded-md border"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-light)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3
                          className="text-lg font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Generated API Keys
                        </h3>
                        <button
                          className="px-4 py-2 rounded-md font-medium"
                          style={{
                            background: "var(--primary)",
                            color: "var(--text-inverse)",
                          }}
                          onClick={() => setIsCreateAPIKeyModalOpen(true)}
                        >
                          + Create API Key
                        </button>
                      </div>
                      <div
                        className="rounded-md border overflow-hidden"
                        style={{
                          background: "var(--surface-base)",
                          borderColor: "var(--border-light)",
                        }}
                      >
                        <div
                          className="grid grid-cols-6 gap-4 p-4 border-b font-medium text-sm"
                          style={{
                            background: "var(--surface-secondary)",
                            borderColor: "var(--border-light)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <div>Key name</div>
                          <div>User</div>
                          <div>Key</div>
                          <div>Request/minute</div>
                          <div>Created at</div>
                          <div>Actions</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-8">
                          <Trash2 className="w-10 h-10 mb-4 text-(--primary)" />
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            You do not have any API keys yet
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeSubTabManage === "Credits & Runs limits" && (
                    <motion.div
                      key="credits-runs"
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Credit Limit Section */}
                      <div
                        className="rounded-md border"
                        style={{
                          background: "var(--surface-elevated)",
                          borderColor: "var(--border-light)",
                        }}
                      >
                        <button
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover transition-colors duration-200"
                          onClick={() =>
                            setIsCreditLimitExpanded(!isCreditLimitExpanded)
                          }
                        >
                          <h3
                            className="text-lg font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            Credit Limit
                          </h3>
                          <motion.div
                            animate={{
                              rotate: isCreditLimitExpanded ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown
                              className="h-5 w-5"
                              style={{ color: "var(--text-secondary)" }}
                            />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isCreditLimitExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div
                                className="px-4 pb-4 border-t"
                                style={{ borderColor: "var(--border-light)" }}
                              >
                                <div className="pt-4">
                                  <p
                                    className="text-sm mb-4"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    The maximum credits limit for this project
                                    is{" "}
                                    <span
                                      className="font-medium"
                                      style={{ color: "var(--text-tertiary)" }}
                                    >
                                      credits limit
                                    </span>{" "}
                                    <span
                                      className="font-medium"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      Credits
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Run Limit Section */}
                      <div
                        className="rounded-md border"
                        style={{
                          background: "var(--surface-elevated)",
                          borderColor: "var(--border-light)",
                        }}
                      >
                        <button
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover transition-colors duration-200"
                          onClick={() =>
                            setIsRunLimitExpanded(!isRunLimitExpanded)
                          }
                        >
                          <h3
                            className="text-lg font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            Run Limit
                          </h3>
                          <motion.div
                            animate={{ rotate: isRunLimitExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown
                              className="h-5 w-5"
                              style={{ color: "var(--text-secondary)" }}
                            />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isRunLimitExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div
                                className="px-4 pb-4 border-t"
                                style={{ borderColor: "var(--border-light)" }}
                              >
                                <div className="pt-4">
                                  <p
                                    className="text-sm mb-4"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    The maximum run limit for this project is{" "}
                                    <span
                                      className="font-medium"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      50
                                    </span>{" "}
                                    <span
                                      className="font-medium"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      Runs
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                  {activeSubTabManage === "Users" && (
                    <motion.div
                      key="users"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Added users
                        </h3>
                        <motion.button
                          className="flex items-center gap-2 px-4 py-2 rounded-md border font-medium transition-all duration-200 cursor-pointer hover:opacity-90"
                          style={{
                            borderColor: "var(--primary)",
                            color: "var(--primary)",
                            background: "transparent",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsAddUserToProjectModalOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                          Add user
                        </motion.button>
                      </div>

                      {/* Users Table */}
                      <div
                        className="rounded-md border overflow-hidden"
                        style={{
                          background: "var(--surface-elevated)",
                          borderColor: "var(--border-light)",
                        }}
                      >
                        {/* Table Header */}
                        <div
                          className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm"
                          style={{
                            background: "var(--surface-secondary)",
                            borderColor: "var(--border-light)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <div>User name</div>
                          <div>Email</div>
                          <div>Role</div>
                          <div>Created At</div>
                        </div>

                        {/* Table Body */}
                        <div
                          className="divide-y"
                          style={{ borderColor: "var(--border-light)" }}
                        >
                          <motion.div
                            className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-surface-hover transition-colors duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                          >
                            <div
                              className="font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              System
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              dikairwan6390@gmail.com
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Owner
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              12-06-2025 | 04:35 PM
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Pagination */}
                      <div className="flex justify-center mt-6">
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-md border text-sm font-medium"
                          style={{
                            borderColor: "var(--border-light)",
                            color: "var(--text-primary)",
                            background: "var(--surface-elevated)",
                          }}
                        >
                          1
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeSubTabManage === "Categories" && (
                    <motion.div
                      key="categories"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Categories
                        </h3>
                        <motion.button
                          className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer hover:opacity-90"
                          style={{
                            background: "var(--primary)",
                            color: "var(--text-inverse)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsCreateCategoryModalOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                          Create Category
                        </motion.button>
                      </div>

                      {/* Categories Table */}
                      <div
                        className="rounded-md border overflow-hidden"
                        style={{
                          background: "var(--surface-elevated)",
                          borderColor: "var(--border-light)",
                        }}
                      >
                        {/* Table Header */}
                        <div
                          className="grid grid-cols-5 gap-4 p-4 border-b font-medium text-sm"
                          style={{
                            background: "var(--surface-secondary)",
                            borderColor: "var(--border-light)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <div>Name</div>
                          <div>Description</div>
                          <div>Created at</div>
                          <div>Updated at</div>
                          <div>Actions</div>
                        </div>

                        {/* Empty State */}
                        <div className="flex flex-col items-center justify-center py-16">
                          {/* Box Icon */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="mb-6"
                          >
                            <svg
                              width="80"
                              height="80"
                              fill="none"
                              viewBox="0 0 80 80"
                            >
                              <rect
                                x="15"
                                y="35"
                                width="50"
                                height="30"
                                rx="4"
                                fill="#F3F0FF"
                                stroke="#A78BFA"
                                strokeWidth="2"
                              />
                              <rect
                                x="20"
                                y="40"
                                width="40"
                                height="20"
                                rx="2"
                                fill="#EDE9FE"
                              />
                              <path
                                d="M15 35L40 20L65 35"
                                stroke="#A78BFA"
                                strokeWidth="2"
                                fill="none"
                              />
                              <circle cx="40" cy="25" r="3" fill="#A78BFA" />
                            </svg>
                          </motion.div>
                          <motion.p
                            className="text-lg font-medium"
                            style={{ color: "var(--text-primary)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                          >
                            You do not have any categories yet
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeMainTab === "Billings & Plans" && (
            <motion.div
              key="billings-plans"
              className="p-4 sm:p-6 lg:p-8"
              style={{ background: "var(--background)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Active Plan Card */}
                <div
                  className="flex-[2] rounded-xl bg-white shadow border p-6 flex flex-col min-w-[340px]"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span
                      className="text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Active Plan – Free
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-md border font-medium text-sm flex items-center gap-1"
                        style={{
                          borderColor: "var(--border-light)",
                          color: "var(--text-primary)",
                          background: "var(--surface)",
                        }}
                      >
                        Payment History
                      </button>
                      <button
                        className="px-4 py-2 rounded-md font-medium text-sm flex items-center gap-1"
                        style={{
                          background: "var(--primary)",
                          color: "var(--text-inverse)",
                        }}
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-8 items-center">
                    <div className="flex flex-col items-center min-w-[80px]">
                      <svg
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="7"
                          width="18"
                          height="13"
                          rx="2"
                          stroke="#111"
                          strokeWidth="1.5"
                        />
                        <path d="M3 10h18" stroke="#A78BFA" strokeWidth="1.5" />
                        <rect
                          x="7"
                          y="3"
                          width="10"
                          height="4"
                          rx="1"
                          stroke="#A78BFA"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span
                        className="font-bold text-lg"
                        style={{ color: "var(--text-primary)" }}
                      >
                        2,000
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Credits
                      </span>
                    </div>
                    <div className="flex flex-col items-center min-w-[100px]">
                      <svg
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="4"
                          y="5"
                          width="16"
                          height="16"
                          rx="4"
                          stroke="#111"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 3v4M16 3v4M4 9h16"
                          stroke="#A78BFA"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span
                        className="font-bold text-lg"
                        style={{ color: "var(--text-primary)" }}
                      >
                        19-06-2025
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Trail Ends
                      </span>
                    </div>
                    <div className="flex flex-col items-center min-w-[60px]">
                      <svg
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="8"
                          r="4"
                          stroke="#111"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
                          stroke="#A78BFA"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span
                        className="font-bold text-lg"
                        style={{ color: "var(--text-primary)" }}
                      >
                        1 user
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        users
                      </span>
                    </div>
                    <div className="flex flex-col items-center min-w-[80px]">
                      <svg
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <ellipse
                          cx="12"
                          cy="7"
                          rx="8"
                          ry="3"
                          stroke="#A78BFA"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M4 7v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7"
                          stroke="#111"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span
                        className="font-bold text-lg"
                        style={{ color: "var(--text-primary)" }}
                      >
                        50 MB
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Storage
                      </span>
                    </div>
                  </div>
                </div>
                {/* Credits Card */}
                <div
                  className="flex-1 max-w-[320px] rounded-xl bg-white shadow border p-6 flex flex-col min-w-[260px]"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <svg
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="7"
                          width="18"
                          height="13"
                          rx="2"
                          stroke="#111"
                          strokeWidth="1.5"
                        />
                        <path d="M3 10h18" stroke="#A78BFA" strokeWidth="1.5" />
                        <rect
                          x="7"
                          y="3"
                          width="10"
                          height="4"
                          rx="1"
                          stroke="#A78BFA"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span
                        className="font-bold text-xl"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Credits
                      </span>
                    </div>
                    <button
                      className="px-4 py-2 rounded-md font-medium text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      Buy Credits
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="font-bold text-2xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      2,000
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeMainTab === "Manage Role" && <RoleManagement />}

          {activeMainTab === "Usages" && (
            <motion.div
              key="usages"
              className="p-8 rounded-md border text-center"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3
                className="text-lg font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Usage Statistics
              </motion.h3>
              <motion.p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                Usage analytics and statistics will be displayed here
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {isCreateProjectModalOpen && (
            <CreateProjectModal
              isOpen={isCreateProjectModalOpen}
              onClose={() => setIsCreateProjectModalOpen(false)}
              users={users}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCreateAPIKeyModalOpen && (
            <CreateAPIKeyModal
              isOpen={isCreateAPIKeyModalOpen}
              onClose={() => setIsCreateAPIKeyModalOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAddUserToProjectModalOpen && (
            <AddUserToProjectModal
              isOpen={isAddUserToProjectModalOpen}
              onClose={() => setIsAddUserToProjectModalOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCreateCategoryModalOpen && (
            <CreateCategoryModal
              isOpen={isCreateCategoryModalOpen}
              onClose={() => setIsCreateCategoryModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
