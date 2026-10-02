import { describe, it, expect } from "vitest";
import { Layout } from "../src-code/lib/layout";
import type { FlowNode, Connection } from "../shared/types/flow.types";

describe("Layout Engine", () => {
  describe("buildGraph", () => {
    it("should build adjacency list and inDegree correctly for linear flow", () => {
      const nodes: FlowNode[] = [
        { id: "A", type: "START", name: "Start" },
        { id: "B", type: "STEP", name: "Step B" },
        { id: "C", type: "END", name: "End" },
      ];

      const connections: Connection[] = [
        { from: "A", to: "B" },
        { from: "B", to: "C" },
      ];

      const { adjacencyList, inDegree } = Layout.buildGraph(nodes, connections);

      expect(adjacencyList["A"]).toEqual(["B"]);
      expect(adjacencyList["B"]).toEqual(["C"]);
      expect(adjacencyList["C"]).toEqual([]);

      expect(inDegree["A"]).toBe(0);
      expect(inDegree["B"]).toBe(1);
      expect(inDegree["C"]).toBe(1);
    });

    it("should ignore secondary connections in graph topology", () => {
      const nodes: FlowNode[] = [
        { id: "A", type: "START", name: "Start" },
        { id: "B", type: "STEP", name: "Step B" },
      ];

      const connections: Connection[] = [
        { from: "A", to: "B" },
        { from: "B", to: "A", secondary: true },
      ];

      const { adjacencyList, inDegree } = Layout.buildGraph(nodes, connections);

      expect(adjacencyList["B"]).toEqual([]);
      expect(inDegree["A"]).toBe(0);
      expect(inDegree["B"]).toBe(1);
    });
  });

  describe("topologicalSort", () => {
    it("should order linear flow nodes sequentially", () => {
      const nodes: FlowNode[] = [
        { id: "step2", type: "STEP", name: "Step 2" },
        { id: "start", type: "START", name: "Start" },
        { id: "step1", type: "STEP", name: "Step 1" },
        { id: "end", type: "END", name: "End" },
      ];

      const connections: Connection[] = [
        { from: "start", to: "step1" },
        { from: "step1", to: "step2" },
        { from: "step2", to: "end" },
      ];

      const sorted = Layout.topologicalSort(nodes, connections);
      const sortedIds = sorted.map((n) => n.id);

      expect(sortedIds).toEqual(["start", "step1", "step2", "end"]);
    });

    it("should sort bifurcated flows including branches and convergence", () => {
      const nodes: FlowNode[] = [
        { id: "decision", type: "DECISION", name: "Check" },
        { id: "start", type: "START", name: "Start" },
        { id: "branchA", type: "STEP", name: "Branch A" },
        { id: "branchB", type: "STEP", name: "Branch B" },
        { id: "end", type: "END", name: "End" },
      ];

      const connections: Connection[] = [
        { from: "start", to: "decision" },
        { from: "decision", to: "branchA" },
        { from: "decision", to: "branchB" },
        { from: "branchA", to: "end" },
        { from: "branchB", to: "end" },
      ];

      const sorted = Layout.topologicalSort(nodes, connections);
      expect(sorted).toHaveLength(5);

      const sortedIds = sorted.map((n) => n.id);
      expect(sortedIds.indexOf("start")).toBeLessThan(sortedIds.indexOf("decision"));
      expect(sortedIds.indexOf("decision")).toBeLessThan(sortedIds.indexOf("branchA"));
      expect(sortedIds.indexOf("decision")).toBeLessThan(sortedIds.indexOf("branchB"));
      expect(sortedIds.indexOf("branchA")).toBeLessThan(sortedIds.indexOf("end"));
      expect(sortedIds.indexOf("branchB")).toBeLessThan(sortedIds.indexOf("end"));
    });

    it("should handle cyclic graphs without hanging and order all nodes", () => {
      const nodes: FlowNode[] = [
        { id: "A", type: "STEP", name: "A" },
        { id: "B", type: "STEP", name: "B" },
        { id: "C", type: "STEP", name: "C" },
      ];

      // Pure cycle: A -> B -> C -> A
      const connections: Connection[] = [
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "C", to: "A" },
      ];

      const sorted = Layout.topologicalSort(nodes, connections);
      expect(sorted).toHaveLength(3);

      const uniqueIds = new Set(sorted.map((n) => n.id));
      expect(uniqueIds.size).toBe(3);
    });
  });

  describe("detectBinaryDecisions", () => {
    it("should identify binary decisions with two outgoing branches", () => {
      const nodes: FlowNode[] = [
        { id: "check", type: "DECISION", name: "Valid?" },
        { id: "ok", type: "STEP", name: "Success" },
        { id: "err", type: "STEP", name: "Error" },
      ];

      const connections: Connection[] = [
        { from: "check", to: "ok", label: "Yes" },
        { from: "check", to: "err", label: "No" },
      ];

      const bifurcations = Layout.detectBinaryDecisions(nodes, connections);
      expect(bifurcations).toHaveLength(1);
      expect(bifurcations[0].decisionNodeId).toBe("check");
      expect(bifurcations[0].branches.upper).toEqual(["ok"]);
      expect(bifurcations[0].branches.lower).toEqual(["err"]);
    });
  });
});
