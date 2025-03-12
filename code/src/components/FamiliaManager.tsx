import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Typography,
  Collapse
} from "@mui/material";
import type { Pessoa, FamiliaData } from "../types/familia";
import { v4 as uuidv4 } from "uuid";
import {
  Delete as DeleteIcon,
  LockOpen as UnlockIcon,
  Lock as LockIcon,
  WhatsApp as WhatsAppIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

interface PessoaNode extends Pessoa {
  filhos: PessoaNode[];
}

function construirArvoreGenealogica(pessoas: Pessoa[]): PessoaNode[] {
  const pessoasMap = new Map<string, PessoaNode>();
  pessoas.forEach(p => {
    pessoasMap.set(p.id, { ...p, filhos: [] });
  });

  const raizes: PessoaNode[] = [];

  pessoasMap.forEach(pessoa => {
    if (!pessoa.pais?.paiId && !pessoa.pais?.maeId) {
      raizes.push(pessoa);
    } else {
      if (pessoa.pais?.paiId) {
        const pai = pessoasMap.get(pessoa.pais.paiId);
        if (pai) pai.filhos.push(pessoa);
      }
      if (pessoa.pais?.maeId && !pessoa.pais?.paiId) {
        const mae = pessoasMap.get(pessoa.pais.maeId);
        if (mae) mae.filhos.push(pessoa);
      }
    }
  });

  return raizes;
}

const PessoaForm: React.FC<{
  pessoa: Partial<Pessoa>;
  setPessoa: React.Dispatch<React.SetStateAction<Partial<Pessoa>>>;
  familiaData: FamiliaData;
  editandoId: string | null;
}> = ({ pessoa, setPessoa, familiaData, editandoId }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setPessoa(prev => {
      const newPessoa = { ...prev };
      
      if (name === 'telefone') {
        newPessoa.contato = { ...newPessoa.contato, telefone: value };
      } else {
        newPessoa[name] = type === "checkbox" ? checked : value;
      }
      
      return newPessoa;
    });
  };

  const handlePaiSelect = (event: any) => {
    const id = event.target.value;
    if (id === "nenhum") {
      setPessoa(prev => ({
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
    setPessoa(prev => ({
      ...prev,
      pais: {
        ...prev.pais,
        paiId: id,
        pai: pai?.nome
      }
    }));
  };

  const handleMaeSelect = (event: any) => {
    const id = event.target.value;
    if (id === "nenhum") {
      setPessoa(prev => ({
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
    setPessoa(prev => ({
      ...prev,
      pais: {
        ...prev.pais,
        maeId: id,
        mae: mae?.nome
      }
    }));
  };

  return (
    <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr', padding: '16px 0' }}>
      <TextField
        label="Nome"
        name="nome"
        value={pessoa.nome}
        onChange={handleInputChange}
        required
        fullWidth
      />
      
      <TextField
        label="Telefone"
        name="telefone"
        value={pessoa.contato?.telefone || ""}
        onChange={handleInputChange}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Pai</InputLabel>
        <Select
          value={pessoa.pais?.paiId || "nenhum"}
          onChange={handlePaiSelect}
          label="Pai"
        >
          <MenuItem value="nenhum">Não informado</MenuItem>
          {familiaData.familia
            .filter(p => p.id !== editandoId)
            .map(p => (
              <MenuItem key={p.id} value={p.id}>
                {p.nome}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Mãe</InputLabel>
        <Select
          value={pessoa.pais?.maeId || "nenhum"}
          onChange={handleMaeSelect}
          label="Mãe"
        >
          <MenuItem value="nenhum">Não informado</MenuItem>
          {familiaData.familia
            .filter(p => p.id !== editandoId)
            .map(p => (
              <MenuItem key={p.id} value={p.id}>
                {p.nome}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            name="responsavel"
            checked={pessoa.responsavel || false}
            onChange={handleInputChange}
          />
        }
        label="Responsável"
        style={{ gridColumn: '1 / -1' }}
      />

      <FormControlLabel
        control={
          <Checkbox
            name="vivo"
            checked={pessoa.vivo}
            onChange={handleInputChange}
          />
        }
        label="Vivo"
        style={{ gridColumn: '1 / -1' }}
      />
    </div>
  );
};

const FamiliaCard: React.FC<{ 
  pessoa: PessoaNode; 
  nivel: number;
  onEdit: (pessoa: Pessoa) => void;
  isEditEnabled: boolean;
  onDelete: (pessoa: Pessoa) => void;
  getPessoaNome: (id?: string) => string;
  onAddDescendente: (pai: Pessoa) => void;
}> = ({ 
  pessoa, 
  nivel, 
  onEdit, 
  isEditEnabled, 
  onDelete,
  getPessoaNome,
  onAddDescendente
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [pessoaParaDeletar, setPessoaParaDeletar] = useState<Pessoa | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [infoModalAberto, setInfoModalAberto] = useState(false);

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };

  const getResponsaveis = (p: PessoaNode, visitados = new Set<string>()): string[] => {
    if (visitados.has(p.id)) return [];
    visitados.add(p.id);
    
    const responsaveis: string[] = [];
    
    for (const filho of p.filhos) {
      if (filho.responsavel) {
        responsaveis.push(filho.nome);
        
        // Se o filho responsável está morto, busca responsáveis dele também
        if (!filho.vivo) {
          const responsaveisFilho = getResponsaveis(filho, visitados);
          responsaveis.push(...responsaveisFilho);
        }
      }
    }
    
    return responsaveis;
  };

  const renderResponsaveis = () => {
    const responsaveis = getResponsaveis(pessoa);
    if (responsaveis.length > 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          Responsável(is): {responsaveis.join(", ")}
        </Typography>
      );
    }
    return null;
  };

  return (
    <div style={{ marginLeft: `${nivel * 16}px` }}>
      <Card 
        variant="outlined" 
        style={{ 
          marginBottom: '8px',
          borderLeft: nivel > 0 ? `4px solid ${pessoa.vivo ? '#2196f3' : '#9e9e9e'}` : undefined,
          opacity: pessoa.vivo ? 1 : 0.8,
          borderColor: pessoa.responsavel ? '#4caf50' : undefined,
          borderWidth: pessoa.responsavel ? '2px' : '1px'
        }}
      >
        <CardContent style={{ padding: '8px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {pessoa.filhos.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    style={{ padding: 4 }}
                  >
                    {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                )}
                <Typography 
                  variant="h6" 
                  component="span" 
                  style={{ 
                    fontSize: '1.1rem', 
                    marginRight: '8px',
                    color: pessoa.vivo ? 'inherit' : '#666'
                  }}
                >
                  {pessoa.nome}
                </Typography>
                {!pessoa.vivo && (
                  <Typography variant="body2" color="text.secondary">
                    (†)
                  </Typography>
                )}
                {pessoa.contato?.telefone && (
                  <IconButton
                    size="small"
                    href={`https://wa.me/55${formatPhoneNumber(pessoa.contato.telefone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="success"
                  >
                    <WhatsAppIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={() => setInfoModalAberto(true)}
                  color="primary"
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isEditEnabled && (
                  <IconButton
                    size="small"
                    onClick={() => onAddDescendente(pessoa)}
                    color="primary"
                    title="Adicionar Descendente"
                  >
                    <PersonAddIcon fontSize="small" />
                  </IconButton>
                )}
                {isEditEnabled && (
                  pessoaParaDeletar?.id === pessoa.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TextField
                        size="small"
                        placeholder={`deletar ${pessoa.nome}`}
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        style={{ width: '150px' }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (deleteConfirmation === `deletar ${pessoa.nome}`) {
                            onDelete(pessoa);
                            setPessoaParaDeletar(null);
                            setDeleteConfirmation("");
                          }
                        }}
                        disabled={deleteConfirmation !== `deletar ${pessoa.nome}`}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setPessoaParaDeletar(null);
                          setDeleteConfirmation("");
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={() => setPessoaParaDeletar(pessoa)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )
                )}
              </div>
            </div>
            {!pessoa.vivo && renderResponsaveis()}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={infoModalAberto}
        onClose={() => setInfoModalAberto(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Informações - {pessoa.nome}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography>
              <strong>Pai:</strong> {getPessoaNome(pessoa.pais?.paiId)}
            </Typography>
            <Typography>
              <strong>Mãe:</strong> {getPessoaNome(pessoa.pais?.maeId)}
            </Typography>
            {pessoa.contato?.telefone && (
              <Typography>
                <strong>Telefone:</strong> {pessoa.contato.telefone}
              </Typography>
            )}
            <Typography>
              <strong>Status:</strong> {pessoa.vivo ? 'Vivo' : 'Falecido'}
            </Typography>
            {pessoa.responsavel && (
              <Typography>
                <strong>É responsável por:</strong> {getPessoaNome(pessoa.pais?.paiId)} e/ou {getPessoaNome(pessoa.pais?.maeId)}
              </Typography>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          {isEditEnabled && (
            <Button 
              onClick={() => {
                onEdit(pessoa);
                setInfoModalAberto(false);
              }} 
              color="primary"
              startIcon={<EditIcon />}
            >
              Editar
            </Button>
          )}
          <Button onClick={() => setInfoModalAberto(false)} color="inherit">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {pessoa.filhos.length > 0 && (
        <Collapse in={expanded}>
          <div style={{ 
            paddingLeft: '16px', 
            borderLeft: '2px solid rgba(0,0,0,0.12)',
            marginLeft: '8px'
          }}>
            {pessoa.filhos.map(filho => (
              <FamiliaCard 
                key={filho.id} 
                pessoa={filho} 
                nivel={nivel + 1}
                onEdit={onEdit}
                isEditEnabled={isEditEnabled}
                onDelete={onDelete}
                getPessoaNome={getPessoaNome}
                onAddDescendente={onAddDescendente}
              />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
};

export function FamiliaManager() {
  const [familiaData, setFamiliaData] = useState<FamiliaData>({ familia: [] });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaPessoa, setNovaPessoa] = useState<Partial<Pessoa>>({
    id: uuidv4(),
    nome: "",
    vivo: true,
    responsavel: false,
    descendentes: [],
    contato: {},
    pais: {}
  });
  const [isEditEnabled, setIsEditEnabled] = useState(false);

  const resetForm = () => {
    setNovaPessoa({
      id: uuidv4(),
      nome: "",
      vivo: true,
      responsavel: false,
      descendentes: [],
      contato: {},
      pais: {}
    });
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
        headers: {
          "Content-Type": "application/json",
        },
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
      id: uuidv4(),
      nome: "",
      vivo: true,
      responsavel: false,
      descendentes: [],
      contato: {},
      pais: {
        paiId: pai.id,
        pai: pai.nome
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
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsEditEnabled(!isEditEnabled)}
          startIcon={isEditEnabled ? <UnlockIcon /> : <LockIcon />}
        >
          {isEditEnabled ? "Bloquear Edição" : "Permitir Edição"}
        </Button>
        {isEditEnabled && (
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              resetForm();
              setModalAberto(true);
            }}
            startIcon={<AddIcon />}
          >
            Nova Pessoa
          </Button>
        )}
      </div>

      <Dialog 
        open={modalAberto} 
        onClose={() => setModalAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editandoId ? "Editar Pessoa" : "Adicionar Pessoa"}
        </DialogTitle>
        <DialogContent>
          <PessoaForm 
            pessoa={novaPessoa}
            setPessoa={setNovaPessoa}
            familiaData={familiaData}
            editandoId={editandoId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAberto(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={salvarPessoa} variant="contained">
            {editandoId ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        {construirArvoreGenealogica(familiaData.familia).map((pessoa) => (
          <FamiliaCard 
            key={pessoa.id} 
            pessoa={pessoa} 
            nivel={0}
            onEdit={editarPessoa}
            isEditEnabled={isEditEnabled}
            onDelete={deletarPessoa}
            getPessoaNome={getPessoaNome}
            onAddDescendente={adicionarDescendente}
          />
        ))}
      </div>
    </div>
  );
} 