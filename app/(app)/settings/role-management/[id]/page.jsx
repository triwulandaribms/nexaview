"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    ChevronLeft,
    Shield,
    Lock,
    ListChecks,
    PencilLine,
    Trash2,
    Loader2,
    FileText,
    Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import RoleSkeletonLoader from "@/app/components/RoleSkeletonLoader";
import { rbApi } from "@/app/lib/rolesBaseApi";

const pageFx = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.25 } } };
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function RoleDetailPage() {
    const router = useRouter();
    const params = useParams();
    const roleId = params?.id || "1";

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [catalog, setCatalog] = useState(null);

    const [forceSkeleton, setForceSkeleton] = useState(true);
    const timerRef = useRef(null);

    if (forceSkeleton && !timerRef.current) {
        timerRef.current = setTimeout(() => setForceSkeleton(false), 1200);
    }
    useEffect(() => {
        async function fetchRoleDetail() {
            try {
                const controllerRef = new AbortController();
                const { signal } = controllerRef;
                const { data } = await rbApi.detail(roleId, signal);

                if (data?.permissions) {
                    const groupedPermissions = (data.permissions || []).reduce((acc, perm) => {

                        if (!acc[perm.menu_name]) {
                            acc[perm.menu_name] = {
                                key: perm.menu_uid,
                                label: perm.menu_name,
                                icon: getIconForMenu(perm.menu_name),
                                items: [],
                            };
                        }
                        acc[perm.menu_name].items.push({
                            key: perm.menu_id,
                            label: `${perm.menu_name} - ${perm.mrm_permission}`,
                            permissions: [
                                perm.can_create ? "Create" : null,
                                perm.can_read ? "Read" : null,
                                perm.can_update ? "Update" : null,
                                perm.can_delete ? "Delete" : null,
                            ].filter(Boolean).join(', '),
                        });
                        return acc;
                    }, {});

                    const newCatalog = Object.values(groupedPermissions);

                    setRole(data);
                    setCatalog(newCatalog);
                } else {
                    setError("Permissions data is missing.");
                }
            } catch (error) {
                setError("In a few minutes, try again. Your internet connection is erratic.");
                console.error(error);
            } finally {
                setForceSkeleton(false);
            }
        }

        fetchRoleDetail();
    }, [roleId]);


    const getIconForMenu = (menuName) => {
        switch (menuName) {
            case "Users":
                return <Users className="h-4 w-4" />;
            case "Roles":
                return <Shield className="h-4 w-4" />;
            case "Knowledge Base":
                return <FileText className="h-4 w-4" />;
            default:
                return <Shield className="h-4 w-4" />; // Default icon
        }
    };

    function openDelete() { setConfirmOpen(true); }
    function closeDelete() { if (!deleting) setConfirmOpen(false); }

    async function handleConfirmDelete() {
        setDeleting(true);
        try {
            const controller = new AbortController();
            const { signal } = controller;

            await rbApi.delete(roleId, { signal });

            await new Promise((r) => setTimeout(r, 900));

            setDeleting(false);
            setConfirmOpen(false);
            router.push("/role-management");
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Request was aborted");
            }
            setDeleting(false);
        }
    }
    function goEdit() {
        router.push(`/role-management/update/${roleId}/`);
    }


    const selectedSet = new Set(role?.permissions || []);
    const totalSelected = selectedSet.size;


    const categoriesWithSelection = (catalog || []).map(cat => {
        const selectedSetIds = Array.from(selectedSet).map(item => item.menu_id || item.menu_uid);

        const selected = cat.items.filter(it => {
            return selectedSetIds.includes(it.key)
        });

        return {
            ...cat,
            selected,
            all: selected.length === cat.items.length,
            some: selected.length > 0 && selected.length < cat.items.length,
        };
    }).filter(cat => cat.selected.length > 0);



    if (forceSkeleton || !role) {
        return (
            <RoleSkeletonLoader />
        );
    }

    return (
        <motion.main variants={pageFx} initial="hidden" animate="show"
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
                    <div className="flex items-center gap-3">
                        <button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            aria-label="Back"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Role Details
                        </button>
                    </div>
                </motion.div>
            </div>

            <motion.section variants={fadeUp} initial="hidden" animate="show" >
                <div className="flex items-start gap-3 sm:gap-4 py-4 sm:py-5">
                    <motion.div whileHover={{ scale: 1.02 }} className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
                        <Shield className="h-7 w-7 text-white" />
                    </motion.div>
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-semibold leading-6" style={{ color: "var(--text-primary)" }}>
                            {role?.mr_name || "-"}
                        </h2>
                        <div className="text-sm leading-5 sm:flex sm:flex-wrap sm:items-center sm:gap-2" style={{ color: "var(--text-secondary)" }}>
                            <span className="block sm:inline break-words">Created by {role?.createdBy || '-'}</span>
                            <span className="hidden sm:inline" aria-hidden="true">•</span>
                            <span className="block sm:inline whitespace-nowrap">{totalSelected} permissions</span>
                        </div>
                    </div>
                </div>
            </motion.section>

            <form className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">

                <motion.section variants={fadeUp} initial="hidden" animate="show" className="xl:col-span-2 space-y-4 sm:space-y-6">

                    <div className="rounded-lg border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "var(--surface-secondary)" }}>
                                    <FileText className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Description</div>
                                    <div className="font-medium" style={{ color: "var(--text-primary)" }}>
                                        {role?.mr_description || "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h2 className="text-base sm:text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                                    Permissions
                                </h2>
                                <div className="hidden sm:inline-flex items-center gap-2 rounded-full px-3 h-8 text-sm"
                                    style={{ background: "var(--surface-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-light)" }}>
                                    <ListChecks className="h-4 w-4" />
                                    {totalSelected} selected
                                </div>
                            </div>

                            <div className="space-y-4">
                                {categoriesWithSelection.map((cat) => (
                                    <div key={cat.key} className="rounded-lg border" style={{ borderColor: "var(--border-light)", background: "var(--surface-elevated)" }}>
                                        <div className="flex items-center justify-between p-3 sm:p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg" style={{ background: "var(--surface-secondary)" }}>
                                                    {cat.icon}
                                                </span>
                                                <div className="font-medium" style={{ color: "var(--text-primary)" }}>{cat.label}</div>
                                                {cat.some && !cat.all && (
                                                    <span
                                                        className="hidden sm:inline-flex text-xs rounded-full px-2 h-6 items-center"
                                                        style={{ background: "rgba(84, 87, 255, .10)", color: "var(--primary)" }}
                                                    >
                                                        partial
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs px-2 h-6 inline-flex items-center rounded-full"
                                                style={{ background: "var(--surface-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border-light)" }}>
                                                {cat.selected.length}/{cat.items.length}
                                            </div>
                                        </div>

                                        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                                            <div className="flex flex-wrap gap-2">
                                                {cat.selected.map((it) => (
                                                    <span key={it.key}
                                                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
                                                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)", color: "var(--text-primary)" }}>
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--primary)" }} />
                                                        {it.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {categoriesWithSelection.length === 0 && (
                                    <div className="text-sm py-6 text-center" style={{ color: "var(--text-secondary)" }}>
                                        No permissions assigned to this role.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.aside variants={fadeUp} initial="hidden" animate="show" className="xl:col-span-1 space-y-4 sm:space-y-6">

                    {/* <div className="rounded-lg border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                                Status
                            </h2>
                            <div className="inline-flex items-center gap-2 rounded-full px-3 h-8 font-medium"
                                style={{
                                    background: statusIsActive ? "rgba(84, 87, 255, .12)" : "rgba(148, 163, 184, .15)",
                                    color: statusIsActive ? "var(--primary)" : "var(--text-secondary)",
                                    border: `1px solid ${statusIsActive ? "rgba(84,87,255,.3)" : "var(--border-light)"}`
                                }}>
                                <span className="w-2 h-2 rounded-full"
                                    style={{ background: statusIsActive ? "var(--primary)" : "var(--border-light)" }} />
                                {statusIsActive ? "Active" : "Inactive"}
                            </div>
                        </div>
                    </div> */}

                    <div className="rounded-lg border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                                Meta
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Role ID</span>
                                    <span style={{ color: "var(--text-primary)" }}>{role.mr_uid}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Created</span>
                                    <span style={{ color: "var(--text-primary)" }}>{role?.created_at}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Last updated</span>
                                    <span style={{ color: "var(--text-primary)" }}>{role?.updated_at || role?.created_at || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Assigned users</span>
                                    <span className="inline-flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
                                        <Users className="h-4 w-4" /> {role?.members || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Permissions</span>
                                    <span className="inline-flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
                                        <Lock className="h-4 w-4" /> {totalSelected}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.aside>
            </form>

            <div className="sticky bottom-0 left-0 right-0 mt-6 border-t backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 sm:bg-transparent sm:border-0" style={{ borderColor: "var(--border-light)" }}>
                <div className="max-w-screen-2xl mx-auto p-3 sm:p-0 sm:pt-6 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={openDelete}
                        className="w-full sm:w-auto px-4 py-3 rounded-lg font-medium border"
                        style={{ background: "var(--surface-elevated)", color: "var(--text-primary)", borderColor: "var(--border-light)" }}
                    >
                        <span className="inline-flex items-center gap-2 justify-center">
                            <Trash2 className="h-5 w-5" /> Delete
                        </span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={goEdit}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium"
                        style={{ background: "var(--primary)", color: "var(--text-inverse)" }}
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
                                style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
                            >
                                <div className="flex items-center gap-3 px-5 pt-5">
                                    <div className="p-2 rounded-xl" style={{ background: "var(--surface-secondary)" }}>
                                        <Trash2 className="h-5 w-5" style={{ color: "var(--primary)" }} />
                                    </div>
                                    <h2 id="delete-title" className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                                        Delete Role?
                                    </h2>
                                </div>

                                <div className="px-5 pt-3 pb-5">
                                    <p id="delete-desc" className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                        This action cannot be undone. You will delete:
                                    </p>

                                    <div className="mt-3 rounded-lg border px-4 py-3 text-sm"
                                        style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", background: "var(--surface-secondary)" }}>
                                        <span className="font-medium">{role.mr_name || '-'}</span>
                                        <div className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                                            {role.members || "0"} members  • {totalSelected} permissions • {role.created_at}
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 sm:flex sm:justify-end gap-2 sm:gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            onClick={closeDelete}
                                            disabled={deleting}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl border font-medium transition-all disabled:opacity-60"
                                            style={{ background: "var(--surface-elevated)", color: "var(--text-primary)", borderColor: "var(--border-light)" }}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            onClick={handleConfirmDelete}
                                            disabled={deleting}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-medium transition-all disabled:opacity-60"
                                            style={{ background: "var(--primary)", color: "var(--text-inverse)" }}
                                        >
                                            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
