import type { narutoCharacter } from "./types";
import {
  hashirama,
  hinata,
  jiraya,
  kakashi,
  naruto,
  obito,
  rocklee,
  sakura,
  sasuke,
} from "./svgs";

const svgMapping: Record<narutoCharacter, string> = {
  hinata: hinata,
  naruto: naruto,
  hashirama: hashirama,
  jiraya: jiraya,
  kakashi: kakashi,
  obito: obito,
  rocklee: rocklee,
  sakura: sakura,
  sasuke: sasuke,
};

export default svgMapping;
