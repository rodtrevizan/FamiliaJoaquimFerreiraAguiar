import { useState, useEffect } from 'react';
import type { TarefasPendentesData } from '../types/tarefas-pendentes';

export function useTarefasPendentes() {
    const [tarefasData, setTarefasData] = useState<TarefasPendentesData>({ tarefas: [] });

    const toggleTodo = async (pessoaId: string, todo: boolean) => {
        const novasTarefas = {
            tarefas: tarefasData.tarefas.filter(t => t.pessoaId !== pessoaId)
        };

        if (todo) {
            novasTarefas.tarefas.push({ pessoaId, todo });
        }

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
    };

    const getTodo = (pessoaId: string): boolean => {
        return tarefasData.tarefas.some(t => t.pessoaId === pessoaId && t.todo);
    };

    useEffect(() => {
        fetch("/api/tarefas-pendentes")
            .then(res => res.json())
            .then(data => setTarefasData(data))
            .catch(console.error);
    }, []);

    return {
        toggleTodo,
        getTodo
    };
} 