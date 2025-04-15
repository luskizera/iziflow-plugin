// src/components/app.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";         // Ajuste o caminho se necessário
import { Textarea } from "./ui/textarea";       // Ajuste o caminho se necessário
import { Alert, AlertDescription } from "./ui/alert"; // Ajuste o caminho se necessário
import { useTheme } from "./providers/theme-provider"; // Ajuste o caminho se necessário
// 👇 Caminho correto para seus utils e tipos
import { dispatchTS, listenTS } from "@/utils/utils";
import type { EventTS } from '@shared/types/messaging.types';
import { SunIcon, MoonIcon } from 'lucide-react';

export function App() {
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Estado de Loading
  const { theme, setTheme } = useTheme();
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    markdownTextareaRef.current?.focus();
  }, []);

  // --- Listener para Mensagens do Backend ---
  useEffect(() => {
    console.log("<<< Configurando listener de mensagens da UI >>>");

    const handleMessage = (event: MessageEvent<any>) => {
        // Log para ver TODAS as mensagens que chegam
        console.log('<<< Mensagem Bruta Recebida pela UI:', event.data);

        // Verificar se a mensagem tem a estrutura esperada
        const pluginMessage = event.data?.pluginMessage;
        if (!pluginMessage || typeof pluginMessage.type !== 'string') {
            // Ignora mensagens que não se parecem com as do plugin
            // console.log('Mensagem ignorada (formato inválido):', event.data);
            return;
        }

        const messageType = pluginMessage.type as keyof EventTS;
        console.log(`<<< Tipo de Mensagem Recebida: ${messageType} >>>`, pluginMessage);

        // Atualizar estado com base no tipo da mensagem
        switch (messageType) {
            case 'generation-success': {
                console.log('<<< Processando generation-success >>>');
                const payload = pluginMessage as EventTS['generation-success'];
                setIsLoading(false); // <-- PONTO CHAVE: Finaliza o loading
                setError(null);      // Limpa erros anteriores
                console.log("Sucesso reportado pelo plugin:", payload.message);
                // Poderia adicionar uma notificação visual de sucesso aqui se quisesse
                break;
            }
            case 'generation-error':
            case 'parse-error': {
                console.log(`<<< Processando ${messageType} >>>`);
                const payload = pluginMessage as EventTS['generation-error'] | EventTS['parse-error'];
                setIsLoading(false); // <-- PONTO CHAVE: Finaliza o loading
                setError(payload.message || `Erro desconhecido (${messageType})`);
                console.error(`Erro reportado pelo plugin (${messageType}):`, payload.message);
                if ('lineNumber' in payload && payload.lineNumber) {
                    console.error(`  (Erro de parse na linha: ${payload.lineNumber})`);
                     // Atualiza o erro com a linha, se disponível
                     setError(`${payload.message} (na linha ${payload.lineNumber})`);
                }
                break;
            }
            case 'debug': {
                const payload = pluginMessage as EventTS['debug'];
                console.log(`[PLUGIN DEBUG UI] ${payload.message}`, payload.data ? JSON.parse(payload.data) : '');
                break;
            }
            // Ignorar outros tipos de mensagem que a UI não precisa tratar diretamente
            default:
                // console.log(`Mensagem tipo '${messageType}' recebida, mas não tratada diretamente pela UI.`);
                break;
        }
    };

    window.addEventListener('message', handleMessage);

    // Função de limpeza: remove o listener quando o componente desmontar
    return () => {
        console.log("<<< Removendo listener de mensagens da UI >>>");
        window.removeEventListener('message', handleMessage);
    };
  }, []); // Array vazio garante que o setup/cleanup rode apenas uma vez


  // --- Função handleSubmit (Inalterada da versão anterior correta) ---
  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    const markdownToSend = markdown;

    if (!markdownToSend.trim()) {
        setError("O campo Markdown não pode estar vazio.");
        setIsLoading(false);
        return;
    }
    try {
       console.log(">>> Enviando para o backend:", { markdown: markdownToSend });
       dispatchTS("generate-flow", { markdown: markdownToSend });
       // NÃO chamar setIsLoading(false) aqui
    } catch (dispatchError: any) {
      console.error("Erro ao despachar a mensagem 'generate-flow':", dispatchError);
      const errorMsg = dispatchError instanceof Error ? dispatchError.message : String(dispatchError);
      setError(`Erro interno ao enviar dados: ${errorMsg}`);
      setIsLoading(false); // Parar loading APENAS se o dispatch falhar
    }
  };

  return (
    // --- JSX da UI (Inalterado da versão anterior correta) ---
    <div className="flex flex-col items-start justify-stretch h-screen p-4 gap-4">
      {/* Header */}
      <header className="flex items-center justify-between w-full flex-shrink-0">
         <h1 className="flex-1 font-sans text-2xl font-semibold">IziFlow plugin</h1>
         <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
           {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
         </Button>
      </header>

      {/* Área de Texto Markdown */}
       <Textarea
        ref={markdownTextareaRef}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder={
`Paste your .md here.`
        }
        className="flex-grow w-full resize-none font-mono text-sm h-[200px]"
      />

      {/* Área de Erro e Botão */}
      <div className="w-full mt-auto flex-shrink-0 space-y-2">
         {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !markdown.trim()}
            className="w-full"
          >
            {isLoading ? "Gerando..." : "Gerar Fluxo"}
          </Button>
      </div>
    </div>
  );
}