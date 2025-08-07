'use client';
import React, { useEffect, useState } from 'react';

export default function Alert({
    variant = 'error',
    children,
    autoDismiss = true,
    dismissAfter = 8_000,
    onDismiss,
}) {
    const palette = {
        error: { bg: 'rgba(255, 59, 59, .08)', text: '#c53030', border: 'rgba(255, 59, 59, .4)' },
        success: { bg: 'rgba(16, 185, 129, .08)', text: '#059669', border: 'rgba(16, 185, 129, .4)' },
        info: { bg: 'rgba(37, 99, 235, .08)', text: '#2563EB', border: 'rgba(37, 99, 235, .4)' },
    }[variant] ?? { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };

    const [visible, setVisible] = useState(true);

    // auto-dismiss
    useEffect(() => {
        if (!autoDismiss) return;
        const t = setTimeout(() => handleClose(), dismissAfter);
        return () => clearTimeout(t);
    }, [autoDismiss, dismissAfter]);

    function handleClose() {
        setVisible(false);
        onDismiss?.();
    }

    if (!visible) return null;

    return (
        <div
            className="mb-4 rounded-md px-4 py-3 text-sm flex items-start gap-2 relative"
            style={{
                background: palette.bg,
                color: palette.text,
                border: `1px solid ${palette.border}`,
            }}
        >
            <span className="flex-1">{children}</span>

            {/* close button (optional) */}
            <button
                onClick={handleClose}
                aria-label="Dismiss alert"
                className="ml-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: palette.text }}
            >
                x
            </button>
        </div>
    );
}
