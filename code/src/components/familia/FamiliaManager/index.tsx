import { FamiliaHeader } from './FamiliaHeader';
import { FamiliaModal } from './FamiliaModal';
import { FamiliaCard } from '../FamiliaCard';
import { useFamilia } from '../../../hooks/useFamilia';
import { construirArvoreGenealogica } from "../../../utils/familiaUtils";

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

  const handleAddNew = () => {
    resetForm();
    setModalAberto(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FamiliaHeader 
        isEditEnabled={isEditEnabled}
        onToggleEdit={() => setIsEditEnabled(!isEditEnabled)}
        onAddNew={handleAddNew}
      />

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

      <FamiliaModal 
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        editandoId={editandoId}
        pessoa={novaPessoa}
        setPessoa={setNovaPessoa}
        familiaData={familiaData}
        onSave={salvarPessoa}
      />
    </div>
  );
} 