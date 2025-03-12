import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import { PessoaForm } from '../PessoaForm';
import type { Pessoa, FamiliaData } from '../../../types/familia';

interface FamiliaModalProps {
  open: boolean;
  onClose: () => void;
  editandoId: string | null;
  pessoa: Partial<Pessoa>;
  setPessoa: React.Dispatch<React.SetStateAction<Partial<Pessoa>>>;
  familiaData: FamiliaData;
  onSave: () => void;
}

export const FamiliaModal: React.FC<FamiliaModalProps> = ({
  open,
  onClose,
  editandoId,
  pessoa,
  setPessoa,
  familiaData,
  onSave
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {editandoId ? "Editar Pessoa" : "Adicionar Pessoa"}
      </DialogTitle>
      <DialogContent>
        <PessoaForm 
          pessoa={pessoa}
          setPessoa={setPessoa}
          familiaData={familiaData}
          editandoId={editandoId}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={onSave} variant="contained">
          {editandoId ? "Atualizar" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 