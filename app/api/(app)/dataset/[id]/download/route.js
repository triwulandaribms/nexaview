import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function pickFilename(h) {
    const cd = h["content-disposition"] || "";
    const xf = h["x-filename"];
    if (xf) return xf;

    const m = cd.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)/i);
    if (m?.[1]) return decodeURIComponent(m[1].replace(/"/g, ""));
    return null;
}

export async function GET(_req, { params }) {
    const { id } = await params;
    const base = process.env.API_BASE_URL;
    if (!base) {
        return new NextResponse("Server configuration error", { status: 500 });
    }

    try {
        const cookieStore = await cookies();

        const token = cookieStore.get('token')?.value;

        const upstream = await axios.get(`${base}/api/dataset/${id}/download`, {
            responseType: "arraybuffer",
            timeout: 60_000,
            headers: {
                Authorization: `Bearer ${token || ''}`,
            },
            validateStatus: (s) => s >= 200 && s < 300,
        });

        const headers = upstream.headers || {};
        const contentType = headers["content-type"] || "application/octet-stream";
        const filename = pickFilename(headers) || `dataset-${id}`;

        const contentLength =
            headers["content-length"] || String(upstream.data?.byteLength || 0);

        return new NextResponse(upstream.data, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": contentLength,
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err) {
        const msg =
            (err.response && (await err.response?.data?.toString?.())) ||
            err.message ||
            "Failed to download";
        const status = err.response?.status || 502;
        return new NextResponse(msg, { status });
    }
}
