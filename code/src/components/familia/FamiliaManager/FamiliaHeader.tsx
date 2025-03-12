import React from 'react';
import { Button } from "@mui/material";
import {
    LockOpen as UnlockIcon,
    Lock as LockIcon,
    Add as AddIcon
} from "@mui/icons-material";

interface FamiliaHeaderProps {
  isEditEnabled: boolean;
  onToggleEdit: () => void;
  onAddNew: () => void;
}

export const FamiliaHeader: React.FC<FamiliaHeaderProps> = ({
  isEditEnabled,
  onToggleEdit,
  onAddNew
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '8px',
      borderBottom: '1px solid #eee'
    }}>
      <Button
        variant="text"
        size="small"
        onClick={onToggleEdit}
        startIcon={isEditEnabled ? <UnlockIcon /> : <LockIcon />}
      >
        {isEditEnabled ? "Bloquear" : "Editar"}
      </Button>
      {isEditEnabled && (
        <Button
          variant="contained"
          size="small"
          onClick={onAddNew}
          startIcon={<AddIcon />}
        >
          Nova Pessoa
        </Button>
      )}
    </div>
  );
}; 