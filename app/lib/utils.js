const { NextResponse } = require("next/server");

export function ok(message, data = null) {
    return NextResponse.json({ success: true, message, data }, { status: 200 });
}

export function fail(error, code = 500) {
    return NextResponse.json({ success: false, error, code }, { status: 200 });
}

const pickError = (d, fb = 'Request failed') => d?.error || d?.message || fb;
export const normalizeAxiosError = (err, fbMsg) => ({
    code: err?.response?.status ?? 500,
    msg: pickError(err?.response?.data, err?.message) || fbMsg,
});