// src/components/ui/color-picker.tsx (ou seu caminho correto)
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
// Importa explicitamente SliderProps e o componente Root do slider Radix
import { Root as SliderRoot, Thumb, Track, type SliderProps } from "@radix-ui/react-slider"
import Color, { type ColorLike } from "color"; // Importa ColorLike
import { PipetteIcon } from "lucide-react"
import {
  type ChangeEventHandler,
  type ComponentProps,
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type FC // Importa FC para componentes funcionais
} from "react"

// --- Contexto ---
interface ColorPickerContextValue {
  hue: number
  saturation: number
  lightness: number
  alpha: number
  mode: string
  setHue: (hue: number) => void
  setSaturation: (saturation: number) => void
  setLightness: (lightness: number) => void
  setAlpha: (alpha: number) => void
  setMode: (mode: string) => void
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(undefined)

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext)
  if (!context) { throw new Error("useColorPicker must be used within a ColorPickerProvider") }
  return context
}

// --- Componente Principal ColorPicker ---
export type ColorPickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> & {
  value?: ColorLike;
  defaultValue?: ColorLike;
  onChange?: (value: ColorLike) => void;
}

export const ColorPicker: FC<ColorPickerProps> = ({
  value,
  defaultValue = "#000000",
  onChange,
  className,
  children, // <<< Adiciona children à desestruturação
  ...props
}) => {

    let initialColor: InstanceType<typeof Color>; // <<< CORRIGIDO: Usa InstanceType
    try {
        initialColor = Color(value ?? defaultValue);
    } catch (e) {
        console.warn("Invalid initial color value provided to ColorPicker, using default.", value ?? defaultValue);
        try { initialColor = Color(defaultValue); }
        catch (e2) { initialColor = Color("#000000"); }
    }

    // <<< CORRIGIDO: Usa InstanceType
    const [internalColor, setInternalColor] = useState<InstanceType<typeof Color>>(initialColor);

    useEffect(() => {
        if (value) {
            try {
                const newControlledColor = Color(value);
                if (newControlledColor.rgb().string() !== internalColor.rgb().string()) {
                    setInternalColor(newControlledColor);
                }
            } catch (e) { console.warn("Invalid controlled color value provided to ColorPicker.", value); }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const updateColor = useCallback((newColorData: Partial<{ hue: number; saturation: number; lightness: number; alpha: number }>) => {
        const nextColor = Color.hsl(
            newColorData.hue ?? internalColor.hue(),
            newColorData.saturation ?? internalColor.saturationl(),
            newColorData.lightness ?? internalColor.lightness()
        ).alpha(newColorData.alpha !== undefined ? newColorData.alpha / 100 : internalColor.alpha());
        setInternalColor(nextColor);
        onChange?.(nextColor.hex());
    }, [internalColor, onChange]);

    const [h, s, l] = internalColor.hsl().array();
    const a = internalColor.alpha();
    const hue = Math.round(h);
    const saturation = Math.round(s);
    const lightness = Math.round(l);
    const alpha = Math.round(a * 100);

    const setHue = useCallback((newHue: number) => updateColor({ hue: newHue }), [updateColor]);
    const setSaturation = useCallback((newSat: number) => updateColor({ saturation: newSat }), [updateColor]);
    const setLightness = useCallback((newLight: number) => updateColor({ lightness: newLight }), [updateColor]);
    const setAlpha = useCallback((newAlpha: number) => updateColor({ alpha: newAlpha }), [updateColor]);
    const [mode, setMode] = useState("hex");

  return (
    <ColorPickerContext.Provider value={{ hue, saturation, lightness, alpha, mode, setHue, setSaturation, setLightness, setAlpha, setMode }}>
      {/* Passa props HTML restantes para o div container */}
      <div className={cn("grid w-full gap-4", className)} {...props}>
          {children} {/* <<< Renderiza os children passados */}
      </div>
    </ColorPickerContext.Provider>
  )
}


// --- ColorPickerSelection ---
export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>
export const ColorPickerSelection: FC<ColorPickerSelectionProps> = ({ className, ...props }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { hue, saturation, lightness, setSaturation, setLightness } = useColorPicker();

    const initialPositionX = saturation / 100;
    const initialPositionY = 1 - (lightness / 100);
    const [position, setPosition] = useState({ x: initialPositionX, y: initialPositionY });

    useEffect(() => {
      const newX = saturation / 100;
      const newY = 1 - (lightness / 100); // Reconfirmar se este mapeamento L -> Y está correto para seu gradiente
      // Atualiza a posição visual se os valores do CONTEXTO mudarem significativamente
      if (Math.abs(position.x - newX) > 0.01 || Math.abs(position.y - newY) > 0.01) {
           setPosition({ x: newX, y: newY });
      }
    }, [saturation, lightness, position.x, position.y]);

    const handlePointerMove = useCallback((event: PointerEvent) => {
        if (!isDragging || !containerRef.current) { return }
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        setPosition({ x, y });
        setSaturation(x * 100);
        setLightness((1 - y) * 100);
    }, [isDragging, setSaturation, setLightness]);

    useEffect(() => {
        const stopDragging = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", stopDragging);
        }
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stopDragging);
        };
    }, [isDragging, handlePointerMove]);

    return (
        <div
            ref={containerRef}
            className={cn("relative aspect-[4/3] w-full cursor-crosshair rounded", className)}
            style={{
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                backgroundImage: `linear-gradient(to right, hsl(0, 0%, 100%), hsla(0, 0%, 100%, 0)), linear-gradient(to top, hsl(0, 0%, 0%), hsla(0, 0%, 0%, 0))`
            }}
            onPointerDown={(e) => { e.preventDefault(); setIsDragging(true); handlePointerMove(e.nativeEvent); }}
            {...props}
        >
            <div
                className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
                style={{
                    left: `${position.x * 100}%`,
                    top: `${position.y * 100}%`,
                    backgroundColor: Color.hsl(hue, saturation, lightness).hex(),
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
                }}
            />
        </div>
    );
};


