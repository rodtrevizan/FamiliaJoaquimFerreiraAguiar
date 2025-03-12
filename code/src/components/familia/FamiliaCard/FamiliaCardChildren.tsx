import React from 'react';
import type { PessoaNode, Pessoa } from '../../../types/familia';
import { FamiliaCard } from './index';
import { Collapse } from '@mui/material';

interface FamiliaCardChildrenProps {
  filhos: PessoaNode[];
  nivel: number;
  expanded: boolean;
  isEditEnabled: boolean;
  onEdit: (pessoa: Pessoa) => void;
  onDelete: (pessoa: Pessoa) => void;
  getPessoaNome: (id?: string) => string;
  onAddDescendente: (pai: Pessoa) => void;
}

export const FamiliaCardChildren: React.FC<FamiliaCardChildrenProps> = ({
  filhos,
  nivel,
  expanded,
  isEditEnabled,
  onEdit,
  onDelete,
  getPessoaNome,
  onAddDescendente
}) => {
  return (
    <Collapse in={expanded}>
      <div style={{ 
        paddingLeft: '16px', 
        borderLeft: '2px solid rgba(0,0,0,0.12)',
        marginLeft: '8px'
      }}>
        {filhos.map(filho => (
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
  );
}; 