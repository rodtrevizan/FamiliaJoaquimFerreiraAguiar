import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TarefasPendentesData, TarefaPendente } from '../types/tarefas-pendentes';

interface TarefasContextType {
  tarefas: TarefaPendente[];
  toggleTodo: (pessoaId: string, todo: boolean) => Promise<void>;
  getTodo: (pessoaId: string) => boolean;
  loading: boolean;
}

const TarefasContext = createContext<TarefasContextType | undefined>(undefined);

export function TarefasProvider({ children }: { children: React.ReactNode }) {
  const [tarefasData, setTarefasData] = useState<TarefasPendentesData>({ tarefas: [] });
  const [loading, setLoading] = useState(true);

  const toggleTodo = async (pessoaId: string, todo: boolean) => {
    const tarefaExistente = tarefasData.tarefas.find(t => t.pessoaId === pessoaId);
    
    // Se já existe uma tarefa e estamos desmarcando, ou não existe e estamos marcando
    if ((tarefaExistente && !todo) || (!tarefaExistente && todo)) {
      const novasTarefas = {
        tarefas: todo 
          ? [...tarefasData.tarefas, { pessoaId, todo }]
          : tarefasData.tarefas.filter(t => t.pessoaId !== pessoaId)
      };

      try {
        const response = await fetch("/api/tarefas-pendentes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novasTarefas),
        });

        if (!response.ok) throw new Error("Erro ao salvar dados");

        const data = await response.json();
        setTarefasData(data);
      } catch (error) {
        console.error("Erro ao salvar:", error);
      }
    }
  };

  const getTodo = (pessoaId: string): boolean => {
    return tarefasData.tarefas.some(t => t.pessoaId === pessoaId && t.todo);
  };

  useEffect(() => {
    fetch("/api/tarefas-pendentes")
      .then(res => res.json())
      .then(data => {
        setTarefasData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar tarefas:", error);
        setLoading(false);
      });
  }, []);

  const value = {
    tarefas: tarefasData.tarefas,
    toggleTodo,
    getTodo,
    loading
  };

  return (
    <TarefasContext.Provider value={value}>
      {children}
    </TarefasContext.Provider>
  );
}

export function useTarefas() {
  const context = useContext(TarefasContext);
  if (context === undefined) {
    throw new Error('useTarefas must be used within a TarefasProvider');
  }
  return context;
} 