export interface Herdeiro {
    id: string;
    nome: string;
    ramo: string;
    responsavel?: string;
    todosConcluidos: { [todoId: string]: boolean };
}

export interface Todo {
    id: string;
    descricao: string;
    bloqueado: boolean;
}

export interface Partilha {
    id: string;
    falecido: string;
    dataInicio: Date;
    herdeiros: Herdeiro[];
    todos: Todo[];
    status: 'PENDENTE' | 'CONCLUIDO';
}

export interface PartilhaModalProps {
    open: boolean;
    onClose: () => void;
    partilha: Partilha;
} 