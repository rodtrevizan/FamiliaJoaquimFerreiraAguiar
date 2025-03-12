import React from "react";
import {
    TextField,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from "@mui/material";
import type { PessoaFormProps } from "../../../types/familia";

export const PessoaForm: React.FC<PessoaFormProps> = ({ 
  pessoa, 
  setPessoa, 
  familiaData, 
  editandoId 
}) => {
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
    setPessoa(prev => ({
      ...prev,
      pais: {
        ...prev.pais,
        paiId: id === "nenhum" ? undefined : id
      }
    }));
  };

  const handleMaeSelect = (event: any) => {
    const id = event.target.value;
    setPessoa(prev => ({
      ...prev,
      pais: {
        ...prev.pais,
        maeId: id === "nenhum" ? undefined : id
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