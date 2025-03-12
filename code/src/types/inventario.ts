interface RelacaoParentesco {
    tipo: 'CONJUGE' | 'EX_CONJUGE' | 'VIUVA_HERDEIRA' | 'VIUVA_MEEIRA';
    dataInicio: Date;
    dataFim?: Date;
    documentoComprobatorio?: string;
}

interface Representacao {
    tipo: 'HERDEIRO' | 'TUTOR' | 'PROCURADOR';
    representante: string;
    representado: string;
    documentoComprobatorio: string;
    dataInicio: Date;
    dataFim?: Date;
}

interface Inventario {
    id: string;
    falecido: string;
    dataObito: Date;
    herdeiros: Array<{
        pessoaId: string;
        tipo: 'DESCENDENTE' | 'CONJUGE' | 'ASCENDENTE';
        porRepresentacao?: boolean;
        representacaoId?: string;
    }>;
    documentos: Array<{
        tipo: string;
        url: string;
        dataUpload: Date;
    }>;
    status: 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
} 