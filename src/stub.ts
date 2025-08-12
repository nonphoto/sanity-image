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

export function sanityImageAssetStub(
  source: unknown
): SanityImageAssetStub | undefined {
  const id = sanityImageAssetId(source);
  return id ? parseSanityImageAssetId(id) : undefined;
}

export function sanityImageAssetId(source: unknown): string | undefined {
  return typeof source === "string"
    ? source
    : typeof source === "object" && source != null
    ? "_ref" in source && typeof source._ref === "string"
      ? source._ref
      : "_id" in source && typeof source._id === "string"
      ? source._id
      : "asset" in source
      ? sanityImageAssetId(source.asset)
      : undefined
    : undefined;
}
