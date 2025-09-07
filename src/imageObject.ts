import { isSanityImageAssetLike, SanityImageAssetLike } from "./asset";
import { isSanityReference, SanityReference } from "./reference";

export interface SanityImageObject {
  asset: SanityImageAssetLike | SanityReference;
}

export function isSanityImageObject(x: any): x is SanityImageObject {
  return (
    x != null &&
    typeof x === "object" &&
    "asset" in x &&
    (isSanityImageAssetLike(x.asset) || isSanityReference(x.asset))
  );
}
