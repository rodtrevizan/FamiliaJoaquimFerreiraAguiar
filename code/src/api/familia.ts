// salvar dados da familia localmente!!!!

import type { FamiliaData } from "../types/familia";
import fs from "fs/promises";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "store", "familia.json");

export async function GET() {
    try {
        const data = await fs.readFile(STORE_PATH, "utf-8");
        return new Response(data, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ familia: [] }), {
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(request: Request) {
    try {
        const data: FamiliaData = await request.json();
        await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2));
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Erro ao salvar dados" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
} 