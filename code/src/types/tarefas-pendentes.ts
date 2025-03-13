export interface TarefaPendente {
    pessoaId: string;
    todo: boolean;
}

export interface TarefasPendentesData {
    tarefas: TarefaPendente[];
} 