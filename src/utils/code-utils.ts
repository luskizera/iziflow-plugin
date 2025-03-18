import type { FlowData } from "@/lib/types";

export type EventTS = {
  "generate-flow": {
    json: string;
    data?: FlowData;
  };
  "closePlugin": void;
};