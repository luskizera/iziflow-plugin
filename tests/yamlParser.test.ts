import { describe, it, expect } from "vitest";
import { parseYAMLToFlow, parseUnit } from "../src-code/lib/yamlParser";

describe("YAML Parser", () => {
  describe("parseUnit", () => {
    const baseUnit = 300;

    it("should parse number values directly", () => {
      expect(parseUnit(150, baseUnit)).toBe(150);
      expect(parseUnit(0, baseUnit)).toBe(0);
    });

    it("should parse 'u' units proportional to baseUnit", () => {
      expect(parseUnit("1u", baseUnit)).toBe(300);
      expect(parseUnit("2u", baseUnit)).toBe(600);
      expect(parseUnit("0.5u", baseUnit)).toBe(150);
    });

    it("should parse 'px' units to absolute values", () => {
      expect(parseUnit("400px", baseUnit)).toBe(400);
      expect(parseUnit("50px", baseUnit)).toBe(50);
    });

    it("should parse numeric strings without unit suffix", () => {
      expect(parseUnit("200", baseUnit)).toBe(200);
    });

    it("should throw on invalid unit strings", () => {
      expect(() => parseUnit("invalid", baseUnit)).toThrow("Formato de unidade inválido");
      expect(() => parseUnit("abc-u", baseUnit)).toThrow();
    });
  });

  describe("parseYAMLToFlow", () => {
    it("should parse a valid YAML flow correctly", () => {
      const validYAML = `
metadata:
  name: Fluxo de Teste
  layout:
    algorithm: auto
    unit: 200
    first_node_position: center
    spacing:
      horizontal: 1u
      vertical: 0.5u

nodes:
  inicio:
    type: ENTRYPOINT
    name: Tela Inicial
  etapa1:
    type: STEP
    name: Preencher Dados
  fim:
    type: END
    name: Conclusão

connections:
  - from: inicio
    to: etapa1
  - from: etapa1
    to: fim
`;

      const result = parseYAMLToFlow(validYAML);
      expect(result.flowName).toBe("Fluxo de Teste");
      expect(result.nodes).toHaveLength(3);
      expect(result.connections).toHaveLength(2);
      expect(result.layoutConfig.unit).toBe(200);
      expect(result.layoutConfig.spacing.horizontal).toBe(200);
      expect(result.layoutConfig.spacing.vertical).toBe(100);
    });

    it("should support 'secondary' flag on connections", () => {
      const yamlWithSecondary = `
metadata:
  name: Fluxo com Retorno
  layout:
    algorithm: auto
    unit: 100
nodes:
  n1:
    type: STEP
    name: Nó 1
  n2:
    type: STEP
    name: Nó 2
connections:
  - from: n1
    to: n2
  - from: n2
    to: n1
    secondary: true
`;
      const result = parseYAMLToFlow(yamlWithSecondary);
      expect(result.connections).toHaveLength(2);
      expect(result.connections[1].secondary).toBe(true);
      expect(result.connections[0].secondary).toBeUndefined();
    });

    it("should reject YAML referencing unknown connection nodes", () => {
      const invalidYAML = `
metadata:
  layout:
    algorithm: auto
    unit: 100
nodes:
  n1:
    type: STEP
    name: Nó 1
connections:
  - from: n1
    to: no_inexistente
`;
      expect(() => parseYAMLToFlow(invalidYAML)).toThrow(
        /references unknown destination node "no_inexistente"/
      );
    });

    it("should reject YAML with circular anchor references", () => {
      const circularAnchorYAML = `
metadata:
  layout:
    algorithm: auto
    unit: 100
nodes:
  a:
    type: STEP
    name: A
    position:
      anchor: b
  b:
    type: STEP
    name: B
    position:
      anchor: a
connections: []
`;
      expect(() => parseYAMLToFlow(circularAnchorYAML)).toThrow(
        /Circular anchor dependency/
      );
    });

    it("should reject YAML with non-existent anchor", () => {
      const badAnchorYAML = `
metadata:
  layout:
    algorithm: auto
    unit: 100
nodes:
  a:
    type: STEP
    name: A
    position:
      anchor: anchor_fantasma
connections: []
`;
      expect(() => parseYAMLToFlow(badAnchorYAML)).toThrow(
        /references non-existent anchor "anchor_fantasma"/
      );
    });
  });
});
