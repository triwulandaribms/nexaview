"use client";

import { motion } from "framer-motion";

const pageFx = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
};

export default function CreateUserSkeleton() {
    return (
        <motion.main
            variants={pageFx}
            initial="hidden"
            animate="show"
            className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--background)]"
        >
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
                        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                    </div>
                </div>
                <div className="h-3 pointer-events-none bg-gradient-to-b from-black/5 to-transparent" />
            </div>

            {/* Info header */}
            <section className="px-0 sm:px-0 lg:px-0">
                <div className="flex items-start gap-3 sm:gap-4 py-4 sm:py-5">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gray-200 dark:bg-gray-400 animate-pulse" />
                    <div className="min-w-0 flex-1">
                        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                        <div className="h-4 w-64 max-w-[70%] bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Left column */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                    {/* Card: User Information */}
                    <div
                        className="rounded-lg border overflow-hidden"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
                    >
                        <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
                        <div className="p-4 sm:p-6">
                            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full name */}
                                <div className="sm:col-span-2">
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                                </div>
                                {/* Email */}
                                <div>
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                                </div>
                                {/* Mobile */}
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                                </div>
                                {/* Role */}
                                <div>
                                    <div className="h-4 w-12 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Security */}
                    <div
                        className="rounded-lg border overflow-hidden"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border-light)" }}
                    >
                        <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />
                        <div className="p-4 sm:p-6">
                            <div className="h-5 w-28 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                                </div>
                                <div>
                                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                                </div>
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
                            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4" />
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
                            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                </div>
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
