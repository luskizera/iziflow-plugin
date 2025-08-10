// src/components/app.tsx
// src/components/app.tsx
import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/providers/theme-provider";
import { dispatchTS, listenTS } from "@/utils/utils";
import type { EventTS } from "@shared/types/messaging.types";
import type { HistoryEntry } from "@shared/types/flow.types"; // Importa o novo tipo
import {
  SunIcon,
  MoonIcon,
  InfoIcon,
  Trash2Icon,
  MoreHorizontalIcon,
  PlayIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NodeGenerationMode = "light" | "dark";

// Chave para o clientStorage (deve ser a mesma no plugin)
const GENERATION_STATUS_KEY = "iziflow_generation_status";

// Helper to check for valid HEX color
function isValidHex(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

// Declaração explícita da API do Figma para clientStorage na UI
declare const figma: {
  clientStorage: {
    getAsync(key: string): Promise<string | undefined>;
    setAsync(key: string, value: string): Promise<void>;
    deleteAsync(key: string): Promise<void>;
  };
};

export function App() {
  // --- States ---
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme: uiTheme, setTheme: setUiTheme } = useTheme();
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [accentColor, setAccentColor] = useState<string>("#3860FF");
  const [inputValue, setInputValue] = useState<string>(accentColor);
  const [nodeMode, setNodeMode] = useState<NodeGenerationMode>("light");
  const [history, setHistory] = useState<HistoryEntry[]>([]); // << MUDANÇA: Usa HistoryEntry[]
  const [activeTab, setActiveTab] = useState<string>("generator");

  console.log(
    "[App Render] isLoading:",
    isLoading,
    "history.length:",
    history.length
  );
  console.log("[App Render] Estado do histórico:", history);

  // --- Effects ---
  useEffect(() => {
    if (isValidHex(accentColor)) {
      setInputValue(accentColor.toUpperCase());
    }
  }, [accentColor]);

  // Effect for listeners and initial history fetch
  useEffect(() => {
    markdownTextareaRef.current?.focus();
    console.log("[App Effect] Montado. Pedindo histórico inicial...");
    dispatchTS("get-history");

    // Handlers for specific messages
    const handleDebug = (payload: EventTS["debug"]) => {
      const parsedData = payload.data ? JSON.parse(payload.data) : "";
      console.debug(`[Plugin Debug via UI]: ${payload.message}`, parsedData);
    };

    // << MUDANÇA: Ouve 'history-updated' e atualiza o estado
    const handleHistoryUpdate = (payload: EventTS["history-updated"]) => {
      console.log(
        "[App Handler] Recebido 'history-updated'. Payload completo:",
        payload
      );
      console.log(
        "[App Handler] Tipo de payload.history:",
        typeof payload.history,
        "É array?",
        Array.isArray(payload.history)
      );
      if (Array.isArray(payload.history)) {
        console.log(
          `[App Handler] Definindo ${payload.history.length} itens no histórico:`,
          payload.history
        );
        setHistory(payload.history);
      } else {
        console.error("UI: Formato de histórico inválido recebido:", payload);
        setHistory([]);
      }
    };

    const handleParseError = (payload: EventTS["parse-error"]) => {
      console.error("[App Handler] Recebido 'parse-error'. Payload:", payload);
      setError(
        `Erro de sintaxe ${payload.lineNumber ? `(linha ${payload.lineNumber})` : ""}: ${payload.message}`
      );
      setIsLoading(false);
    };

    // Setup listeners
    console.log(
      "[App Effect] Adicionando listeners (Debug, History, ParseError)..."
    );
    const cleanupDebug = listenTS("debug", handleDebug);
    const cleanupHistory = listenTS("history-updated", handleHistoryUpdate); // << MUDANÇA: Novo listener
    const cleanupParseError = listenTS("parse-error", handleParseError);

    // Cleanup function
    return () => {
      cleanupDebug();
      cleanupHistory();
      cleanupParseError();
      console.log("[App Effect] Listeners limpos.");
    };
  }, []); // Runs only once

  // Effect for polling generation status via clientStorage when isLoading is true
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let attempts = 0;
    const maxAttempts = 30;

    if (isLoading) {
      console.log("[App Polling Effect] Iniciando verificação de status...");
      intervalId = setInterval(async () => {
        attempts++;
        try {
          if (
            typeof figma === "undefined" ||
            typeof figma.clientStorage === "undefined"
          ) {
            console.warn(
              "[App Polling Effect] API Figma ou clientStorage não disponível na UI. Parando polling."
            );
            setError(
              "Não foi possível verificar o status da geração (API Figma indisponível)."
            );
            setIsLoading(false);
            if (intervalId) clearInterval(intervalId);
            return;
          }

          const statusRaw = await figma.clientStorage.getAsync(
            GENERATION_STATUS_KEY
          );
          if (statusRaw) {
            let statusData;
            try {
              statusData = JSON.parse(statusRaw);
              const isRecent =
                statusData.timestamp &&
                Date.now() - statusData.timestamp < 45000;

              if (
                (statusData.status === "success" ||
                  statusData.status === "error") &&
                isRecent
              ) {
                console.log(
                  `[App Polling Effect] Status final (${statusData.status}) detectado. Parando polling.`
                );
                if (statusData.status === "error") {
                  setError(
                    statusData.message ||
                      "Erro na geração (detalhes no console do plugin)."
                  );
                } else {
                  setError(null);
                  // A atualização do histórico já é feita pelo backend no sucesso
                }
                setIsLoading(false);
                if (intervalId) clearInterval(intervalId);
                await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
              } else if (
                !isRecent &&
                (statusData.status === "success" ||
                  statusData.status === "error")
              ) {
                console.warn(
                  "[App Polling Effect] Status final encontrado, mas é antigo. Limpando e parando polling."
                );
                if (intervalId) clearInterval(intervalId);
                setIsLoading(false);
                await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
              }
            } catch (parseError) {
              console.error(
                "[App Polling Effect] Erro ao fazer parse do statusRaw:",
                parseError,
                "Valor Raw:",
                statusRaw
              );
              setError("Erro interno ao ler status da geração (parse).");
              setIsLoading(false);
              if (intervalId) clearInterval(intervalId);
              try {
                await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
              } catch {}
            }
          }

          if (attempts >= maxAttempts && isLoading) {
            console.warn(
              "[App Polling Effect] Máximo de tentativas atingido. Parando polling."
            );
            setError(
              "A geração demorou muito ou o status não foi atualizado. Verifique o console do Figma."
            );
            setIsLoading(false);
            if (intervalId) clearInterval(intervalId);
            try {
              await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
            } catch {}
          }
        } catch (storageError) {
          console.error(
            "[App Polling Effect] Erro ao LER clientStorage:",
            storageError
          );
          setError("Erro ao verificar status da geração (storage).");
          setIsLoading(false);
          if (intervalId) clearInterval(intervalId);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        console.log("[App Polling Effect] Limpando intervalo de verificação.");
        clearInterval(intervalId);
      }
    };
  }, [isLoading]);

  // --- Handlers ---
  const handleSubmit = async () => {
    console.log("[handleSubmit] Iniciado.");
    setError(null);
    setIsLoading(true);

    if (!markdown.trim()) {
      setError("O campo Markdown não pode estar vazio.");
      setIsLoading(false);
      return;
    }
    if (!isValidHex(inputValue)) {
      setError("Cor Accent inválida. Use formato HEX (ex: #3860FF).");
      setIsLoading(false);
      return;
    }
    const finalAccentColor = accentColor;

    try {
      console.log("[handleSubmit] Enviando para plugin:", {
        markdown,
        mode: nodeMode,
        accentColor: finalAccentColor,
      });
      dispatchTS("generate-flow", {
        markdown,
        mode: nodeMode,
        accentColor: finalAccentColor,
      });
      console.log("[handleSubmit] Mensagem 'generate-flow' enviada.");
    } catch (error: any) {
      console.error(
        "[handleSubmit] Erro ao despachar mensagem 'generate-flow':",
        error
      );
      setError(`Erro interno ao enviar pedido: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleCleanText = () => {
    setMarkdown("");
    setError(null);
    markdownTextareaRef.current?.focus();
  };
  const handleNodeModeChange = (value: string) => {
    if (value === "light" || value === "dark") {
      setNodeMode(value as NodeGenerationMode);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    if (newValue.startsWith("#")) {
      newValue = "#" + newValue.substring(1).replace(/[^0-9a-fA-F]/gi, "");
    } else {
      newValue = "#" + newValue.replace(/[^0-9a-fA-F]/gi, "");
    }
    newValue = newValue.substring(0, 7);
    const upperNewValue = newValue.toUpperCase();
    setInputValue(upperNewValue);
    if (isValidHex(upperNewValue)) {
      setAccentColor(upperNewValue);
      if (
        error === "Cor Accent inválida." ||
        error === "Cor Accent inválida. Use formato HEX (ex: #3860FF)."
      ) {
        setError(null);
      }
    } else if (upperNewValue.length === 7) {
      setError("Cor Accent inválida.");
    } else {
      if (error === "Cor Accent inválida.") {
        setError(null);
      }
    }
  };

  const handleInputBlur = () => {
    if (!isValidHex(inputValue)) {
      setInputValue(accentColor.toUpperCase());
      if (
        error === "Cor Accent inválida." ||
        error === "Cor Accent inválida. Use formato HEX (ex: #3860FF)."
      ) {
        setError(null);
      }
    } else {
      setAccentColor(inputValue.toUpperCase());
      setError(null);
    }
  };

  // --- History Handlers ---
  // << MUDANÇA: Recebe HistoryEntry
  const handleLoadFromHistory = (historyEntry: HistoryEntry) => {
    setMarkdown(historyEntry.markdown);
    setError(null);
    setActiveTab("generator");
    setTimeout(() => markdownTextareaRef.current?.focus(), 0);
  };

  // << MUDANÇA: Envia o ID para o backend
  const handleRemoveItemClick = (idToRemove: string) => {
    dispatchTS("remove-history-entry", { id: idToRemove });
  };

  // << MUDANÇA: Apenas envia a mensagem
  const handleClearHistoryClick = () => {
    if (history.length > 0) {
      dispatchTS("clear-history-request");
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(
          "flex flex-col h-[500px] bg-background text-foreground pt-4 pb-1 px-4 gap-5",
          uiTheme
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between w-full flex-shrink-0">
          <div className="h-6 w-auto text-foreground">
            {/* IziFlow Logo SVG */}
            <svg
              width="107"
              height="22"
              viewBox="0 0 107 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              aria-label="IziFlow Logo"
              role="img"
            >
              <g clipPath="url(#clip0_19933_1555)">
                <path
                  d="M6.74156 0.453003C8.00045 0.325078 9.53693 0.717882 9.09279 2.30565C8.49711 4.43672 3.70911 5.47818 3.44803 7.61677C3.31599 8.69886 4.24027 9.03448 5.14956 8.82077C8.81971 7.95841 12.5664 1.10617 16.7122 3.06567C18.3177 3.82569 18.7003 5.53386 18.2457 7.14421C17.3634 10.2761 12.6084 13.6834 13.075 16.9387C13.2296 18.0103 14.3774 18.519 15.2702 17.8899C16.193 17.2397 16.1705 16.1982 16.7017 15.3931C17.3754 14.3712 18.3687 15.2215 18.6208 16.0959C19.311 18.4888 17.2283 21.4191 14.7466 21.6283C11.5926 21.8931 10.0756 19.8644 10.6983 16.8604C10.7973 16.3788 11.1484 15.5797 11.1769 15.1764C11.219 14.6015 10.7178 14.7128 10.3652 14.8678C7.57882 16.0944 5.34462 21.2309 2.57325 21.4627C0.244524 21.6569 -0.636252 19.4009 0.475596 17.5392C2.32718 14.4419 8.38607 13.709 11.4905 11.9C12.7719 11.1535 15.8254 8.89451 14.9086 7.13518C14.0383 5.46614 11.5626 7.10658 10.5978 7.85306C8.30355 9.62745 5.43315 12.6028 2.19363 11.2182C-2.75492 9.10371 2.93637 0.841291 6.74156 0.453003Z"
                  fill="currentColor"
                />
                <path
                  d="M25.2664 21.6508V7.28417H28.665V21.6493H25.2664V21.6508ZM26.9514 4.31331C26.3707 4.31331 25.8771 4.10863 25.469 3.70078C25.0623 3.29293 24.8583 2.79778 24.8583 2.21535C24.8583 1.63292 25.0608 1.13778 25.469 0.729922C25.8756 0.322069 26.3692 0.11739 26.9514 0.11739C27.5336 0.11739 27.9973 0.322069 28.4039 0.729922C28.8105 1.13778 29.0146 1.63292 29.0146 2.21535C29.0146 2.79778 28.8105 3.29293 28.4039 3.70078C27.9973 4.10863 27.5126 4.31331 26.9514 4.31331Z"
                  fill="currentColor"
                />
                <path
                  d="M41.9547 21.6508H30.4506V18.8531L37.6843 10.1406H30.4506V7.28568H41.9547V10.1121L34.6339 18.7959H41.9547V21.6508Z"
                  fill="currentColor"
                />
                <path
                  d="M43.7972 21.6508V7.28417H47.1958V21.6493H43.7972V21.6508ZM45.4822 4.31331C44.9015 4.31331 44.4079 4.10863 44.0013 3.70078C43.5946 3.29293 43.3906 2.79778 43.3906 2.21535C43.3906 1.63292 43.5946 1.13778 44.0013 0.729922C44.4079 0.322069 44.9015 0.11739 45.4822 0.11739C46.0629 0.11739 46.528 0.322069 46.9347 0.729922C47.3413 1.13778 47.5454 1.63292 47.5454 2.21535C47.5454 2.79778 47.3413 3.29293 46.9347 3.70078C46.528 4.10863 46.0434 4.31331 45.4822 4.31331Z"
                  fill="currentColor"
                />
                <path
                  d="M62.9432 3.70078V0.379259H53.4437H50.1607H49.8696V21.6508H53.4437V12.9083H61.4323V9.6741H53.4437V3.70078H62.9432Z"
                  fill="currentColor"
                />
                <path
                  d="M67.9773 21.6508H64.6072V0H67.9773V21.6508Z"
                  fill="currentColor"
                />
                <path
                  d="M69.1431 14.454C69.1431 12.958 69.4732 11.6471 70.1304 10.5199C70.7891 9.3731 71.6894 8.48064 72.8328 7.83951C73.9941 7.19839 75.3116 6.87782 76.7835 6.87782C78.2555 6.87782 79.5624 7.19839 80.7057 7.83951C81.8491 8.48064 82.7494 9.37461 83.4081 10.5199C84.0668 11.6471 84.3954 12.958 84.3954 14.454C84.3954 15.9499 84.0653 17.2412 83.4081 18.388C82.7494 19.5153 81.8491 20.3987 80.7057 21.0398C79.5624 21.6809 78.2555 22.0015 76.7835 22.0015C75.3116 22.0015 73.9941 21.6809 72.8328 21.0398C71.6894 20.3987 70.7891 19.5153 70.1304 18.388C69.4717 17.2412 69.1431 15.9304 69.1431 14.454ZM72.5702 14.4239C72.5702 15.3178 72.7443 16.1049 73.0939 16.7837C73.4615 17.4639 73.9551 17.9982 74.5748 18.3865C75.214 18.7552 75.9508 18.9403 76.7835 18.9403C77.6163 18.9403 78.3425 18.7552 78.9622 18.3865C79.6014 17.9982 80.0951 17.4639 80.4432 16.7837C80.7913 16.1034 80.9668 15.3163 80.9668 14.4239C80.9668 13.5314 80.7928 12.7533 80.4432 12.0926C80.0951 11.4124 79.6014 10.8886 78.9622 10.5184C78.3425 10.1301 77.6163 9.93597 76.7835 9.93597C75.9508 9.93597 75.214 10.1301 74.5748 10.5184C73.9551 10.8871 73.4615 11.4124 73.0939 12.0926C72.7458 12.7533 72.5702 13.5299 72.5702 14.4239Z"
                  fill="currentColor"
                />
                <path
                  d="M89.335 21.6508L84.6865 7.28568H88.2306L90.1767 13.6668C90.3508 14.2297 90.5068 14.8137 90.6419 15.4157C90.7964 16.0176 90.942 16.6588 91.077 17.339C91.155 16.8725 91.2421 16.4451 91.3381 16.0568C91.4356 15.6685 91.5422 15.2892 91.6577 14.9205C91.7732 14.5322 91.8993 14.1138 92.0358 13.6668L94.099 7.28568H97.556L99.5322 13.6668C99.5907 13.8219 99.6582 14.0551 99.7347 14.3667C99.8128 14.6782 99.8998 15.0168 99.9958 15.3871C100.111 15.7362 100.209 16.0869 100.287 16.436C100.365 16.7852 100.432 17.0772 100.489 17.3104C100.567 16.9417 100.655 16.5339 100.751 16.0869C100.866 15.6399 100.983 15.2125 101.099 14.8046C101.234 14.3772 101.34 13.9979 101.418 13.6684L103.423 7.28718H106.997L102.059 21.6523H98.863L96.8298 15.1839C96.5387 14.2704 96.3077 13.4938 96.1321 12.8526C95.9776 12.192 95.871 11.6772 95.8125 11.3085C95.7345 11.6577 95.6189 12.1242 95.4644 12.7067C95.3098 13.2695 95.0668 14.1153 94.7382 15.2426L92.675 21.6539H89.3335L89.335 21.6508Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_19933_1555">
                  <rect width="107" height="22" fill="none" />
                </clipPath>
              </defs>
            </svg>
          </div>
          {/* Header Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="p-0 w-8 h-8"
              onClick={() => setUiTheme(uiTheme === "dark" ? "light" : "dark")}
              title={
                uiTheme === "dark"
                  ? "Mudar para Light Mode (UI)"
                  : "Mudar para Dark Mode (UI)"
              }
            >
              {uiTheme === "dark" ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </header>

        {/* --- Main Tabs --- */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-grow min-h-0"
        >
          <TabsList className="flex-shrink-0 h-9 w-auto justify-start rounded-lg bg-muted text-muted-foreground">
            <TabsTrigger
              value="generator"
              className="flex-1 px-3 py-1 h-7 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Create Flow
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 px-3 py-1 h-7 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              History
            </TabsTrigger>
          </TabsList>

          {/* --- Generator Tab Content --- */}
          <TabsContent
            value="generator"
            className="mt-5 flex flex-1 flex-col gap-5 data-[state=inactive]:hidden"
          >
            {/* Textarea */}
            <Textarea
              ref={markdownTextareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste your IziFlow Markdown here or start typing..."
              className="h-full w-full resize-none font-mono text-xs min-h-[15vh] bg-muted/30 dark:bg-muted/10 border-border"
            />
            {/* Customization Section */}
            <div className="flex flex-col gap-2 w-full flex-shrink-0">
              <h3 className="text-xl font-medium">Customize nodes</h3>
              <div className="flex flex-row items-end gap-2">
                {/* Accent Color Input */}
                <div className="flex flex-1 flex-col items-start gap-1">
                  <Label
                    htmlFor="accent-color-input"
                    className="text-sm font-semibold flex items-center gap-1"
                  >
                    Accent Color
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="w-3 h-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center">
                        <p className="text-xs">Define accent color (HEX).</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative flex items-center w-full h-8">
                    <Input
                      id="accent-color-input"
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={cn(
                        "h-8 w-full pl-7 pr-1 text-xs font-mono",
                        !isValidHex(inputValue) &&
                          "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
                      )}
                      maxLength={7}
                      aria-label="Accent color hex value"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm border border-input pointer-events-none"
                      style={{
                        backgroundColor: isValidHex(accentColor)
                          ? accentColor
                          : "#CCCCCC",
                      }}
                    />
                  </div>
                </div>
                {/* Node Mode Tabs */}
                <div className="flex flex-1 flex-col items-start gap-1">
                  <Label
                    htmlFor="node-theme-tabs"
                    className="text-sm font-semibold flex items-center gap-1"
                  >
                    Node Theme
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="w-3 h-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center">
                        <p className="text-sm font-semibold">
                          Visual theme for generated nodes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Tabs
                    id="node-theme-tabs"
                    value={nodeMode}
                    onValueChange={handleNodeModeChange}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 p-0.5 bg-secondary border border-border rounded-md h-8">
                      <TabsTrigger
                        value="dark"
                        className="flex items-center gap-1 px-1 py-0.5 text-[11px] h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:opacity-70"
                        aria-label="Generate in Dark mode"
                      >
                        <MoonIcon className="w-3 h-3" /> Dark Nodes
                      </TabsTrigger>
                      <TabsTrigger
                        value="light"
                        className="flex items-center gap-1 px-1 py-0.5 text-[11px] h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:opacity-70"
                        aria-label="Generate in Light mode"
                      >
                        <SunIcon className="w-3 h-3" /> Light Nodes
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
            {/* Error Area & Action Buttons */}
            <div className="w-full mt-auto flex-shrink-0 space-y-1.5 pt-1.5">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCleanText}
                  title="Clear text area"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={
                    isLoading || !markdown.trim() || !isValidHex(inputValue)
                  }
                >
                  {isLoading ? "Generating..." : "Create Flow"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* --- History Tab Content (Table View) --- */}
          <TabsContent
            value="history"
            className="flex flex-col flex-grow p-3 gap-6 overflow-hidden data-[state=inactive]:hidden"
          >
            <div className="flex flex-col flex-grow w-full items-start gap-2">
              <h2 className="text-xl font-medium flex-shrink-0">
                Flows History
              </h2>
              <div className="flex-grow w-full min-h-0 border max-h-[200px] rounded-md">
                <ScrollArea className="h-full">
                  <Table className="text-xs">
                    <TableHeader className="top-0 bg-muted/80 backdrop-blur-sm">
                      <TableRow>
                        <TableHead className="w-[60%] h-8 px-3 font-medium">
                          Flow name
                        </TableHead>
                        <TableHead className="w-[25%] h-8 px-3 font-medium">
                          Date
                        </TableHead>
                        <TableHead className="w-[15%] text-right h-8 px-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.length > 0 ? (
                        history.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell
                              className="py-1.5 px-3 font-medium truncate"
                              title={entry.name}
                            >
                              {entry.name}
                            </TableCell>
                            <TableCell className="py-1.5 px-3 text-muted-foreground">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="py-1 px-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <MoreHorizontalIcon className="h-3.5 w-3.5" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      handleLoadFromHistory(entry)
                                    }
                                    className="text-xs gap-1.5"
                                  >
                                    <PlayIcon className="w-3 h-3" /> Load Flow
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      handleRemoveItemClick(entry.id)
                                    }
                                    className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 gap-1.5"
                                  >
                                    <Trash2Icon className="w-3 h-3" /> Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No history saved yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
            {/* Clean History Button */}
            <div className="flex justify-end mt-auto flex-shrink-0">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearHistoryClick}
                disabled={history.length === 0}
              >
                <Trash2Icon className="w-3.5 h-3.5 mr-1.5" />
                Clean History
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <footer className="flex flex-row sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Made with ❤️ by IziTools
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground font-medium h-8 px-3"
              asChild
            >
              <a
                href="https://chatgpt.com/g/g-680800ab82a88191afc106220253ff30-iziflow-assistant"
                target="_blank"
                rel="noopener noreferrer"
              >
                IziFlow Copilot
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground font-medium h-8 px-3"
              asChild
            >
              <a
                href="https://github.com/luskizera/iziflow-plugin"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground font-medium h-8 px-3"
              asChild
            >
              <a
                href="https://www.izitools.xyz"
                target="_blank"
                rel="noopener noreferrer"
              >
                iziTools Website
              </a>
            </Button>
          </div>
        </footer>

        {/* ...existing code... */}
      </div>
    </TooltipProvider>
  );
}
