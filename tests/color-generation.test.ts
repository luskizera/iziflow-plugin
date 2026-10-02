import { describe, it, expect } from "vitest";
import { generateCustomAccentPalette, clampRgb } from "../src-code/utils/color-generation";
import { hexToRgb } from "../src-code/utils/hexToRgb";

describe("Color Utilities", () => {
  describe("hexToRgb", () => {
    it("should convert white #FFFFFF to normalized {1, 1, 1}", () => {
      const rgb = hexToRgb("#FFFFFF");
      expect(rgb.r).toBeCloseTo(1);
      expect(rgb.g).toBeCloseTo(1);
      expect(rgb.b).toBeCloseTo(1);
    });

    it("should convert black #000000 to normalized {0, 0, 0}", () => {
      const rgb = hexToRgb("#000000");
      expect(rgb.r).toBeCloseTo(0);
      expect(rgb.g).toBeCloseTo(0);
      expect(rgb.b).toBeCloseTo(0);
    });

    it("should convert custom hex #3860FF correctly", () => {
      const rgb = hexToRgb("#3860FF");
      expect(rgb.r).toBeCloseTo(56 / 255);
      expect(rgb.g).toBeCloseTo(96 / 255);
      expect(rgb.b).toBeCloseTo(255 / 255);
    });
  });

  describe("clampRgb", () => {
    it("should keep values inside [0, 1] unchanged", () => {
      expect(clampRgb({ r: 0.2, g: 0.5, b: 0.8 })).toEqual({
        r: 0.2,
        g: 0.5,
        b: 0.8,
      });
    });

    it("should clamp values below 0 to 0 and above 1 to 1", () => {
      expect(clampRgb({ r: -0.5, g: 1.5, b: 0 })).toEqual({
        r: 0,
        g: 1,
        b: 0,
      });
    });
  });

  describe("generateCustomAccentPalette", () => {
    it("should generate 12 tonal steps in light mode", () => {
      const palette = generateCustomAccentPalette("#3860FF", "light");
      const steps = Object.keys(palette);

      expect(steps).toHaveLength(12);
      for (let i = 1; i <= 12; i++) {
        const step = palette[String(i)];
        expect(step).toBeDefined();
        expect(step.r).toBeGreaterThanOrEqual(0);
        expect(step.r).toBeLessThanOrEqual(1);
        expect(step.g).toBeGreaterThanOrEqual(0);
        expect(step.g).toBeLessThanOrEqual(1);
        expect(step.b).toBeGreaterThanOrEqual(0);
        expect(step.b).toBeLessThanOrEqual(1);
      }
    });

    it("should generate 12 tonal steps in dark mode", () => {
      const palette = generateCustomAccentPalette("#3860FF", "dark");
      const steps = Object.keys(palette);

      expect(steps).toHaveLength(12);
      for (let i = 1; i <= 12; i++) {
        const step = palette[String(i)];
        expect(step).toBeDefined();
        expect(step.r).toBeGreaterThanOrEqual(0);
        expect(step.r).toBeLessThanOrEqual(1);
        expect(step.g).toBeGreaterThanOrEqual(0);
        expect(step.g).toBeLessThanOrEqual(1);
        expect(step.b).toBeGreaterThanOrEqual(0);
        expect(step.b).toBeLessThanOrEqual(1);
      }
    });

    it("should safely fallback when given invalid hex format", () => {
      const palette = generateCustomAccentPalette("invalid_hex", "light");
      expect(Object.keys(palette)).toHaveLength(12);
    });
  });
});
