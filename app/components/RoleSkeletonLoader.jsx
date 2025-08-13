"use client";

import { motion } from "framer-motion";

const pageFx = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
};

export default function RoleSkeletonLoader() {
    return (
        <motion.main
            variants={pageFx}
            initial="hidden"
            animate="show"
            className="min-h-screen p-4 sm:p-6 lg:p-5  bg-[var(--background)]"   >
            {/* Sticky header */}
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
                        <div className="h-6 w-36 bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                    </div>
                </div>
                <div className="h-3 pointer-events-none bg-gradient-to-b from-black/5 to-transparent" />
            </div>

            {/* Info header */}
            <section >
                <div className="flex items-start gap-3 sm:gap-4 py-4 sm:py-5">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gray-200 dark:bg-gray-400 animate-pulse" />
                    <div className="min-w-0 flex-1">
                        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                        <div className="h-4 w-64 max-w-[70%] bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Left column */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                    {/* Card: Role Information */}
                    <div
                        className="rounded-lg border overflow-hidden"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
                    >
                        <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
                        <div className="p-4 sm:p-6">
                            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4" />
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                                </div>
                                <div>
                                    <div className="h-4 w-36 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                                    <div className="h-24 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Permissions */}
                    <div
                        className="rounded-lg border overflow-hidden"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
                    >
                        <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="h-5 w-28 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                <div className="hidden sm:block h-8 w-28 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse" />
                            </div>

                            {/* Search box */}
                            <div className="h-10 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse mb-4" />

                            {/* Categories (3 placeholders) */}
                            <div className="space-y-4">
                                {[1, 2, 3].map((c) => (
                                    <div
                                        key={c}
                                        className="rounded-lg border"
                                        style={{
                                            borderColor: "var(--border-light)",
                                            background: "var(--surface-elevated)",
                                        }}
                                    >
                                        <div className="p-3 sm:p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-400 animate-pulse" />
                                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                                <div className="h-6 w-14 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse ml-2" />
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2">
                                                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                                                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                                                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-10 w-full rounded-lg border animate-pulse"
                                                    style={{ borderColor: "var(--border-light)", background: "var(--surface-elevated)" }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="xl:col-span-1 space-y-4 sm:space-y-6">
                    {/* Status */}
                    <div
                        className="rounded-lg border overflow-hidden"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
                    >
                        <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
                        <div className="p-4 sm:p-6">
                            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4" />
                            <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                        </div>
                    </div>

                    {/* Meta */}
                    <div
                        className="rounded-lg border overflow-hidden"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
                    >
                        <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
                        <div className="p-4 sm:p-6">
                            <div className="h-5 w-14 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between gap-3">
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky action bar skeleton */}
            <div
                className="sticky bottom-0 left-0 right-0 mt-6 border-t bg-white/90 sm:bg-transparent sm:border-0"
                style={{ borderColor: "var(--border-light)" }}
            >
                <div className="max-w-screen-2xl mx-auto p-3 sm:p-0 sm:pt-6 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
                    <div className="h-11 w-full sm:w-28 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                    <div className="h-11 w-full sm:w-36 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                </div>
            </div>
        </motion.main>
    );
}
