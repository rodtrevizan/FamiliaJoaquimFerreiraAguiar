import "./index.css";
import { FamiliaManager } from "./components/FamiliaManager";
import { Grid } from "@mui/material";
import { PartilhaManager } from "./components/partilha/PartilhaManager";

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
  );
}

export default App;
