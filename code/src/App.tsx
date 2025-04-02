import "./index.css";
import { FamiliaManager } from "./components/FamiliaManager";
import { Grid } from "@mui/material";
import { PartilhaManager } from "./components/partilha/PartilhaManager";
import { TarefasProvider } from "./contexts/TarefasContext";

export function App() {
  return (
    <TarefasProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Árvore Genealógica
            </h1>
            <p className="text-muted-foreground">Gerencie os dados da sua família!!</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <FamiliaManager />
            </Grid>
            <Grid item xs={4}>
              <PartilhaManager />
            </Grid>
          </Grid>
        </main>
      </div>
    </TarefasProvider>
  );
}

export default App;
