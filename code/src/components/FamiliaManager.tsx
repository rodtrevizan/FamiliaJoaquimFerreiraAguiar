import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import {
  construirArvoreGenealogica
} from "../utils/familiaUtils";
import {
  LockOpen as UnlockIcon,
  Lock as LockIcon, Add as AddIcon
} from "@mui/icons-material";
import { useFamilia } from '../hooks/useFamilia';
import { FamiliaCard } from './familia/FamiliaCard';
import { PessoaForm } from './familia/PessoaForm';

export function FamiliaManager() {
  const {
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
  } = useFamilia();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          onClick={() => setIsEditEnabled(!isEditEnabled)}
          startIcon={isEditEnabled ? <UnlockIcon /> : <LockIcon />}
        >
          {isEditEnabled ? "Bloquear" : "Editar"}
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
    </div>
  );
} 