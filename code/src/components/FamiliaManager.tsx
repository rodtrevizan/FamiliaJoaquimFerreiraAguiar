import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Pessoa, FamiliaData } from "../types/familia";
import { v4 as uuidv4 } from "uuid";
import { Trash2, Lock, Unlock } from "lucide-react";

export function FamiliaManager() {
  const [familiaData, setFamiliaData] = useState<FamiliaData>({ familia: [] });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novaPessoa, setNovaPessoa] = useState<Partial<Pessoa>>({
    id: uuidv4(),
    nome: "",
    vivo: true,
    descendentes: [],
    contato: {},
    pais: {}
  });
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [pessoaParaDeletar, setPessoaParaDeletar] = useState<Pessoa | null>(null);

  const salvarDados = async () => {
    try {
      const response = await fetch("/api/familia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(familiaData),
      });
      
      if (!response.ok) throw new Error("Erro ao salvar dados");
      
      const data = await response.json();
      setFamiliaData(data);
      setEditandoId(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const adicionarPessoa = async () => {
    if (!novaPessoa.nome) return;
    
    const novaFamilia = {
      familia: [...familiaData.familia, novaPessoa as Pessoa]
    };
    
    try {
      const response = await fetch("/api/familia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaFamilia),
      });
      
      if (!response.ok) throw new Error("Erro ao salvar dados");
      
      const data = await response.json();
      setFamiliaData(data);
      setNovaPessoa({
        id: uuidv4(),
        nome: "",
        vivo: true,
        descendentes: [],
        contato: {},
        pais: {}
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const editarPessoa = (pessoa: Pessoa) => {
    setEditandoId(pessoa.id);
    setNovaPessoa(pessoa);
  };

  const atualizarPessoa = async (pessoaAtualizada: Pessoa) => {
    const novaFamilia = {
      familia: familiaData.familia.map(p => 
        p.id === pessoaAtualizada.id ? pessoaAtualizada : p
      )
    };

    try {
      const response = await fetch("/api/familia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaFamilia),
      });
      
      if (!response.ok) throw new Error("Erro ao atualizar dados");
      
      const data = await response.json();
      setFamiliaData(data);
      setEditandoId(null);
      setNovaPessoa({
        id: uuidv4(),
        nome: "",
        vivo: true,
        descendentes: [],
        contato: {},
        pais: {}
      });
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNovaPessoa(prev => {
      const newPessoa = { ...prev };
      
      if (name === 'telefone') {
        newPessoa.contato = { ...newPessoa.contato, telefone: value };
      } else {
        newPessoa[name] = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      }
      
      return newPessoa;
    });
  };

  const handlePaiSelect = (id: string) => {
    if (id === "nenhum") {
      setNovaPessoa(prev => ({
        ...prev,
        pais: {
          ...prev.pais,
          paiId: undefined,
          pai: undefined
        }
      }));
      return;
    }

    const pai = familiaData.familia.find(p => p.id === id);
    setNovaPessoa(prev => ({
      ...prev,
      pais: {
        ...prev.pais,
        paiId: id,
        pai: pai?.nome
      }
    }));
  };

  const handleMaeSelect = (id: string) => {
    if (id === "nenhum") {
      setNovaPessoa(prev => ({
        ...prev,
        pais: {
          ...prev.pais,
          maeId: undefined,
          mae: undefined
        }
      }));
      return;
    }

    const mae = familiaData.familia.find(p => p.id === id);
    setNovaPessoa(prev => ({
      ...prev,
      pais: {
        ...prev.pais,
        maeId: id,
        mae: mae?.nome
      }
    }));
  };

  const getPessoaNome = (id?: string) => {
    if (!id) return "Não informado";
    const pessoa = familiaData.familia.find(p => p.id === id);
    return pessoa?.nome || "Não encontrado";
  };

  const deletarPessoa = async (pessoa: Pessoa) => {
    if (deleteConfirmation !== `deletar ${pessoa.nome}`) return;
    
    const novaFamilia = {
      familia: familiaData.familia.filter(p => p.id !== pessoa.id)
    };

    try {
      const response = await fetch("/api/familia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaFamilia),
      });
      
      if (!response.ok) throw new Error("Erro ao deletar dados");
      
      const data = await response.json();
      setFamiliaData(data);
      setPessoaParaDeletar(null);
      setDeleteConfirmation("");
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  useEffect(() => {
    // Carregar dados iniciais
    fetch("/api/familia")
      .then(res => res.json())
      .then(data => setFamiliaData(data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDeleteEnabled(!isDeleteEnabled)}
        className="mb-4"
      >
        {isDeleteEnabled ? (
          <Unlock className="w-4 h-4 mr-2" />
        ) : (
          <Lock className="w-4 h-4 mr-2" />
        )}
        {isDeleteEnabled ? "Bloquear Exclusão" : "Desbloquear Exclusão"}
      </Button>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            editandoId ? atualizarPessoa(novaPessoa as Pessoa) : adicionarPessoa();
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={novaPessoa.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={novaPessoa.contato?.telefone || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pai">Pai</Label>
                <Select
                  value={novaPessoa.pais?.paiId || "nenhum"}
                  onValueChange={handlePaiSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o pai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Não informado</SelectItem>
                    {familiaData.familia
                      .filter(p => p.id !== editandoId)
                      .map(pessoa => (
                        <SelectItem key={pessoa.id} value={pessoa.id}>
                          {pessoa.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mae">Mãe</Label>
                <Select
                  value={novaPessoa.pais?.maeId || "nenhum"}
                  onValueChange={handleMaeSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a mãe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Não informado</SelectItem>
                    {familiaData.familia
                      .filter(p => p.id !== editandoId)
                      .map(pessoa => (
                        <SelectItem key={pessoa.id} value={pessoa.id}>
                          {pessoa.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="vivo"
                  name="vivo"
                  checked={novaPessoa.vivo}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="vivo">Vivo</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="submit">
                {editandoId ? "Atualizar Pessoa" : "Adicionar Pessoa"}
              </Button>
              {editandoId && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => {
                    setEditandoId(null);
                    setNovaPessoa({
                      id: uuidv4(),
                      nome: "",
                      vivo: true,
                      descendentes: [],
                      contato: {},
                      pais: {}
                    });
                  }}
                >
                  Cancelar Edição
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familiaData.familia.map((pessoa) => (
          <Card key={pessoa.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{pessoa.nome}</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => editarPessoa(pessoa)}
                >
                  ✏️ Editar
                </Button>
              </div>
              {pessoa.contato?.telefone && (
                <p className="text-sm text-gray-600">📞 {pessoa.contato.telefone}</p>
              )}
              <p className="text-sm text-gray-600">
                Status: {pessoa.vivo ? "Vivo" : "Falecido"}
              </p>
              <div className="mt-2 text-sm">
                <p>Pai: {getPessoaNome(pessoa.pais?.paiId)}</p>
                <p>Mãe: {getPessoaNome(pessoa.pais?.maeId)}</p>
              </div>
              {isDeleteEnabled && (
                <div className="mt-4 border-t pt-4">
                  {pessoaParaDeletar?.id === pessoa.id ? (
                    <div className="space-y-2">
                      <Input
                        placeholder={`Digite "deletar ${pessoa.nome}" para confirmar`}
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletarPessoa(pessoa)}
                          disabled={deleteConfirmation !== `deletar ${pessoa.nome}`}
                        >
                          Confirmar Exclusão
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPessoaParaDeletar(null);
                            setDeleteConfirmation("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setPessoaParaDeletar(pessoa)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deletar
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 