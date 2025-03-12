# Documentação da Refatoração e Diretrizes Futuras

## 1. Estrutura Atual
```
src/
├── components/
│   ├── familia/
│   │   ├── FamiliaCard/
│   │   │   ├── index.tsx
│   │   │   ├── FamiliaCardView.tsx
│   │   │   └── FamiliaCardChildren.tsx
│   │   ├── PessoaForm/
│   │   │   └── index.tsx
│   │   └── FamiliaManager/
│   │       ├── index.tsx
│   │       ├── FamiliaHeader.tsx
│   │       └── FamiliaModal.tsx
├── hooks/
│   └── useFamilia.ts
├── utils/
│   └── familiaUtils.ts
└── types/
    └── familia.ts
```

## 2. Princípios da Refatoração Realizada

1. **Separação de Responsabilidades**
   - Componentes visuais separados da lógica
   - Estado global gerenciado via hooks
   - Utilitários em módulos específicos
   - Tipos centralizados

2. **Componentização**
   - Componentes pequenos e reutilizáveis
   - Props bem definidas
   - Separação entre container e apresentação

3. **Gerenciamento de Estado**
   - Hook customizado para lógica de negócio
   - Estado local apenas para UI
   - Funções CRUD centralizadas

## 3. Próximos Passos para Inventário

### 3.1 Novas Entidades e Tipos
```typescript:src/types/inventario.ts
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
```

### 3.2 Nova Estrutura de Arquivos

```
src/
├── features/
│   ├── familia/
│   │   └── [estrutura atual]
│   └── inventario/
│       ├── components/
│       │   ├── InventarioForm/
│       │   ├── HerdeirosList/
│       │   └── DocumentosUpload/
│       ├── hooks/
│       │   └── useInventario.ts
│       └── utils/
│           └── inventarioUtils.ts
├── shared/
│   ├── components/
│   │   └── DocumentViewer/
│   └── utils/
│       ├── dateUtils.ts
│       └── documentUtils.ts
└── types/
    ├── familia.ts
    └── inventario.ts
```

### 3.3 Novos Hooks Necessários

```typescript:src/features/inventario/hooks/useInventario.ts
function useInventario() {
  // Gerenciamento do inventário
  // CRUD de herdeiros
  // Upload de documentos
  // Validações
}

function useRepresentacao() {
  // Gerenciamento de representações legais
  // Validação de documentos
  // Histórico de representações
}

function useParentesco() {
  // Gerenciamento de relações
  // Validação de períodos
  // Histórico de alterações
}
```

## 4. Diretrizes de Implementação

1. **Validações**
   - Criar validadores específicos para cada tipo de documento
   - Validar datas de representação
   - Verificar conflitos de representação

2. **Segurança**
   - Implementar controle de acesso por papel
   - Registrar histórico de alterações
   - Validar documentos comprobatórios

3. **UI/UX**
   - Criar wizards para processos complexos
   - Implementar visualização hierárquica de representações
   - Adicionar timeline de eventos do inventário

4. **Performance**
   - Lazy loading de documentos
   - Paginação de históricos
   - Caching de dados frequentes

## 5. Próximos Passos Recomendados

1. Implementar sistema de relações de parentesco
2. Criar gerenciamento de representações legais
3. Desenvolver módulo de documentos
4. Implementar fluxo de inventário
5. Adicionar validações e regras de negócio
6. Criar interfaces de usuário específicas

## 6. Considerações Técnicas

1. **Banco de Dados**
   - Considerar modelo de dados para histórico
   - Implementar soft delete
   - Criar índices apropriados

2. **API**
   - Versionar endpoints
   - Implementar validações server-side
   - Criar documentação OpenAPI

3. **Frontend**
   - Implementar gerenciamento de estado mais robusto (Redux/Zustand)
   - Criar sistema de formulários dinâmicos
   - Implementar cache de queries (React Query)

Esta documentação serve como guia para o crescimento organizado do sistema, mantendo a coesão e os princípios estabelecidos na refatoração inicial.
