"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  User as UserIcon,
  List,
  Grid3X3,
  Calendar,
  Mail,
  Shield,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useRouter } from "next/navigation";
import Alert from "@/app/components/Alert";
import CollectionSkeleton from "@/app/components/CollectionSkeleton";
import { ubApi } from "@/app/lib/userBaseApi";

const pageFx = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};
const listFx = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardFx = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22 } },
};

export default function UserManagement() {
  const router = useRouter();

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [forceSkeleton, setForceSkeleton] = useState(true);
  const FORCE_SKELETON_MS = 1500;
  const forceTimerRef = useRef(null);

  if (forceSkeleton && !forceTimerRef.current) {
    forceTimerRef.current = setTimeout(() => {
      setForceSkeleton(false);
      setIsLoading(false);
    }, FORCE_SKELETON_MS);
  }

  function openEdit(user) {
    if (!user?.id) return;
    router.push(`/user-management/update/${user?.id}`);
  }
  function openDelete(user) {
    setSelectedUser(user);
    setConfirmOpen(true);
  }
  function closeDelete() {
    if (!deleting) setConfirmOpen(false);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeDelete();
    }
    if (confirmOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, deleting]);

  async function handleConfirmDelete() {
    if (!selectedUser?.id || deleting) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      const controller = new AbortController();
      const { signal } = controller;

      await ubApi.delete(selectedUser?.id, { signal });

      setUsers((list) => list.filter((u) => u?.id !== selectedUser?.id));
    } catch (e) {
      setErrorMsg(e?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  const controllerRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      controllerRef.current = new AbortController();
      const { signal } = controllerRef.current;

      try {
        const usersData = await ubApi.list(signal);
        setUsers(usersData?.data || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMsg(error.message);
        }
      } finally {
        setIsLoading(false);
        setForceSkeleton(false);
      }
    };

    fetchUsers();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      u?.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  if (isLoading || forceSkeleton) {
    return (
      <motion.main
        variants={pageFx}
        initial="hidden"
        animate="show"
        className="min-h-screen py-4 overflow-y-auto bg-[var(--background)]"
      >
        <CollectionSkeleton viewMode={viewMode} />
      </motion.main>
    );
  }

  return (
    <motion.main
      variants={pageFx}
      initial="hidden"
      animate="show"
      className="min-h-screen py-4 overflow-y-auto bg-[var(--background)]"
    >
      <div className="flex items-end justify-end mb-8">
        {/* <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          User Management
        </h1> */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
          style={{ background: "var(--primary)", color: "var(--text-inverse)" }}
          onClick={() => router.push("/user-management/create")}
        >
          <Plus className="h-4 w-4" />
          New User
        </motion.button>
      </div>
      {errorMsg && (
        <Alert variant="error" onDismiss={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            placeholder="Search users..."
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
        </div>

        <div
          className="flex  items-center rounded-md border overflow-hidden"
          style={{ borderColor: "var(--border-light)" }}
        >
          <button
            className="px-3 py-2  cursor-pointer flex items-center"
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
          </button>
          <button
            className="px-3  cursor-pointer py-2 border-l flex items-center"
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
          </button>
        </div>
      </div>

      {/* Grid / List */}
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={listFx}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredUsers.map((user) => (
                <motion.div
                  key={user?.id}
                  layout
                  variants={cardFx}
                  whileHover={{ scale: 1.01 }}
                  className="relative rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div
                    className="h-1"
                    style={{ background: "var(--primary)" }}
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                      style={{ color: "var(--text-secondary)" }}
                      onClick={() => openEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-gray-100 cursor-pointer text-(--error)"
                      onClick={() => openDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--primary)" }}
                      >
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3
                          className="font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {user.name}
                        </h3>
                      </div>
                    </div>

                    <div
                      className="space-y-2 mb-6 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <div className="flex gap-2 items-center">
                        <Mail className="h-4 w-4" /> {user.email}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Shield className="h-4 w-4" /> {user.role || "Member"}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Calendar className="h-4 w-4" /> {user.created_at}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        router.push(`/user-management/${user?.id}`)
                      }
                      className="w-full py-2 px-4 rounded-md font-medium cursor-pointer"
                      style={{
                        background: "var(--surface-secondary)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border-light)",
                      }}
                    >
                      View
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={listFx}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  variants={cardFx}
                  whileHover={{ scale: 1.005 }}
                  className="relative rounded-lg border overflow-hidden hover:shadow-md transition-shadow duration-200"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div
                    className="h-1"
                    style={{ background: "var(--primary)" }}
                  />
                  <div className="px-6 pt-8 pb-6">
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                        style={{ color: "var(--text-secondary)" }}
                        onClick={() => openEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer text-(--error)"
                        onClick={() => openDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--primary)" }}
                      >
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {user.name}
                        </h3>
                        <div
                          className="text-xs"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {user.email} • {user.role || "Member"} •{" "}
                          {user.created_at}
                        </div>
                      </div>

                      <div className="flex-shrink-0 items-end flex">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            router.push(`/user-management/${user.id}`)
                          }
                          className="px-4 py-2 rounded-lg font-medium cursor-pointer"
                          style={{
                            background: "var(--surface-secondary)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-light)",
                          }}
                        >
                          View
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
      {users.length === 0 && !searchTerm && isLoading == false && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 rounded-lg border text-center"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-light)",
            color: "var(--text-primary)",
          }}
        >
          <h3 className="text-lg font-medium mb-2">No user yet</h3>
          <p
            className="text-sm mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Create your first user to enable semantic search across your data.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 mx-auto rounded-lg font-medium cursor-pointer"
            style={{
              background: "var(--primary)",
              color: "var(--text-inverse)",
            }}
            onClick={() => router.push("/user-management/create")}
          >
            <Plus className="h-4 w-4" />
            New User
          </motion.button>
        </motion.div>
      )}

      {filteredUsers.length === 0 && searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 rounded-lg border text-center"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-light)",
            color: "var(--text-primary)",
          }}
        >
          <h3 className="text-lg font-medium mb-2">No user found</h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No user found matching "{searchTerm}"
          </p>
        </motion.div>
      )}

      {/*  Delete Modal */}
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
                    <AlertTriangle
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
                    <span className="font-medium">{selectedUser?.name}</span>
                    <div
                      className="mt-1 text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {selectedUser?.email} • {selectedUser?.role || "Member"} •{" "}
                      {selectedUser?.created_at}
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
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
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
                        <Trash2 className="h-4 w-4 text-(--error)" />
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
