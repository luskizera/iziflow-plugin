// src/components/app.tsx
import { useState, useRef, useEffect } from "react"; // <-- Importar useRef e useEffect
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "./providers/theme-provider";
import { dispatchTS, listenTS } from "@/utils/utils";
import { SunIcon, MoonIcon } from 'lucide-react';

export function App() {
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null); // <-- Criar a ref

  const tabOptions = [
    { id: "editor", label: "MD input" },
    { id: "preview", label: "Manual create" },
  ];

  // <-- Adicionar useEffect para foco inicial
  useEffect(() => {
    // Foca no textarea assim que o componente monta
    textareaRef.current?.focus();
  }, []); // Array vazio garante que rode apenas uma vez na montagem

  const handleSubmit = async () => {
    // 1. Resetar o estado de erro ao tentar um novo envio
    setError(null);
    // 2. Indicar que o processo começou (estado de carregamento)
    setIsLoading(true);

    // 3. Obter o conteúdo Markdown do estado (substitui a leitura do 'json')
    const markdownToSend = markdown; // Lê do estado 'markdown'

    // 4. Validar se há conteúdo para enviar
    if (!markdownToSend.trim()) {
        setError("O campo Markdown não pode estar vazio."); // Mensagem de erro clara
        setIsLoading(false); // Para o carregamento, pois não houve envio
        return; // Interrompe a execução
    }

    // 5. Tentar enviar a mensagem para o backend (código do plugin)
    try {
       // Chama a função dispatchTS (verifique se está importada corretamente)
       // Envia o tipo de evento 'generate-flow' e um payload contendo
       // a chave 'markdown' com o valor da string Markdown.
       // (Conforme definido em shared/types/messaging.types.ts)
       console.log("Enviando para o backend:", { markdown: markdownToSend }); // Log para debug
       dispatchTS("generate-flow", { markdown: markdownToSend });

       // IMPORTANTE: Não definimos setIsLoading(false) aqui!
       // A UI agora deve ESPERAR uma mensagem de volta do backend
       // ('generation-success' ou 'generation-error') para saber quando
       // o processo terminou (seja com sucesso ou falha).
       // Isso é tratado no listener useEffect que adicionamos anteriormente.

    } catch (dispatchError: any) {
      // 6. Capturar erros que podem ocorrer *durante o envio* da mensagem
      // (Isso é raro, mas pode acontecer se houver problema com a comunicação interna do Figma)
      console.error("Erro ao despachar a mensagem 'generate-flow':", dispatchError);
      const errorMsg = dispatchError instanceof Error ? dispatchError.message : String(dispatchError);
      setError(`Erro interno ao enviar dados: ${errorMsg}`);
      setIsLoading(false); // Resetar loading se o próprio dispatch falhar
    }
    // Não há 'finally { setIsLoading(false); }' aqui.
  };

  return (
    <div className="flex flex-col items-start justify-center gap-6 p-6">
      {/* Header permanece igual */}
      <header className="flex items-center justify-between w-full">
        <h1 className="flex-1 font-h-3 text-foreground text-[length:var(--h-3-font-size)] tracking-[var(--h-3-letter-spacing)] leading-[var(--h-3-line-height)] [font-style:var(--h-3-font-style)]">
          iziFlow Plugin
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
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Cole seu markdown aqui..."
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
            disabled={isLoading || !markdown.trim()} // <-- Desabilita se estiver carregando ou vazio
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