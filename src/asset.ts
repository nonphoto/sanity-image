export interface AssetLike {
  _id: string;
}

export interface Reference {
  _ref: string;
}

export interface ImageAsset {
  _id: string;
  assetId: string;
  width: number;
  height: number;
  extension: string;
}

export type ImageAssetSource =
  | {
      asset: ImageAssetSource;
    }
  | ImageAsset
  | AssetLike
  | Reference
  | string;

export function isAssetLike(input: unknown): input is AssetLike {
  return (
    input != null &&
    typeof input === "object" &&
    "_id" in input &&
    typeof input._id === "string"
  );
}

export function isReference(input: unknown): input is Reference {
  return (
    input != null &&
    typeof input === "object" &&
    "_ref" in input &&
    typeof input._ref === "string"
  );
}

export function isImageAsset(input: unknown): input is ImageAsset {
  return (
    input != null &&
    typeof input === "object" &&
    "assetId" in input &&
    typeof input.assetId === "string" &&
    "width" in input &&
    typeof input.width === "number" &&
    "height" in input &&
    typeof input.height === "number" &&
    "extension" in input &&
    typeof input.extension === "string"
  );
}

export function hasAssetProp(
  input: unknown,
): input is { asset: NonNullable<unknown> } {
  return input != null && typeof input === "object" && "asset" in input;
}

export function imageIdFromSource(source: ImageAssetSource): string {
  return typeof source === "string"
    ? source
    : isReference(source)
      ? source._ref
      : isAssetLike(source)
        ? source._id
        : imageIdFromSource(source.asset);
}

export function imageIdFromUnknown(input: unknown): string | undefined {
  return typeof input === "string"
    ? input
    : isReference(input)
      ? input._ref
      : isAssetLike(input)
        ? input._id
        : hasAssetProp(input)
          ? imageIdFromUnknown(input.asset)
          : undefined;
}

export function imageAsset(id: string): ImageAsset | undefined {
  const matches = id.match(/^image-(\w+)-(\d+)x(\d+)-(\w+)$/);
  if (matches) {
    const [, assetId, width, height, extension] = matches;
    return {
      _id: id,
      assetId,
      width: Number(width),
      height: Number(height),
      extension,
    };
  }
}

export function imageAssetFromUnknown(input: unknown): ImageAsset | undefined {
  if (isImageAsset(input)) {
    return input;
  } else {
    const id = imageIdFromUnknown(input);
    return id ? imageAsset(id) : undefined;
  }
}
