// src/components/app.tsx
import { useState, useRef, useEffect } from "react"; // <-- Importar useRef e useEffect
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "./providers/theme-provider";
import { dispatchTS } from "@/utils/utils";
import { SunIcon, MoonIcon } from 'lucide-react';

export function App() {
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null); // <-- Criar a ref

  const tabOptions = [
    { id: "editor", label: "JSON input" },
    { id: "preview", label: "Manual create" },
  ];

  // <-- Adicionar useEffect para foco inicial
  useEffect(() => {
    // Foca no textarea assim que o componente monta
    textareaRef.current?.focus();
  }, []); // Array vazio garante que rode apenas uma vez na montagem

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);

      JSON.parse(json);
      dispatchTS("generate-flow", { json });

    } catch (error: any) {
      console.error("Erro no handleSubmit:", error);
      // Tenta extrair a mensagem de erro de forma mais segura
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Erro ao processar JSON: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start justify-center gap-6 p-6">
      {/* Header permanece igual */}
      <header className="flex items-center justify-between w-full">
        <h1 className="flex-1 font-h-3 text-foreground text-[length:var(--h-3-font-size)] tracking-[var(--h-3-letter-spacing)] leading-[var(--h-3-line-height)] [font-style:var(--h-3-font-style)]">
          JSON from User Flow
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 p-2 border border-border_primary_default rounded-lg"
        >
          {theme === "dark" ?
            <SunIcon className="w-4 h-4" /> :
            <MoonIcon className="w-4 h-4" />
          }
        </Button>
      </header>

      <Tabs defaultValue="editor" className="w-full">
        {/* TabsList permanece igual */}
        <TabsList className="grid grid-cols-2 p-1 bg-zinc-100 rounded-lg">
          {tabOptions.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="editor" className="mt-4 space-y-4">
          <Textarea
            ref={textareaRef} // <-- Anexar a ref
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder="Cole seu JSON aqui..."
            // 👇 Alterado de min-h para h
            className="h-[200px] resize-none"
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !json.trim()} // <-- Desabilita se estiver carregando ou vazio
            className="w-full"
          >
            {isLoading ? "Gerando..." : "Gerar Fluxo"}
          </Button>
        </TabsContent>

        {/* TabsContent para preview permanece igual */}
        <TabsContent value="preview" className="mt-4">
          <div className="text-center text-muted-foreground">
            Em desenvolvimento...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}