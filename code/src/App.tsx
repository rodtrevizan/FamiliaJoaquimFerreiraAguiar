import "./index.css";
import { FamiliaManager } from "./components/FamiliaManager";

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Árvore Genealógica</h1>
          <p className="text-muted-foreground">Gerencie os dados da sua família</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <FamiliaManager />
      </main>
    </div>
  );
}

export default App;
