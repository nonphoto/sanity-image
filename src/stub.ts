import { isSanityImageAssetLike, SanityImageAssetLike } from "./asset";
import { SanityImageObject } from "./imageObject";
import { isSanityReference, SanityReference } from "./reference";

export type SanityImageSource =
  | SanityImageObject
  | SanityReference
  | SanityImageAssetLike
  | string;

export interface SanityImageAssetStub {
  id: string;
  width: number;
  height: number;
  format: string;
  vanityName?: string;
}

export function parseSanityImageAssetId(
  assetId: string
): SanityImageAssetStub | undefined {
  const matches = assetId.match(/^image-(\w+)-(\d+)x(\d+)-(\w+)$/);
  if (matches) {
    const [, id, width, height, format] = matches;
    return { id, width: Number(width), height: Number(height), format };
  }
}

export function sanityImageAssetId(source: SanityImageSource): string {
  return typeof source === "string"
    ? source
    : isSanityReference(source)
    ? source._ref
    : isSanityImageAssetLike(source)
    ? source._id
    : sanityImageAssetId(source.asset);
}

export function sanityImageAssetStub(
  source: SanityImageSource
): SanityImageAssetStub | undefined {
  const id = sanityImageAssetId(source);
  return id ? parseSanityImageAssetId(id) : undefined;
}
