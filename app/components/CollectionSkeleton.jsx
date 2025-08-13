'use client'

export default function CollectionSkeleton({ viewMode = "grid" }) {
    const HeaderSkeleton = () => (
        <div>
            {/* Title and New Button */}
            <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                <div className="h-10 w-28 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
            </div>

            {/* Search and View Toggle */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative max-w-md">
                    <div className="h-12 w-80 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-20 bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
                </div>
            </div>
        </div>
    );
    const GridSkeletonCard = () => (
        <div
            className="relative rounded-lg border overflow-hidden"
            style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
            }}
        >
            {/* Border Top */}
            <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />

            <div className="p-6">
                {/* Actions Menu */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                    <div className="flex-1">
                        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-2" />
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* View Button */}
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-400 rounded-md animate-pulse" />
            </div>
        </div>
    );

    const ListSkeletonCard = () => (
        <div
            className="relative rounded-lg border overflow-hidden"
            style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-light)",
            }}
        >
            {/* Border Top */}
            <div className="h-1 bg-gray-200 dark:bg-gray-400 animate-pulse" />

            <div className="px-6 pt-8 pb-6">
                {/* Actions Menu */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                </div>

                {/* Horizontal Layout */}
                <div className="flex gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                        </div>
                        <div className="flex items-center gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* View Button */}
                    <div className="flex-shrink-0 flex items-end">
                        <div className="h-10 w-16 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );

    const GridSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="relative">
                    <GridSkeletonCard />
                </div>
            ))}
        </div>
    );

    const ListSkeleton = () => (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="relative">
                    <ListSkeletonCard />
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <HeaderSkeleton />
            {viewMode === "grid" ? <GridSkeleton /> : <ListSkeleton />}
        </div>
    );
};
