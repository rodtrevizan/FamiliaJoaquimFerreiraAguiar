export interface Contato {
    telefone?: string;
    email?: string;
}

export interface Pessoa {
    id: string;
    nome: string;
    vivo: boolean;
    responsavel: boolean;
    dataNascimento?: string;
    foto?: string;
    contato?: Contato;
    descendentes: string[];
    conjuge?: string;
    pais?: {
        paiId?: string;
        maeId?: string;
        pai?: string;
        mae?: string;
    };
}

export interface FamiliaData {
    familia: Pessoa[];
} 