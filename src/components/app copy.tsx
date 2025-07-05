"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Moon, Sun, Box } from "lucide-react";

const IziFlowLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="101"
    height="24"
    viewBox="0 0 101 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c3.314 0 6.314-1.343 8.485-3.515C22.657 18.314 24 15.314 24 12c0-3.314-1.343-6.314-3.515-8.485C18.314 1.343 15.314 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z"
      fill="currentColor"
    />
    <path
      d="M34.93 21.6V2.4h2.34v19.2h-2.34zm6.084 0L35.61 12l5.404-9.6h2.736l-5.404 9.6 5.404 9.6h-2.736zm10.74 0V2.4h11.232v2.232H54.09v5.904h7.524V12.72h-7.524v6.624h8.892V21.6H51.754zm17.928-19.2h2.34v19.2h-2.34V2.4zm-5.832 0h2.34v19.2h-2.34V2.4zm11.736 9.6c0-5.304 3.744-9.6 9.18-9.6s9.18 4.296 9.18 9.6-3.744 9.6-9.18 9.6-9.18-4.296-9.18-9.6zm16.02 0c0-3.888-2.88-7.296-6.84-7.296s-6.84 3.408-6.84 7.296c0 3.888 2.88 7.296 6.84 7.296s6.84-3.408 6.84-7.296z"
      fill="currentColor"
    />
  </svg>
);


export default function CreateFlowUI() {
  return (
    <div className="bg-background border rounded-xl p-4 w-full max-w-[624px] mx-auto flex flex-col gap-10">
      <header className="flex items-center justify-between">
        <IziFlowLogo className="h-6 w-auto text-primary" />
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
          <Moon className="h-4 w-4" />
        </Button>
      </header>

      <main>
        <Tabs defaultValue="create-flow" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-secondary rounded-lg">
            <TabsTrigger value="create-flow">Create Flow</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="create-flow" className="mt-5 flex flex-col gap-5">
            <Textarea
              placeholder="Paste your iziFlow Markdown here."
              className="min-h-[142px] text-sm"
            />

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-medium tracking-tight">Customize nodes</h3>
              <div className="flex flex-col md:flex-row items-start md:items-end gap-3">
                <div className="flex flex-col gap-1.5 w-full md:w-auto">
                    <Label htmlFor="accent-color" className="flex items-center gap-1 text-sm font-medium">
                        Accent Color
                        <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Set the accent color for the flow nodes.</p>
                            </TooltipContent>
                        </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent pl-3 text-sm shadow-sm">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#3860FF" }} />
                        <Input
                            id="accent-color"
                            defaultValue="#3860FF"
                            className="w-full p-2 border-0 shadow-none focus-visible:ring-0"
                        />
                    </div>
                </div>
                
                <Tabs defaultValue="dark" className="w-full md:w-auto">
                    <TabsList className="grid grid-cols-2 h-9 p-1 bg-secondary rounded-lg w-full md:w-[200px]">
                        <TabsTrigger value="dark" className="h-7 text-xs px-3 py-1 gap-1">
                            <Moon className="h-4 w-4" />
                            Dark mode
                        </TabsTrigger>
                        <TabsTrigger value="light" className="h-7 text-xs px-3 py-1 gap-1">
                            <Sun className="h-4 w-4" />
                            Light mode
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" size="sm">
                Clean Text
              </Button>
              <Button size="sm">Generate Flow</Button>
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-5">
            <p className="text-sm text-muted-foreground text-center py-10">
              No history yet.
            </p>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">Made with ♥ by IziTools</p>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground font-medium h-8 px-3">
            IziFlow Copilot
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground font-medium h-8 px-3">
            GitHub
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground font-medium h-8 px-3">
            iziTools Website
          </Button>
        </div>
      </footer>
    </div>
  );
}
