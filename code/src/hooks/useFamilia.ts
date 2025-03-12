import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Pessoa, FamiliaData } from '../types/familia';

export function useFamilia() {
    const [familiaData, setFamiliaData] = useState<FamiliaData>({ familia: [] });
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [isEditEnabled, setIsEditEnabled] = useState(false);
    const [novaPessoa, setNovaPessoa] = useState<Partial<Pessoa>>(getInitialPessoa());

    function getInitialPessoa(): Partial<Pessoa> {
        return {
            id: uuidv4(),
            nome: "",
            vivo: true,
            responsavel: false,
            descendentes: [],
            contato: {},
            pais: {}
        };
    }

    const resetForm = () => {
        setNovaPessoa(getInitialPessoa());
        setEditandoId(null);
    };

    const salvarPessoa = async () => {
        if (!novaPessoa.nome) return;

        const novaFamilia = {
            familia: editandoId
                ? familiaData.familia.map(p => p.id === editandoId ? novaPessoa as Pessoa : p)
                : [...familiaData.familia, novaPessoa as Pessoa]
        };

        try {
            const response = await fetch("/api/familia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaFamilia),
            });

            if (!response.ok) throw new Error("Erro ao salvar dados");

            const data = await response.json();
            setFamiliaData(data);
            resetForm();
            setModalAberto(false);
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    };

    const editarPessoa = (pessoa: Pessoa) => {
        setEditandoId(pessoa.id);
        setNovaPessoa(pessoa);
        setModalAberto(true);
    };

    const adicionarDescendente = (pai: Pessoa) => {
        setNovaPessoa({
            ...getInitialPessoa(),
            pais: {
                paiId: pai.id
            }
        });
        setModalAberto(true);
    };

    const getPessoaNome = (id?: string) => {
        if (!id) return "Não informado";
        const pessoa = familiaData.familia.find(p => p.id === id);
        return pessoa?.nome || "Não encontrado";
    };

    const deletarPessoa = async (pessoa: Pessoa) => {
        const novaFamilia = {
            familia: familiaData.familia.filter(p => p.id !== pessoa.id)
        };

        try {
            const response = await fetch("/api/familia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaFamilia),
            });

            if (!response.ok) throw new Error("Erro ao deletar dados");

            const data = await response.json();
            setFamiliaData(data);
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    useEffect(() => {
        fetch("/api/familia")
            .then(res => res.json())
            .then(data => setFamiliaData(data))
            .catch(console.error);
    }, []);

    return {
        familiaData,
        editandoId,
        modalAberto,
        setModalAberto,
        novaPessoa,
        setNovaPessoa,
        isEditEnabled,
        setIsEditEnabled,
        resetForm,
        salvarPessoa,
        editarPessoa,
        adicionarDescendente,
        getPessoaNome,
        deletarPessoa
    };
} 