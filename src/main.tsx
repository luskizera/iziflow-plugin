import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { narutoCharacter } from "./lib/types";
import { dispatchTS } from "./utils/utils";
import svgs from "./lib/svgs";

export const App = () => {
  const [selectedSvg, setSelectedSvg] = useState<narutoCharacter>();

  const onClickCreate = () => {
    if (!selectedSvg) {
      return;
    }
    dispatchTS("createSvg", {
      svg: selectedSvg,
    });
  };

  const onClickClose = () => {
    dispatchTS("closePlugin", {});
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-center gap-4 py-10">
        <h1 className="text-xl font-medium">Select Naruto Character</h1>
        <Select
          onValueChange={(value: narutoCharacter) => setSelectedSvg(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="select" />
          </SelectTrigger>
          <SelectContent>
            {svgs.map((svg) => (
              <SelectItem key={svg} value={svg}>
                {svg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-row gap-4">
          <Button onClick={onClickCreate} size={"sm"}>
            Create
          </Button>
          <Button variant={"destructive"} size={"sm"} onClick={onClickClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
};
