import type { Pessoa, PessoaNode } from "../types/familia";

export function construirArvoreGenealogica(pessoas: Pessoa[]): PessoaNode[] {
    const pessoasMap = new Map<string, PessoaNode>();
    pessoas.forEach(p => {
        pessoasMap.set(p.id, { ...p, filhos: [] });
    });

    const raizes: PessoaNode[] = [];

    pessoasMap.forEach(pessoa => {
        if (!pessoa.pais?.paiId && !pessoa.pais?.maeId) {
            raizes.push(pessoa);
        } else {
            if (pessoa.pais?.paiId) {
                const pai = pessoasMap.get(pessoa.pais.paiId);
                if (pai) pai.filhos.push(pessoa);
            }
            if (pessoa.pais?.maeId && !pessoa.pais?.paiId) {
                const mae = pessoasMap.get(pessoa.pais.maeId);
                if (mae) mae.filhos.push(pessoa);
            }
        }
    });

    return raizes;
}

export function formatPhoneNumber(phone?: string): string {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
}

export function getResponsaveis(p: PessoaNode, visitados = new Set<string>()): string[] {
    if (visitados.has(p.id)) return [];
    visitados.add(p.id);

    const responsaveis: string[] = [];

    for (const filho of p.filhos) {
        if (filho.responsavel) {
            responsaveis.push(filho.nome);

            if (!filho.vivo) {
                const responsaveisFilho = getResponsaveis(filho, visitados);
                responsaveis.push(...responsaveisFilho);
            }
        }
    }

    return responsaveis;
} 