import {
  InferOutput,
  is,
  nullish,
  number,
  object,
  string,
  union,
} from "valibot";
import { cropSchema } from "./crop";
import { hotspotSchema } from "./hotspot";
import { rectFromCrop } from "./rect";
import { Transformations, transformationsSchema } from "./transformations";

export type ImageSource =
  | ImageObject
  | ImageAsset
  | AssetLike
  | ReferenceLike
  | string;

export type AssetLike = InferOutput<typeof assetLikeSchema>;

export type ReferenceLike = InferOutput<typeof referenceLikeSchema>;

export type ImageObject = InferOutput<typeof imageObjectSchema>;

export type ImageAsset = InferOutput<typeof imageAssetSchema>;

export const assetLikeSchema = object({
  _id: string(),
});

export const referenceLikeSchema = object({
  _ref: string(),
});

export const imageObjectSchema = object({
  asset: nullish(union([assetLikeSchema, referenceLikeSchema, string()])),
  crop: nullish(cropSchema),
  hotspot: nullish(hotspotSchema),
});

export const imageAssetSchema = object({
  _id: string(),
  assetId: string(),
  width: number(),
  height: number(),
  extension: string(),
  vanityName: nullish(string()),
  transformations: nullish(transformationsSchema),
});

export function isAssetLike(input: unknown): input is AssetLike {
  return is(assetLikeSchema, input);
}

export function isReferenceLike(input: unknown): input is ReferenceLike {
  return is(referenceLikeSchema, input);
}

export function isImageObject(input: unknown): input is ImageObject {
  return is(imageObjectSchema, input);
}

export function isImageAsset(input: unknown): input is ImageAsset {
  return is(imageAssetSchema, input);
}

export function assetIdFromSource(source: ImageSource): string | undefined {
  return typeof source === "string"
    ? source
    : isAssetLike(source)
      ? source._id
      : isReferenceLike(source)
        ? source._ref
        : isImageObject(source) && source.asset
          ? assetIdFromSource(source.asset)
          : undefined;
}

export function parseAssetId(id: string): ImageAsset | undefined {
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

export function imageAssetFromSource(
  source: ImageSource,
): ImageAsset | undefined {
  if (typeof source === "object" && "assetId" in source) {
    return source;
  } else {
    const id = assetIdFromSource(source);
    const asset = id ? parseAssetId(id) : undefined;
    return asset
      ? imageAssetWithTransformations(asset, {
          rect:
            typeof source === "object" && "crop" in source && source.crop
              ? rectFromCrop(asset, source.crop)
              : undefined,
        })
      : undefined;
  }
}

export function imageAssetWithTransformations(
  asset: ImageAsset,
  transformations: Transformations,
): ImageAsset {
  return {
    ...asset,
    transformations: { ...asset.transformations, ...transformations },
  };
}
