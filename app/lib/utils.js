const { NextResponse } = require("next/server");

export function ok(message, data = null) {
    return NextResponse.json({ success: true, message, data }, { status: 200 });
}

export function fail(error, code = 500) {
    return NextResponse.json({ success: false, error, code }, { status: code });
}

const pickError = (d, fb = 'Request failed') => d?.error || d?.message || fb;
export const normalizeAxiosError = (err, fbMsg) => ({
    code: err?.response?.status ?? 500,
    msg: pickError(err?.response?.data, err?.message) || fbMsg,
});

export const formatDate = (iso) => {
    if (!iso) return null;
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso));
};

export function formatFileSize(bytes) {
    if (!bytes || isNaN(bytes)) return "-";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let value = bytes;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(2)} ${units[i]}`;
}


function getExt(name = "") {
    const m = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
    return m ? m[1] : "";
}

export function deriveTypeSimple({ file_type, name, filename }) {
    const mime = (file_type || "").toLowerCase();
    const ext = getExt(name || filename);

    if (mime.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff", "svg"].includes(ext)) {
        return "image";
    }
    if (mime.startsWith("video/") || ["mp4", "m4v", "mov", "avi", "mkv", "webm"].includes(ext)) {
        return "video";
    }
    if (mime.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a", "flac", "aac"].includes(ext)) {
        return "audio";
    }
    const docExts = ["pdf", "doc", "docx", "rtf", "odt", "xls", "xlsx", "csv", "ods", "ppt", "pptx", "odp"];
    const docMimes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/csv"
    ];
    if (docMimes.includes(mime) || docExts.includes(ext)) {
        return "document";
    }
    if (mime.startsWith("text/") || ["txt", "md", "html", "js", "ts", "py", "java", "php", "c", "cpp", "rb", "go"].includes(ext)) {
        return "text";
    }

    return "document";
}
