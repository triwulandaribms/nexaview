"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  PencilLine,
  Trash2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { ubApi } from "@/app/lib/userBaseApi";

const pageFx = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id || "1";

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [user, setUser] = useState(null);
  const [forceSkeleton, setForceSkeleton] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const hydratedRef = useRef(false);

  if (forceSkeleton && !timerRef.current) {
    timerRef.current = setTimeout(() => {
      setForceSkeleton(false);
    }, 1200);
  }

  useEffect(() => {
    async function fetchUserData() {
      try {
        const controllerRef = new AbortController();
        const { signal } = controllerRef;

        const response = await ubApi.detail(userId, signal);

        const userData = response?.data || {};
        const user = {
          id: userData.id || "-",
          fullName: `${userData.first_name || "-"} ${userData.last_name || ""}`,
          email: userData.email || "-",
          mobile: userData.mobile_number || "-",
          role: userData.role_name || "-",
          status: "active",
          createdAt: userData.created_at || "-",
          updatedAt: userData.updated_at || "-",
          lastLogin: userData.last_login || "-",
        };

        setUser(user);
        setLoading(false);
      } catch (err) {
        setError(
          "A network issue occurred. Please check your connection and try again."
        );
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  function openDelete() {
    setConfirmOpen(true);
  }
  function closeDelete() {
    if (deleting) return;
    setConfirmOpen(false);
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      // await userApi.remove(user.id);
      await new Promise((r) => setTimeout(r, 900));
      setDeleting(false);
      setConfirmOpen(false);
      router.push("/user-management");
    } catch (e) {
      setDeleting(false);
    }
  }

  function goEdit() {
    router.push(`/user-management/update/${userId}`);
  }

  if (forceSkeleton || !user) {
    return (
      <motion.main
        variants={pageFx}
        initial="hidden"
        animate="show"
        className="min-h-screen p-4 sm:p-6 lg:p-5 overflow-y-auto bg-[var(--background)]"
      >
        <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 lg:-mx-8">
          <div
            className="px-4 sm:px-6 lg:px-8 py-3 border-b"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-lg border animate-pulse"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border-light)",
                }}
              />
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="h-3 pointer-events-none bg-gradient-to-b from-black/5 to-transparent" />
        </div>

        <section>
          <div className="flex items-start gap-3 sm:gap-4 py-4 sm:py-5">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gray-200 dark:bg-gray-400 animate-pulse" />
            <div className="min-w-0 flex-1">
              <div className="h-5 w-48 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 max-w-[70%] bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div
            className="xl:col-span-2 space-y-4 sm:space-y-6"
            style={{ background: "var(--surface-elevated)" }}
          >
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: "var(--border-light)",
              }}
            >
              <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
              <div className="p-4 sm:p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-400 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                      <div className="h-5 w-52 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
              }}
            >
              <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
              <div className="p-4 sm:p-6">
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-3" />
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse" />
              </div>
            </div>
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
              }}
            >
              <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
              <div className="p-4 sm:p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    );
  }

  const statusIsActive = user.status === "active";

  return (
    <motion.main
      variants={pageFx}
      initial="hidden"
      animate="show"
      className="min-h-screen p-4 sm:p-6 lg:p-5 overflow-y-auto bg-[var(--background)] overflow-x-hidden"
    >
      <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 lg:-mx-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="px-4 sm:px-6 lg:px-8 py-3 border-b"
          style={{ borderColor: "var(--border-light)" }}
        >
          <button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
            User Details
          </button>
        </motion.div>
      </div>

      <motion.section variants={fadeUp} initial="hidden" animate="show">
        <div className="flex items-start gap-3 sm:gap-4 py-4 sm:py-5">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <UserIcon className="h-7 w-7 text-white" />
          </motion.div>
          <div className="min-w-0">
            <h2
              className="text-lg sm:text-xl font-semibold leading-6"
              style={{ color: "var(--text-primary)" }}
            >
              {user.fullName}
            </h2>
            <p
              className="text-sm truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {user.email} • Role: {user.role}
            </p>
          </div>
        </div>
      </motion.section>

      <form className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="xl:col-span-2 space-y-4 sm:space-y-6 border rounded-lg"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-light)",
          }}
        >
          <div className="">
            <div className="h-1" style={{ background: "var(--primary)" }} />
            <div className="p-4 sm:p-6">
              <h2
                className="text-base sm:text-lg font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Profile
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <UserIcon
                      className="h-5 w-5"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Full name
                    </div>
                    <div
                      className="font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user.fullName}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <Mail
                      className="h-5 w-5"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Email
                    </div>
                    <div
                      className="font-medium break-words"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <Phone
                      className="h-5 w-5"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Mobile number
                    </div>
                    <div
                      className="font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user.mobile}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <Shield
                      className="h-5 w-5"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Role
                    </div>
                    <div
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.aside
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="xl:col-span-1 space-y-4 sm:space-y-6"
        >
          <div
            className="rounded-lg border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="h-1" style={{ background: "var(--primary)" }} />
            <div className="p-4 sm:p-6">
              <h2
                className="text-base sm:text-lg font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Status
              </h2>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 h-8 font-medium"
                style={{
                  background: statusIsActive
                    ? "rgba(84, 87, 255, .12)"
                    : "rgba(148, 163, 184, .15)",
                  color: statusIsActive
                    ? "var(--primary)"
                    : "var(--text-secondary)",
                  border: `1px solid ${
                    statusIsActive
                      ? "rgba(84,87,255,.3)"
                      : "var(--border-light)"
                  }`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: statusIsActive
                      ? "var(--primary)"
                      : "var(--border-light)",
                  }}
                />
                {statusIsActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="h-1" style={{ background: "var(--primary)" }} />
            <div className="p-4 sm:p-6">
              <h2
                className="text-base sm:text-lg font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Meta
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    User ID
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {user.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Created
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {user.createdAt}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Last updated
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {user.updatedAt}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Last login
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {user.lastLogin}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </form>

      <div
        className="sticky bottom-0 left-0 right-0 mt-6 border-t backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 sm:bg-transparent sm:border-0"
        style={{ borderColor: "var(--border-light)" }}
      >
        <div className="max-w-screen-2xl mx-auto p-3 sm:p-0 sm:pt-6 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openDelete}
            className="w-full sm:w-auto px-4 py-3 rounded-lg font-medium border"
            style={{
              background: "var(--error)",
              color: "var(--text-inverse)",
              borderColor: "var(--border-light)",
            }}
          >
            <span className="inline-flex items-center gap-2 justify-center">
              <Trash2 className="h-5 w-5" /> Delete
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goEdit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium"
            style={{
              background: "var(--primary)",
              color: "var(--text-inverse)",
            }}
          >
            <PencilLine className="h-5 w-5" />
            Edit
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {confirmOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={closeDelete}
            />
            <motion.div
              key="dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              aria-describedby="delete-desc"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            >
              <div
                className="w-full max-w-[28rem] sm:max-w-md rounded-2xl border shadow-xl"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border-light)",
                }}
              >
                <div className="flex items-center gap-3 px-5 pt-5">
                  <div
                    className="p-2 rounded-xl"
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <Trash2
                      className="h-5 w-5"
                      style={{ color: "var(--primary)" }}
                    />
                  </div>
                  <h2
                    id="delete-title"
                    className="text-lg font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Delete User?
                  </h2>
                </div>

                <div className="px-5 pt-3 pb-5">
                  <p
                    id="delete-desc"
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    This action cannot be undone. You will delete:
                  </p>

                  <div
                    className="mt-3 rounded-lg border px-4 py-3 text-sm"
                    style={{
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      background: "var(--surface-secondary)",
                    }}
                  >
                    <span className="font-medium">{user.fullName}</span>
                    <div
                      className="mt-1 text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {user.email} • {user.role} • {user.createdAt}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeDelete}
                      disabled={deleting}
                      aria-label="Cancel"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--surface-elevated)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-light)",
                        outline: "none",
                        boxShadow:
                          "0 1px 0 rgba(255,255,255,.04) inset, 0 6px 20px rgba(0,0,0,.04)",
                      }}
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmDelete}
                      disabled={deleting}
                      aria-label="Delete"
                      aria-busy={deleting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                      style={{
                        background: "var(--primary)",
                        color: "var(--text-inverse)",
                        outline: "none",
                        boxShadow: "0 10px 24px rgba(0,0,0,.10)",
                      }}
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span>{deleting ? "Deleting…" : "Delete"}</span>
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
