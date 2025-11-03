"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  Save,
  Loader2,
  Shield,
  Search,
  CheckSquare,
  Square,
  ListChecks,
  Settings,
  User as UserIcon,
  FileText,
  Lock,
  Database,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import RoleSkeletonLoader from "@/app/components/RoleSkeletonLoader";
import { rbApi } from "@/app/lib/rolesBaseApi";
import { menusbApi } from "@/app/lib/menusBaseApi";

const pageFx = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function EditRolePage() {
  const router = useRouter();
  const { id: roleId = "1" } = useParams() ?? {};

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [statusActive, setStatusActive] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [forceSkeleton, setForceSkeleton] = useState(true);
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);
  const timerRef = useRef(null);
  const hydratedRef = useRef(false);

  if (forceSkeleton && !timerRef.current) {
    timerRef.current = setTimeout(() => {
      setForceSkeleton(false);
    }, 1200);
  }

  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return catalog;
    return catalog
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            it.key.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [search, catalog]);

  const selectedCount = selected.size;

  const togglePermission = (data) => {
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);
      const [menuId, action] = data?.key.split(".");

      const permission = data.permission.toUpperCase();

      const hasPermission = Array.from(newSelected).some(
        (item) =>
          item.menu_uid === menuId && item.mrm_permission.includes(permission)
      );

      if (hasPermission) {
        Array.from(newSelected).forEach((item) => {
          if (
            item.menu_uid == menuId &&
            item.mrm_permission.includes(permission)
          ) {
            const updatedPermission = item.mrm_permission
              .replace(permission, "")
              .trim();

            if (updatedPermission) {
              newSelected.delete(item);
              newSelected.add({
                ...item,
                mrm_permission: updatedPermission,
              });
            } else {
              newSelected.delete(item);
            }
          }
        });
      } else {
        newSelected.add({
          menu_uid: menuId,
          action: data.key.split(".")[1],
          mrm_permission: permission,
        });
      }

      return newSelected;
    });
  };

  const selectAllInCategory = (cat) => {
    setSelected((prevSelected) => {
      const next = new Set(prevSelected);
      const existingItem = Array.from(next).find(
        (item) => item.menu_uid === cat.key
      );

      if (existingItem) {
        next.delete(existingItem);
        next.add({
          ...existingItem,
          mrm_permission: "CRUD",
        });
      } else {
        next.add({
          menu_name: cat.label || "",
          mrm_permission: "CRUD",
          menu_uid: cat.key,
        });
      }

      return next;
    });
  };

  const clearAllInCategory = (cat) => {
    setSelected((prevSelected) => {
      const next = new Set(prevSelected);
      const existingItem = Array.from(next).find(
        (item) => item.menu_uid === cat.key
      );
      if (existingItem) {
        next.delete(existingItem);
      }
      return next;
    });
  };

  const hasAllInCategory = (cat) => {
    const existingItem = Array.from(selected).find(
      (item) => item.menu_uid === cat.key
    );
    if (existingItem?.mrm_permission.includes("CRUD")) {
      return true;
    } else {
      return false;
    }
  };

  const hasSomeInCategory = (cat) => {
    return cat.items.some((it) => selected.has(it.key));
  };

  const handleSelectAll = (cat) => {
    if (hasAllInCategory(cat)) {
      clearAllInCategory(cat);
    } else {
      selectAllInCategory(cat);
    }
  };

  function validate() {
    if (!roleName || roleName.trim().length < 3)
      return "Role name must be at least 3 characters.";
    return null;
  }

  async function handleUpdate(e) {
    e.preventDefault();

    if (submitting) return;

    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const permissionMap = {};

      Array.from(selected).forEach((key) => {
        const menuUid = key.menu_uid;
        const permission = key.mrm_permission || "";

        if (!permissionMap[menuUid]) {
          permissionMap[menuUid] = new Set();
        }

        permissionMap[menuUid].add(permission);
      });

      const permissions = Object.keys(permissionMap).map((menuUid) => {
        const permissionString = Array.from(permissionMap[menuUid]).join("");
        return { id: menuUid, permission: permissionString };
      });

      const payload = {
        name: roleName.trim(),
        description: description.trim() || null,
        status: statusActive ? "active" : "inactive",
        permissions: permissions,
      };

      const controller = new AbortController();
      const { signal } = controller;
      await rbApi.update(roleId, payload, { signal });

      await new Promise((r) => setTimeout(r, 1000));

      router.push("/settings");
    } catch (e) {
      setErrorMsg(e?.message || "Failed to update role.");
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    async function fetchRoleDetails() {
      if (!forceSkeleton && !hydratedRef.current) {
        try {
          setLoading(true);
          const controllerRef = new AbortController();
          const { signal } = controllerRef;
          const { data } = await rbApi.detail(roleId, signal);

          if (data) {
            setRoleName(data.mr_name || "");
            setDescription(data.mr_description || "");
            setStatusActive(data.status === "active");
            setSelected(new Set(data.permissions || []));
            hydratedRef.current = true;
          } else {
            setErrorMsg("Role not found.");
          }
        } catch (error) {
          setErrorMsg("Failed to fetch role details.");
        } finally {
          setLoading(false);
        }
      }
    }

    async function fetchCatalogData() {
      try {
        const controllerRef = new AbortController();
        const { signal } = controllerRef;
        const { data } = await menusbApi.list(signal);

        const transformedData = (data || []).map((item) => ({
          key: item.mm_uid,
          label: item.mm_name,
          icon: <Shield className="h-4 w-4" />,
          items: [
            { key: `${item.mm_uid}.create`, label: "Create", permission: "c" },
            { key: `${item.mm_uid}.read`, label: "Read", permission: "r" },
            { key: `${item.mm_uid}.update`, label: "Update", permission: "u" },
            { key: `${item.mm_uid}.delete`, label: "Delete", permission: "d" },
          ],
        }));

        if (transformedData) {
          setCatalog(transformedData);
        } else {
          setErrorMsg("Failed to fetch catalog data.");
        }
      } catch (error) {
        setErrorMsg("Failed to fetch catalog data.");
      }
    }

    fetchRoleDetails();
    fetchCatalogData();
  }, [roleId, forceSkeleton]);

  if (loading || forceSkeleton) return <RoleSkeletonLoader />;

  return (
    <motion.main
      variants={pageFx}
      initial="hidden"
      animate="show"
      className="min-h-screen p-4 sm:p-6 lg:p-5  bg-[var(--background)] overflow-x-hidden"
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
            Edit role
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
            <Shield className="h-7 w-7 text-white" />
          </motion.div>
          <div className="min-w-0">
            <h2
              className="text-lg sm:text-xl font-semibold leading-6"
              style={{ color: "var(--text-primary)" }}
            >
              Edit Role
            </h2>
            <div
              className="text-sm leading-5 sm:flex sm:flex-wrap sm:items-center sm:gap-2"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="block sm:inline break-words">
                Role ID: {roleId}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                •
              </span>
              <span className="block sm:inline whitespace-nowrap">
                {selectedCount} permissions selected
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {errorMsg && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-4 rounded-lg border px-4 py-3 text-sm"
          style={{
            background: "rgba(243, 18, 96, 0.06)",
            color: "var(--text-primary)",
            borderColor: "var(--border-light)",
          }}
        >
          {errorMsg}
        </motion.div>
      )}

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6"
      >
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="xl:col-span-2 space-y-4 sm:space-y-6"
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
                Role Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Role name
                  </label>
                  <input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. Content Manager"
                    required
                    className="w-full rounded-lg border px-3 py-3 text-sm sm:text-base focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      "--tw-ring-color": "var(--primary)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Description (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description about this role…"
                    className="w-full rounded-lg border px-3 py-3 text-sm sm:text-base focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                      "--tw-ring-color": "var(--primary)",
                    }}
                  />
                </div>
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
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Permissions
                </h2>
                <div
                  className="hidden sm:inline-flex items-center gap-2 rounded-full px-3 h-8 text-sm"
                  style={{
                    background: "var(--surface-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <ListChecks className="h-4 w-4" />
                  {selectedCount} selected
                </div>
              </div>

              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search permission or key…"
                  className="w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                    "--tw-ring-color": "var(--primary)",
                  }}
                />
              </div>

              <div className="space-y-4">
                {filteredCatalog.map((cat) => {
                  const all = hasAllInCategory(cat);
                  const some = hasSomeInCategory(cat);
                  return (
                    <div
                      key={cat.key}
                      className="rounded-lg border"
                      style={{
                        borderColor: "var(--border-light)",
                        background: "var(--surface-elevated)",
                      }}
                    >
                      <div className="flex items-center justify-between p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg"
                            style={{ background: "var(--surface-secondary)" }}
                          >
                            {cat.icon}
                          </span>
                          <div
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {cat.label}
                          </div>
                          {some && !all && (
                            <span
                              className="hidden sm:inline-flex text-xs rounded-full px-2 h-6 items-center"
                              style={{
                                background: "rgba(84, 87, 255, .10)",
                                color: "var(--primary)",
                              }}
                            >
                              partial
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => selectAllInCategory(cat)}
                            className="text-sm px-3 py-1.5 rounded-lg border"
                            style={{
                              background: "var(--surface-elevated)",
                              borderColor: "var(--border-light)",
                              color: "var(--text-primary)",
                            }}
                          >
                            Select all
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => clearAllInCategory(cat)}
                            className="text-sm px-3 py-1.5 rounded-lg border"
                            style={{
                              background: "var(--surface-elevated)",
                              borderColor: "var(--border-light)",
                              color: "var(--text-primary)",
                            }}
                          >
                            Clear
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => handleSelectAll(cat)}
                            className="text-sm px-3 py-1.5 rounded-lg"
                            style={{
                              background: "var(--primary)",
                              color: "var(--text-inverse)",
                            }}
                          >
                            {all ? "Uncheck all" : "Check all"}
                          </motion.button>
                        </div>
                      </div>

                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {cat.items.map((it) => {
                          const [menuId, action] = it.key.split(".");
                          const hasMenuId = Array.from(selected).some(
                            (item) => {
                              return (
                                item.menu_uid == menuId &&
                                item.mrm_permission
                                  .toLowerCase()
                                  .includes(it.permission.toLowerCase())
                              );
                            }
                          );
                          const checked = hasMenuId;

                          return (
                            <label
                              key={it.key}
                              className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer select-none"
                              style={{
                                background: "var(--surface-elevated)",
                                borderColor: checked
                                  ? "rgba(84,87,255,.45)"
                                  : "var(--border-light)",
                                boxShadow: checked
                                  ? "0 0 0 2px rgba(84,87,255,.12) inset"
                                  : "none",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => togglePermission(it)}
                                className="hidden"
                              />
                              {checked ? (
                                <CheckSquare
                                  className="h-4 w-4"
                                  style={{ color: "var(--primary)" }}
                                />
                              ) : (
                                <Square
                                  className="h-4 w-4"
                                  style={{ color: "var(--text-tertiary)" }}
                                />
                              )}
                              <span
                                className="text-sm"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {it.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {filteredCatalog.length === 0 && (
                  <div
                    className="text-sm py-6 text-center"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    No permissions match “{search}”.
                  </div>
                )}
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
          {/* <div
                        className="rounded-lg border"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
                    >
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6">
                            <h2
                                className="text-base sm:text-lg font-semibold mb-4"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Status
                            </h2>
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStatusActive((s) => !s)}
                                className="flex items-center justify-between gap-3 w-full rounded-lg border px-3 py-3"
                                style={{
                                    background: "var(--surface-elevated)",
                                    borderColor: "var(--border-light)",
                                    color: "var(--text-primary)",
                                }}
                            >
                                <span className="text-sm sm:text-base">
                                    {statusActive ? "Active" : "Inactive"}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={[
                                        "inline-flex h-6 w-10 items-center rounded-full p-0.5 transition-all",
                                        statusActive ? "justify-end" : "justify-start",
                                    ].join(" ")}
                                    style={{
                                        background: statusActive ? "var(--primary)" : "var(--border-light)",
                                    }}
                                >
                                    <span className="h-5 w-5 rounded-full bg-white" />
                                </span>
                            </motion.button>
                        </div>
                    </div> */}

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
                    Role ID
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>{roleId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>Status</span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {statusActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Permissions
                  </span>
                  <span
                    className="inline-flex items-center gap-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Lock className="h-4 w-4" /> {selectedCount}
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
            onClick={() => router.back()}
            className="w-full sm:w-auto px-4 py-3 rounded-lg font-medium border"
            style={{
              background: "var(--surface-elevated)",
              color: "var(--text-primary)",
              borderColor: "var(--border-light)",
            }}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdate}
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium disabled:opacity-60"
            style={{
              background: "var(--primary)",
              color: "var(--text-inverse)",
            }}
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{submitting ? "Saving…" : "Save Changes"}</span>
          </motion.button>
        </div>
      </div>
    </motion.main>
  );
}
