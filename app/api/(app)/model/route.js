import { cookies } from 'next/headers';
import axios from 'axios';
import { ok, fail, normalizeAxiosError, } from '@/app/lib/utils';

const PROVIDER_NAME = { openai: "OpenAI", anthropic: "Anthropic", deepseek: "DeepSeek", mistral: "Mistral", qwen: "Qwen", ollama: "Ollama" };
const PROVIDER_ICON = { openai: "bot", anthropic: "sparkles", deepseek: "rocket", mistral: "zap", qwen: "brain", ollama: "database" };

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail("Server configuration error. Please contact administrator.", 500);

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const idToken = cookieStore.get("id_token")?.value;

        const { data } = await axios.get(`${baseURL}/api/model`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
                "x-id-token": idToken || "",
            },
            timeout: 30_000,
            validateStatus: (s) => s >= 200 && s < 300,
        });

        const list = Array.isArray(data?.data) ? data.data : [];
        console.log(list);

        const byProvider = {};

        for (const item of list) {
            const pid = String(item.provider || "").toLowerCase();
            if (!byProvider[pid]) {
                byProvider[pid] = {
                    id: pid,
                    name: PROVIDER_NAME[pid] || pid,
                    icon: PROVIDER_ICON[pid] || "bot",
                    connected: false,
                    apiKey: null,
                    apiKeyPreview: item.api_key_preview ?? null,
                    models: [],
                };
            }

            byProvider[pid].models.push({
                id: item.model_id,
                name: item.name,
                enabled: !!item.is_active,
                is_premium: !!item.is_premium,
                pricing: item.pricing ?? {},
                capabilities: item.capabilities ?? {},
                metadata: item.metadata ?? {},
                // data asli nya ynag di bawah 
                _id: item.id,
                _created_at: item.created_at,
                _updated_at: item.updated_at,
            });

            if (item.is_active || item.api_key_preview) {
                byProvider[pid].connected = true;
            }
        }
        const order = ["openai", "anthropic", "deepseek", "mistral", "qwen", "ollama"];
        const result = Object.values(byProvider).sort((a, b) => {
            const ia = order.indexOf(a.id);
            const ib = order.indexOf(b.id);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.name.localeCompare(b.name);
        });

        return ok("Fetched dataset list successfully.", result);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, "Failed to fetch datasets");
        return fail(msg, code);
    }
}

export async function POST(request) {

    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);


    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;
    const idToken = cookieStore.get('id_token')?.value;
    const formData = await request.formData();

    try {
        const { data } = await axios.post(`${baseURL}/api/dataset`, formData, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('Dataset successfully uploaded.', data);
    } catch (err) {
        console.log("Erro post dataset = >>> ", err?.message);

        const { code, msg } = normalizeAxiosError(err, 'Failed to upload dataset');

        return fail(msg, code);
    }
}
