export interface Contato {
    telefone?: string;
}

export interface Pessoa {
    id: string;
    nome: string;
    vivo: boolean;
    responsavel: boolean;
    todo?: boolean;
    dataNascimento?: string;
    foto?: string;
    contato?: Contato;
    descendentes: string[];
    conjuge?: string;
    pais?: {
        paiId?: string;
        maeId?: string;
    };
}

export interface PessoaNode extends Pessoa {
    filhos: PessoaNode[];
}

export interface FamiliaData {
    familia: Pessoa[];
}

export interface FamiliaCardProps {
    pessoa: PessoaNode;
    nivel: number;
    isEditEnabled: boolean;
    onEdit: (pessoa: Pessoa) => void;
    onDelete: (pessoa: Pessoa) => void;
    getPessoaNome: (id?: string) => string;
    onAddDescendente: (pai: Pessoa) => void;
}

export interface PessoaFormProps {
    pessoa: Partial<Pessoa>;
    setPessoa: React.Dispatch<React.SetStateAction<Partial<Pessoa>>>;
    familiaData: FamiliaData;
    editandoId: string | null;
} 