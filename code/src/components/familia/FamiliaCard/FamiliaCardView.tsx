import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox
} from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import type { Pessoa, PessoaNode } from "../../../types/familia";
import { FamiliaCardChildren } from './FamiliaCardChildren';
import { useTarefas } from '../../../contexts/TarefasContext';

interface FamiliaCardViewProps {
  pessoa: PessoaNode;
  nivel: number;
  isEditEnabled: boolean;
  expanded: boolean;
  infoModalAberto: boolean;
  responsaveis: string[];
  onToggleExpand: () => void;
  onToggleInfoModal: () => void;
  onEdit: (pessoa: Pessoa) => void;
  onDelete: (pessoa: Pessoa) => void;
  onAddDescendente: (pai: Pessoa) => void;
  getPessoaNome: (id?: string) => string;
  formatPhoneNumber: (phone?: string) => string;
}

export const FamiliaCardView: React.FC<FamiliaCardViewProps> = ({
  pessoa,
  nivel,
  isEditEnabled,
  expanded,
  infoModalAberto,
  responsaveis,
  onToggleExpand,
  onToggleInfoModal,
  onEdit,
  onDelete,
  onAddDescendente,
  getPessoaNome,
  formatPhoneNumber
}) => {
  const { toggleTodo, getTodo } = useTarefas();

  return (
    <div style={{ marginLeft: `${nivel * 16}px`, marginBottom: '4px' }}>
      <Card 
        variant="outlined" 
        style={{ 
          borderLeft: nivel > 0 ? `2px solid ${pessoa.vivo ? '#2196f3' : '#9e9e9e'}` : undefined,
          opacity: pessoa.vivo ? 1 : 0.8,
          borderColor: pessoa.responsavel ? '#4caf50' : undefined,
          borderWidth: '1px'
        }}
      >
        <CardContent sx={{ padding: '8px', '&:last-child': { paddingBottom: '8px' } }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {pessoa.filhos.length > 0 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                style={{ padding: 2 }}
              >
                {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            )}
            
            {pessoa.vivo && (
              <Checkbox
                name="todo"
                checked={getTodo(pessoa.id)}
                size="small"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => toggleTodo(pessoa.id, e.target.checked)}
                style={{ padding: 4 }}
              />
            )}

            <Typography 
              component="span" 
              sx={{ 
                fontSize: '0.9rem',
                color: pessoa.vivo ? 'inherit' : '#666',
                fontWeight: 500,
                flexGrow: 1,
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {pessoa.nome}
            </Typography>

            {!pessoa.vivo && (
              <Typography 
                component="span" 
                sx={{ 
                  fontSize: '0.9rem',
                  color: '#666'
                }}
              >
                †
              </Typography>
            )}

            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {pessoa.vivo && pessoa.contato?.telefone && (
                <IconButton
                  size="small"
                  href={`https://wa.me/55${formatPhoneNumber(pessoa.contato.telefone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: 2 }}
                >
                  <WhatsAppIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleInfoModal();
                }}
                style={{ padding: 2 }}
              >
                <InfoIcon fontSize="small" />
              </IconButton>
              {isEditEnabled && (
                <>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddDescendente(pessoa);
                    }} 
                    style={{ padding: 2 }}
                  >
                    <PersonAddIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(pessoa);
                    }} 
                    style={{ padding: 2 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(pessoa);
                    }} 
                    color="error" 
                    style={{ padding: 2 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={infoModalAberto}
        onClose={onToggleInfoModal}
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
            {pessoa.vivo && getTodo(pessoa.id) && (
              <Typography>
                <strong>TODO:</strong> Sim
              </Typography>
            )}
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
                onToggleInfoModal();
              }} 
              color="primary"
              startIcon={<EditIcon />}
            >
              Editar
            </Button>
          )}
          <Button onClick={onToggleInfoModal} color="inherit">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {pessoa.filhos.length > 0 && (
        <FamiliaCardChildren
          filhos={pessoa.filhos}
          nivel={nivel}
          expanded={expanded}
          isEditEnabled={isEditEnabled}
          onEdit={onEdit}
          onDelete={onDelete}
          getPessoaNome={getPessoaNome}
          onAddDescendente={onAddDescendente}
        />
      )}
    </div>
  );
}; 