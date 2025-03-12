import React, { useState } from 'react';
import { FamiliaCardView } from './FamiliaCardView';
import type { FamiliaCardProps } from '../../../types/familia';
import { formatPhoneNumber, getResponsaveis } from '../../../utils/familiaUtils';

export const FamiliaCard: React.FC<FamiliaCardProps> = ({ 
  pessoa, 
  nivel, 
  onEdit, 
  isEditEnabled, 
  onDelete,
  getPessoaNome,
  onAddDescendente
}) => {
  const [expanded, setExpanded] = useState(true);
  const [infoModalAberto, setInfoModalAberto] = useState(false);

  const responsaveis = getResponsaveis(pessoa);

  return (
    <FamiliaCardView
      pessoa={pessoa}
      nivel={nivel}
      isEditEnabled={isEditEnabled}
      expanded={expanded}
      infoModalAberto={infoModalAberto}
      responsaveis={responsaveis}
      onToggleExpand={() => setExpanded(!expanded)}
      onToggleInfoModal={() => setInfoModalAberto(!infoModalAberto)}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddDescendente={onAddDescendente}
      getPessoaNome={getPessoaNome}
      formatPhoneNumber={formatPhoneNumber}
    />
  );
}; 