// app/user-management/[id]/edit/page.jsx
"use client";

import React, { useRef, useState } from "react";
import {
    Save,
    Loader2,
    Eye,
    EyeOff,
    User as UserIcon,
    ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import CreateUserSkeleton from "@/app/components/CreateUserSkeleton"; // reuse skeleton

const pageFx = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.25 } } };
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id || "1";

    // ===== form state =====
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [role, setRole] = useState("Member");
    const [statusActive, setStatusActive] = useState(true);

    const [password, setPassword] = useState("");          // optional on update
    const [confirm, setConfirm] = useState("");          // optional on update
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // ===== Skeleton gating (forced 1.5s) =====
    const [forceSkeleton, setForceSkeleton] = useState(true);
    const forceTimerRef = useRef(null);
    if (forceSkeleton && !forceTimerRef.current) {
        forceTimerRef.current = setTimeout(() => {
            setForceSkeleton(false);
        }, 1500);
    }

    // ===== Mock "fetched" user (dipakai setelah skeleton hilang) =====
    const hydratedRef = useRef(false);
    if (!forceSkeleton && !hydratedRef.current) {
        const mockUser = {
            id: userId,
            fullName: "John Doe",
            email: "john@example.com",
            mobile: "+62 812-3456-7890",
            role: "Admin",
            statusActive: true,
        };
        setFullName(mockUser.fullName);
        setEmail(mockUser.email);
        setMobile(mockUser.mobile);
        setRole(mockUser.role);
        setStatusActive(mockUser.statusActive);
        hydratedRef.current = true;
    }

    // ===== helpers & validation =====
    const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);
    const phoneOk = (v) => /^[0-9+\-\s()]{8,20}$/.test(v.trim());
    const passOk = (v) => v.length >= 6;

    function validate() {
        if (!fullName || fullName.trim().length < 3) return "Full name must be at least 3 characters.";
        if (!emailOk(email)) return "Please enter a valid email address.";
        if (!phoneOk(mobile)) return "Please enter a valid mobile number.";
        if (!role) return "Role is required.";
        // Password OPTIONAL on update – only validate if diisi
        if (password && !passOk(password)) return "Password must be at least 6 characters.";
        if (password || confirm) {
            if (password !== confirm) return "Password confirmation does not match.";
        }
        return null;
    }

    async function handleUpdate(e) {
        e.preventDefault();
        if (submitting) return;

        const err = validate();
        if (err) { setErrorMsg(err); return; }

        setSubmitting(true);
        setErrorMsg("");
        try {
            // const payload = {
            //   id: userId,
            //   full_name: fullName,
            //   email, mobile, role,
            //   status: statusActive ? "active" : "inactive",
            //   ...(password ? { password } : {}),
            // };
            // await userApi.update(userId, payload);
            await new Promise((r) => setTimeout(r, 800));
            router.push("/user-management");
        } catch (e) {
            setErrorMsg(e?.message || "Failed to update user.");
            setSubmitting(false);
        }
    }

    if (forceSkeleton) {
        return <CreateUserSkeleton />;
    }

    const currentUserEmail = "you@example.com"; // ganti jika ada session

    return (
        <motion.main
            variants={pageFx}
            initial="hidden"
            animate="show"
            className="min-h-screen p-4 sm:p-6 lg:p-5  bg-[var(--background)]"
        >
            {/* ===== Sticky Top Header ===== */}
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
                        Edit User
                    </button>
                </motion.div>

                {/* soft gradient ke konten */}
                {/* <div className="h-3 pointer-events-none bg-gradient-to-b from-black/5 to-transparent" /> */}
            </div>

            {/* ===== Info Header ===== */}
            <motion.section variants={fadeUp} initial="hidden" animate="show"
            >
                <div className="flex items-start gap-3 sm:gap-4 py-4 sm:py-5">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center"
                        style={{ background: "var(--primary)" }}
                    >
                        <UserIcon className="h-7 w-7 text-white" />
                    </motion.div>
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-semibold leading-6" style={{ color: "var(--text-primary)" }}>
                            Update User
                        </h2>
                        <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                            Editing ID: {userId} • Current role: {role}
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Error banner */}
            {errorMsg && (
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="mb-4 rounded-lg border px-4 py-3 text-sm"
                    style={{ background: "rgba(243, 18, 96, 0.06)", color: "var(--text-primary)", borderColor: "var(--border-light)" }}
                >
                    {errorMsg}
                </motion.div>
            )}

            {/* ===== Form grid ===== */}
            <form onSubmit={handleUpdate} className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Left column */}
                <motion.section variants={fadeUp} initial="hidden" animate="show" className="xl:col-span-2 space-y-4 sm:space-y-6">
                    {/* User Info */}
                    <div className="rounded-lg border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                                User Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full name */}
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Full name</label>
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g. John Doe"
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

                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
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

                                {/* Mobile number */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Mobile number</label>
                                    <input
                                        type="tel"
                                        inputMode="tel"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        placeholder="e.g. +62 812-3456-7890"
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

                                {/* Role */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full rounded-lg border px-3 py-3 text-sm sm:text-base focus:outline-none focus:ring-2"
                                        style={{
                                            background: "var(--surface-elevated)",
                                            borderColor: "var(--border-light)",
                                            color: "var(--text-primary)",
                                            "--tw-ring-color": "var(--primary)",
                                        }}
                                    >
                                        <option>Admin</option>
                                        <option>Member</option>
                                        <option>Viewer</option>
                                        <option>Custom</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security (optional on update) */}
                    <div className="rounded-lg border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                                Security
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Password (optional)</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Leave blank to keep current"
                                            className="w-full rounded-lg border px-3 py-3 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2"
                                            style={{
                                                background: "var(--surface-elevated)",
                                                borderColor: "var(--border-light)",
                                                color: "var(--text-primary)",
                                                "--tw-ring-color": "var(--primary)",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass((s) => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                                            aria-label={showPass ? "Hide password" : "Show password"}
                                        >
                                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Confirm Password (optional)</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            placeholder="Leave blank to keep current"
                                            className="w-full rounded-lg border px-3 py-3 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2"
                                            style={{
                                                background: "var(--surface-elevated)",
                                                borderColor: "var(--border-light)",
                                                color: "var(--text-primary)",
                                                "--tw-ring-color": "var(--primary)",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((s) => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                                            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                        >
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Right column: Status + Meta */}
                <motion.aside variants={fadeUp} initial="hidden" animate="show" className="xl:col-span-1 space-y-4 sm:space-y-6">
                    {/* Status */}
                    <div className="rounded-lg border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                                Status
                            </h2>
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStatusActive((s) => !s)}
                                className="flex items-center justify-between gap-3 w-full rounded-lg border px-3 py-3"
                                style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)", color: "var(--text-primary)" }}
                            >
                                <span className="text-sm sm:text-base">{statusActive ? "Active" : "Inactive"}</span>
                                <span
                                    aria-hidden="true"
                                    className={["inline-flex h-6 w-10 items-center rounded-full p-0.5 transition-all", statusActive ? "justify-end" : "justify-start"].join(" ")}
                                    style={{ background: statusActive ? "var(--primary)" : "var(--border-light)" }}
                                >
                                    <span className="h-5 w-5 rounded-full bg-white" />
                                </span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="rounded-lg border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}>
                        <div className="h-1" style={{ background: "var(--primary)" }} />
                        <div className="p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                                Meta
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>User ID</span>
                                    <span style={{ color: "var(--text-primary)" }}>{userId}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Last updated</span>
                                    <span style={{ color: "var(--text-primary)" }}>{new Date().toISOString().slice(0, 10)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Status</span>
                                    <span style={{ color: "var(--text-primary)" }}>{statusActive ? "Active" : "Inactive"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.aside>
            </form>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 left-0 right-0 mt-6 border-t  supports-[backdrop-filter]:bg-white/60 bg-white/90 sm:bg-transparent sm:border-0" style={{ borderColor: "var(--border-light)" }}>
                <div className="max-w-screen-2xl mx-auto p-3 sm:p-0 sm:pt-6 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => router.back()}
                        className="w-full sm:w-auto px-4 py-3 rounded-lg font-medium border"
                        style={{ background: "var(--surface-elevated)", color: "var(--text-primary)", borderColor: "var(--border-light)" }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        type="submit"
                        onClick={handleUpdate}
                        disabled={submitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium disabled:opacity-60"
                        style={{ background: "var(--primary)", color: "var(--text-inverse)" }}
                    >
                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        <span>{submitting ? "Saving…" : "Save Changes"}</span>
                    </motion.button>
                </div>
            </div>
        </motion.main>
    );
}