// --- ColorPickerHue (Tipo Corrigido) ---
// Define explicitamente as props que queremos + as do Slider que usamos + className/style/id
export interface ColorPickerHueProps extends Pick<SliderProps, 'dir' | 'max' | 'step'> {
  className?: string; // Inclui className explicitamente
  style?: React.CSSProperties; // Inclui style
  id?: string; // Inclui id
  // Adicione outras props HTML que você possa precisar passar
}

export const ColorPickerHue: FC<ColorPickerHueProps> = ({
    className,
    dir,
    max = 360,
    step = 1,
    style, // Inclui style na desestruturação
    id,   // Inclui id na desestruturação
    // Não usamos mais ...restProps para evitar passar props conflitantes
}) => {
    const { hue, setHue } = useColorPicker();

    return (
        <SliderRoot
            value={[hue]}
            onValueChange={([h]) => setHue(h)}
            max={max}
            step={step}
            dir={dir}
            id={id}     // Passa id
            style={style} // Passa style
            className={cn("relative flex h-4 w-full touch-none items-center", className)}
        >
            <Track className="relative h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]" />
            <Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </SliderRoot>
    );
};


// --- ColorPickerAlpha (Tipo Corrigido) ---
// Mesma abordagem de tipagem simplificada
export interface ColorPickerAlphaProps extends Pick<SliderProps, 'dir' | 'max' | 'step'> {
   className?: string;
   style?: React.CSSProperties;
   id?: string;
}

