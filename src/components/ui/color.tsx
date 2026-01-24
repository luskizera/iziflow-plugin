import type React from "react"
import {
  ColorArea as AriaColorArea,
  ColorField as AriaColorField,
  ColorPicker as AriaColorPicker,
  ColorSlider as AriaColorSlider,
  ColorSwatch as AriaColorSwatch,
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  ColorThumb as AriaColorThumb,
  ColorWheel as AriaColorWheel,
  ColorWheelTrack as AriaColorWheelTrack,
  SliderOutput as AriaSliderOutput,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

const ColorSlider = AriaColorSlider

const ColorField = AriaColorField

const ColorWheelTrack = AriaColorWheelTrack

const ColorPicker = AriaColorPicker

const SliderOutput = AriaSliderOutput

type AriaColorWheelProps = React.ComponentProps<typeof AriaColorWheel>
type AriaColorAreaProps = React.ComponentProps<typeof AriaColorArea>
type AriaSliderTrackProps = React.ComponentProps<typeof AriaSliderTrack>
type AriaColorThumbProps = React.ComponentProps<typeof AriaColorThumb>
type AriaColorSwatchPickerProps = React.ComponentProps<typeof AriaColorSwatchPicker>
type AriaColorSwatchPickerItemProps = React.ComponentProps<typeof AriaColorSwatchPickerItem>
type AriaColorSwatchProps = React.ComponentProps<typeof AriaColorSwatch>

interface ColorWheelProps
  extends Omit<AriaColorWheelProps, "outerRadius" | "innerRadius"> {
  outerRadius?: number
  innerRadius?: number
}

function ColorWheel({
  className,
  outerRadius = 100,
  innerRadius = 74,
  ...props
}: ColorWheelProps) {
  return (
    <AriaColorWheel
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      className={composeRenderProps(className, (className) => cn(className))}
      {...props}
    />
  )
}

function ColorArea({ className, ...props }: AriaColorAreaProps) {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (className) =>
        cn(
          "size-48 shrink-0 rounded-md border border-border shadow-md",
          className
        )
      )}
      {...props}
    />
  )
}

function SliderTrack({ className, ...props }: AriaSliderTrackProps) {
  return (
    <AriaSliderTrack
      className={composeRenderProps(className, (className) =>
        cn("h-2 w-48 rounded-md border border-border ", className)
      )}
      {...props}
    />
  )
}

function ColorThumb({ className, ...props }: AriaColorThumbProps) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (className) =>
        cn(
          "z-10 box-border size-5 rounded-[50%] border-2 top-1/2 border-white shadow-md",
          /* Focus Visible */
          "data-focus-visible:size-6",
          className
        )
      )}
      {...props}
    />
  )
}

function ColorSwatchPicker({
  className,
  ...props
}: AriaColorSwatchPickerProps) {
  return (
    <AriaColorSwatchPicker
      className={composeRenderProps(className, (className) =>
        cn("flex flex-wrap gap-2", className)
      )}
      {...props}
    />
  )
}

function ColorSwatchPickerItem({
  className,
  ...props
}: AriaColorSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem
      className={composeRenderProps(className, (className) =>
        cn(
          "size-8 overflow-hidden rounded-md border-2 ring-offset-background transition-colors",
          /* Selected */
          "data-selected:border-white",
          /* Disabled */
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          /* Focus Visible */
          "data-focus-visible:outline-none data-focus-visible:ring-2 data-focus-visible:ring-ring",
          className
        )
      )}
      {...props}
    />
  )
}

function ColorSwatch({ className, ...props }: AriaColorSwatchProps) {
  return (
    <AriaColorSwatch
      className={composeRenderProps(className, (className) =>
        cn("size-8", className)
      )}
      {...props}
    />
  )
}

export type { ColorWheelProps }
export {
  ColorSlider,
  ColorField,
  ColorWheelTrack,
  ColorWheel,
  ColorPicker,
  ColorArea,
  SliderTrack,
  SliderOutput,
  ColorThumb,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorSwatch,
}
