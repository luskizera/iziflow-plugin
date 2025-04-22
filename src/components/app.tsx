// src/components/app.tsx
import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/components/providers/theme-provider";
import { dispatchTS, listenTS } from "@/utils/utils"; // <<< listenTS IMPORTADO
import type { EventTS } from '@shared/types/messaging.types'; // Tipos para mensagens
import { SunIcon, MoonIcon, SettingsIcon, InfoIcon } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Popover e ColorPicker removidos dos imports (mantido como no seu código)
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// Biblioteca 'color' não é mais estritamente necessária aqui, mas pode manter se usada em outro lugar
// import Color from 'color';

type NodeGenerationMode = 'light' | 'dark';

export function App() {
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento
  const { theme: uiTheme, setTheme: setUiTheme } = useTheme();
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Mantemos ambos os estados por enquanto, mas accentColor é a fonte da verdade
  const [accentColor, setAccentColor] = useState<string>('#3860FF'); // Cor confirmada/real
  const [inputValue, setInputValue] = useState<string>(accentColor); // Valor no input

  const [nodeMode, setNodeMode] = useState<NodeGenerationMode>('light');

  // Sincroniza Input quando accentColor muda (se accentColor for válido)
  useEffect(() => {
    if (isValidHex(accentColor)) {
      setInputValue(accentColor.toUpperCase());
    }
  }, [accentColor]);

  // --- Listener de Mensagens do Plugin ---
  // Usa useEffect para configurar listeners uma vez ao montar o componente
  useEffect(() => {
    // Foca no textarea ao montar o componente
    markdownTextareaRef.current?.focus();

    // Configura listeners INDIVIDUAIS para cada tipo de mensagem relevante
    // listenTS<Key> garante que o payload recebido na callback é do tipo EventTS[Key]

    const cleanupSuccess = listenTS('generation-success', (payload) => {
      console.log("UI: Generation success message received:", payload);
      setError(null); // Limpa erros anteriores em caso de sucesso
      setIsLoading(false); // <<< Processamento finalizado (SUCESSO)
      // payload aqui é { message: string }
    });

    const cleanupGenError = listenTS('generation-error', (payload) => {
      console.error("UI: Generation error message received:", payload);
      setError(`Erro na geração: ${payload.message}`); // Acessa payload.message
      setIsLoading(false); // <<< Processamento finalizado (ERRO)
      // payload aqui é { message: string }
    });

    const cleanupParseError = listenTS('parse-error', (payload) => {
      console.error("UI: Parse error message received:", payload);
      // Acessa payload.message e payload.lineNumber
      setError(`Erro de sintaxe no Markdown${payload.lineNumber ? ` (linha ${payload.lineNumber})` : ''}: ${payload.message}`);
      setIsLoading(false); // <<< Processamento finalizado (ERRO DE PARSING)
      // payload aqui é { message: string, lineNumber?: number }
    });

    const cleanupDebug = listenTS('debug', (payload) => {
      // Acessa payload.message e payload.data
      console.debug(`UI [Plugin Debug]: ${payload.message}`, payload.data);
      // payload aqui é { message: string, data?: string }
    });

    // Retorna uma função de cleanup que chama todas as funções de cleanup individuais
    // Isso garante que todos os listeners sejam removidos quando o componente for desmontado
    return () => {
      cleanupSuccess();
      cleanupGenError();
      cleanupParseError();
      cleanupDebug();
      console.log("UI: Message listeners cleaned up.");
    };
  }, []); // Array de dependências vazio significa que este efeito roda apenas uma vez ao montar e limpar ao desmontar

  // --- Handlers ---
  const handleSubmit = async () => {
    setError(null); // Limpa erros anteriores ao iniciar nova geração
    setIsLoading(true); // <<< Inicia o estado de carregamento

    if (!markdown.trim()) {
      setError("O campo Markdown não pode estar vazio.");
      setIsLoading(false); // Para o carregamento se a validação falhar na UI
      return;
    }
    // Usa a cor confirmada 'accentColor' (validada no input change/blur)
    const finalAccentColor = isValidHex(accentColor) ? accentColor : '#3860FF';
    try {
       console.log(">>> Enviando para plugin:", { markdown, mode: nodeMode, accentColor: finalAccentColor });
       // Usa dispatchTS do seu utils.ts para enviar a mensagem
       dispatchTS("generate-flow", { markdown, mode: nodeMode, accentColor: finalAccentColor });
       // O estado isLoading será definido como false pelos listeners quando a resposta chegar
    } catch (dispatchError: any) {
       // Erro ao *enviar* a mensagem para o plugin (raro, erro de comunicação)
       setError(`Erro interno ao enviar dados para o plugin: ${dispatchError.message}`);
       setIsLoading(false); // Para o carregamento em caso de erro de envio
    }
  };

  const handleCleanText = () => { setMarkdown(""); setError(null); markdownTextareaRef.current?.focus(); };
  const handleNodeModeChange = (value: string) => { if (value === 'light' || value === 'dark') { setNodeMode(value as NodeGenerationMode); } };
  const isValidHex = (color: string): boolean => /^#[0-9A-F]{6}$/i.test(color);

  // Atualiza input E cor principal se input for válido
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value;
      // Força o '#' e limpa caracteres inválidos
      if (!newValue.startsWith('#')) { newValue = '#' + newValue.replace(/[^0-9a-fA-F]/g, ''); }
      else { newValue = '#' + newValue.substring(1).replace(/[^0-9a-fA-F]/g, ''); }
      newValue = newValue.substring(0, 7); // Limita tamanho
      const upperNewValue = newValue.toUpperCase();
      setInputValue(upperNewValue); // Atualiza o input imediatamente

      // Atualiza a cor principal *somente* se o HEX digitado for válido
      if (isValidHex(upperNewValue)) {
          setAccentColor(upperNewValue);
      }
  };

   // Reverte input se inválido ao perder foco
   const handleInputBlur = () => {
       if (!isValidHex(inputValue)) {
           // Se inválido, reverte input para a última cor válida confirmada
           setInputValue(accentColor.toUpperCase());
       } else {
           // Se válido, garante que accentColor está sincronizado (caso tenha mudado via input)
           setAccentColor(inputValue.toUpperCase());
       }
   };


  return (
    <TooltipProvider delayDuration={100}>
        <div className={cn("flex flex-col h-screen p-4 gap-4 bg-background text-foreground", uiTheme)}>

          {/* --- Header --- */}
          <header className="flex items-center justify-between w-full flex-shrink-0">
             <h1 className="font-sans text-2xl font-semibold">iziFlow</h1>
             <div className="flex items-center gap-1.5">
                 <Button variant="outline" size="sm" className="p-0 w-8 h-8" onClick={() => setUiTheme(uiTheme === "dark" ? "light" : "dark")} title={uiTheme === "dark" ? "Mudar para Light Mode (UI)" : "Mudar para Dark Mode (UI)"}>
                     {uiTheme === "dark" ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                 </Button>
                 <Button variant="default" size="sm" className="p-0 w-8 h-8" title="Configurações (em breve)">
                     <SettingsIcon className="w-4 h-4" />
                 </Button>
             </div>
          </header>

          {/* --- Textarea --- */}
           <Textarea
            ref={markdownTextareaRef} value={markdown} onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Paste your iziFlow Markdown here."
            className="flex-grow w-full resize-none font-mono text-sm min-h-[150px] bg-muted/30 dark:bg-muted/10 border-border"
          />

          {/* --- Seção de Customização --- */}
          <div className="flex flex-col gap-3 w-full flex-shrink-0">
              <h2 className="text-xl font-medium">Customize nodes</h2>
              <div className="flex flex-row items-end gap-3">
                  {/* --- Accent Color Input Simples com Amostra --- */}
                  <div className="flex flex-1 flex-col items-start gap-1.5">
                      <Label htmlFor="accent-color-input" className="text-sm font-medium flex items-center gap-1">
                          Accent Color
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <InfoIcon className="w-3 h-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" align="center">
                                  <p className="text-xs">Define a cor de destaque (formato HEX).</p>
                              </TooltipContent>
                          </Tooltip>
                      </Label>
                      {/* Container relativo para o input e a amostra */}
                      <div className="relative flex items-end w-full h-9">
                          {/* Input com padding esquerdo */}
                          <Input
                              id="accent-color-input"
                              type="text"
                              value={inputValue} // Controlado pelo estado do input
                              onChange={handleInputChange} // Atualiza input e accentColor (se válido)
                              onBlur={handleInputBlur} // Reverte se inválido ao perder foco
                              className={cn(
                                  "h-9 w-full pl-8 pr-2 text-xs font-sans", // Padding esquerdo para amostra
                                  !isValidHex(inputValue) && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
                              )}
                              maxLength={7}
                              aria-label="Accent color hex value"
                          />
                          {/* Amostra de Cor (não clicável) */}
                          <div
                              aria-hidden="true" // Não interativo
                              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded border border-input pointer-events-none" // Cor da borda pode ser ajustada
                              style={{ backgroundColor: isValidHex(accentColor) ? accentColor : '#CCCCCC' }} // Mostra cor válida ou cinza
                          />
                      </div>
                  </div>

                  {/* --- Seletor MODO DE GERAÇÃO (com Tabs) --- */}
                  <div className="flex flex-1 flex-col items-start gap-1.5">
                    <Label htmlFor="accent-color-input" className="text-sm font-medium flex items-center gap-1">
                          Accent Color
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <InfoIcon className="w-3 h-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" align="center">
                                  <p className="text-xs">Define a cor de destaque (formato HEX).</p>
                              </TooltipContent>
                          </Tooltip>
                      </Label>
                  <Tabs value={nodeMode} onValueChange={handleNodeModeChange} className="w-full">
                      <TabsList className="flex-1 w-full p-1 bg-secondary border border-border rounded-md">
                         <TabsTrigger value="dark" className="flex flex-1 items-center gap-1.5 px-2 py-1 text-xs h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:opacity-70" aria-label="Generate in Dark mode">
                             <MoonIcon className="w-3.5 h-3.5"/> Dark nodes
                         </TabsTrigger>
                         <TabsTrigger value="light" className="flex flex-1 items-center gap-1.5 px-2 py-1 text-xs h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:opacity-70" aria-label="Generate in Light mode">
                             <SunIcon className="w-3.5 h-3.5"/> Light nodes
                         </TabsTrigger>
                      </TabsList>
                  </Tabs>
                  </div>
              </div>
          </div>

          {/* --- Área de Erro e Botões de Ação --- */}
          <div className="w-full mt-auto flex-shrink-0 space-y-2">
             {error && ( <Alert variant="destructive" className="text-xs"><AlertDescription>{error}</AlertDescription></Alert> )}
              <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCleanText} title="Limpar área de texto">Clean Text</Button>
                  {/* Desabilita se input inválido */}
                  <Button onClick={handleSubmit} disabled={isLoading || !markdown.trim() || !isValidHex(inputValue)}>
                    {isLoading ? "Generating..." : "Generate Flow"}
                  </Button>
              </div>
          </div>
        </div>
    </TooltipProvider>
  );
}