export const ColorPickerAlpha: FC<ColorPickerAlphaProps> = ({
    className,
    dir,
    max = 100,
    step = 1,
    style,
    id,
 }) => {
    const { hue, saturation, lightness, alpha, setAlpha } = useColorPicker();
    const baseColor = Color.hsl(hue, saturation, lightness).hex();

    return (
        <SliderRoot
            value={[alpha]}
            onValueChange={([a]) => setAlpha(a)}
            max={max}
            step={step}
            dir={dir}
            id={id}
            style={style}
            className={cn("relative flex h-4 w-full touch-none items-center", className)}
        >
            <Track
                className="relative h-3 w-full grow overflow-hidden rounded-full"
                style={{ background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center' }}
            >
                <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(to right, transparent, ${baseColor})`}} />
            </Track>
            <Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </SliderRoot>
    );
};


// --- ColorPickerEyeDropper ---
export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>
export const ColorPickerEyeDropper: FC<ColorPickerEyeDropperProps> = ({ className, ...props }) => {
    const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker();
    const handleEyeDropper = useCallback(async () => {
      try {
        // @ts-ignore - EyeDropper API is experimental
        const eyeDropper = new EyeDropper()
        const result = await eyeDropper.open()
        const color = Color(result.sRGBHex)
        const [h, s, l] = color.hsl().array()
        setHue(h); setSaturation(s); setLightness(l); setAlpha(100); // Atualiza via contexto
      } catch (error) { console.error("EyeDropper failed:", error) }
    }, [setHue, setSaturation, setLightness, setAlpha]);
    return ( <Button variant="outline" size="icon" onClick={handleEyeDropper} className={cn("shrink-0 text-muted-foreground", className)} {...props}> <PipetteIcon size={16} /> </Button> );
};

// --- ColorPickerOutput ---
export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>
const formats = ["hex", "rgb", "css", "hsl"];
export const ColorPickerOutput: FC<ColorPickerOutputProps> = ({ className, ...props }) => {
    const { mode, setMode } = useColorPicker();
    return ( <Select value={mode} onValueChange={setMode}> <SelectTrigger className="h-8 w-[4.5rem] shrink-0 text-xs" {...props}> <SelectValue placeholder="Mode" /> </SelectTrigger> <SelectContent> {formats.map((format) => ( <SelectItem key={format} value={format} className="text-xs"> {format.toUpperCase()} </SelectItem> ))} </SelectContent> </Select> );
};

// --- PercentageInput (Corrigido com return) ---
type PercentageInputProps = ComponentProps<typeof Input>
const PercentageInput: FC<PercentageInputProps> = ({ className, onChange, ...props }) => {
  return ( // <<< Adicionado return
    <div className="relative">
      <Input
        type="text" // Mantido como texto para flexibilidade, mas poderia ser number
        onChange={onChange}
        {...props}
        className={cn(
            "h-8 w-[3.25rem] rounded-l-none bg-secondary px-2 text-xs shadow-none pr-4", // Adicionado pr-4
             className
        )}
      />
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground text-xs">
        %
      </span>
    </div>
  ); // <<< Fim do return
};

// --- ColorPickerFormat ---
export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>
export const ColorPickerFormat: FC<ColorPickerFormatProps> = ({ className, ...props }) => {
    const { hue, saturation, lightness, alpha, mode, setHue, setSaturation, setLightness, setAlpha } = useColorPicker();
    const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);

    if (mode === "hex") {
        const hex = color.hex();
        const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
          try {
            const newColor = Color("#" + event.target.value.replace(/[^0-9a-fA-F]/g, '')); // Adiciona # e limpa
            setHue(newColor.hue()); setSaturation(newColor.saturationl()); setLightness(newColor.lightness()); setAlpha(newColor.alpha() * 100);
          } catch (error) { console.error("Invalid hex color:", error); }
        };
        return (
          <div className={cn("-space-x-px relative flex items-center shadow-sm", className)} {...props}>
            <span className="flex items-center justify-center h-8 w-7 rounded-l-md border border-r-0 border-input bg-secondary text-xs">#</span>
            <Input type="text" value={hex.substring(1).toUpperCase()} onChange={handleChange} className="h-8 rounded-none rounded-l-none bg-secondary px-2 text-xs shadow-none border-l-0" />
            <PercentageInput value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          </div>
        );
    }
    if (mode === "rgb") {
        const rgb = color.rgb().array().map((value) => Math.round(value));
        const handleChange = (index: number, value: string) => {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
                const newRgb = [...rgb];
                newRgb[index] = numValue;
                try {
                    const newColor = Color.rgb(newRgb);
                    setHue(newColor.hue()); setSaturation(newColor.saturationl()); setLightness(newColor.lightness());
                } catch(e) { console.error("Invalid RGB value", e); }
            }
        };
        return (
          <div className={cn("-space-x-px flex items-center shadow-sm", className)} {...props}>
            {rgb.map((value, index) => ( <Input key={index} type="text" value={value} onChange={e => handleChange(index, e.target.value)} className={cn("h-8 w-10 rounded-none bg-secondary px-2 text-xs shadow-none", index === 0 && "rounded-l-md", className )} /> ))}
            <PercentageInput value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          </div>
        );
    }
    if (mode === "css") {
        const rgbaString = `rgba(${color.rgb().array().map(Math.round).join(", ")}, ${alpha}%)`; // Alpha como %
        return ( <div className={cn("w-full shadow-sm", className)} {...props}> <Input type="text" className="h-8 w-full bg-secondary px-2 text-xs shadow-none" value={rgbaString} readOnly /> </div> );
    }
    if (mode === "hsl") {
        const hsl = color.hsl().array().map((value) => Math.round(value));
         const handleChange = (index: number, value: string) => {
            const numValue = Number(value);
             if (!isNaN(numValue)) {
                 const newHsl = [...hsl];
                 newHsl[index] = numValue;
                 // Adicionar validações de range para H(0-360), S(0-100), L(0-100)
                 try {
                     const newColor = Color.hsl(newHsl);
                     setHue(newColor.hue()); setSaturation(newColor.saturationl()); setLightness(newColor.lightness());
                 } catch(e) { console.error("Invalid HSL value", e); }
             }
        };
        return (
          <div className={cn("-space-x-px flex items-center shadow-sm", className)} {...props}>
            {hsl.map((value, index) => ( <Input key={index} type="text" value={value} onChange={e => handleChange(index, e.target.value)} className={cn("h-8 w-10 rounded-none bg-secondary px-2 text-xs shadow-none", index === 0 && "rounded-l-md", className)} /> ))}
            <PercentageInput value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          </div>
        );
    }
    return null;
};