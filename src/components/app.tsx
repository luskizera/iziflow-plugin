import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "./providers/theme-provider";
import { FlowPreview } from "./flow-preview";
import { dispatchTS } from "@/utils/utils";
import { FlowDataSchema } from "@/lib/schema";

export function App() {
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const parsed = JSON.parse(json);
      const result = FlowDataSchema.safeParse(parsed);
      
      if (!result.success) {
        throw new Error(result.error.message);
      }
      
      // Adicione logs para debug
      console.log('Enviando JSON:', json);
      parent.postMessage({ 
        pluginMessage: { 
          type: 'generate-flow', 
          json 
        } 
      }, '*');

    } catch (error: any) {
      setError(error.message);
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[550px] flex flex-col">
      <div className="flex-none p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">IziFlow V2</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full flex flex-col">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="editor" className="h-full space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">JSON do User Flow</h2>
                <Textarea 
                  placeholder="Cole aqui o JSON do fluxo..."
                  value={json}
                  onChange={(e) => setJson(e.target.value)}
                  className="h-[240px] font-mono text-sm"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Gerando..." : "Gerar Fluxo"}
              </Button>
            </TabsContent>

            <TabsContent value="preview" className="h-full">
              <FlowPreview json={json} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
