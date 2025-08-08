import imageUrlBuilder from "@sanity/image-url";
import { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type {
  SanityAsset,
  SanityClientLike,
  SanityImageCrop,
  SanityImageDimensions,
  SanityImageHotspot,
  SanityImageObject,
  SanityImageSource,
  SanityModernClientLike,
  SanityProjectDetails,
  SanityReference,
} from "@sanity/image-url/lib/types/types.js";

export interface SanityImageObjectLike
  extends Pick<SanityImageObject, "asset"> {
  [key: string]: any;
}

export interface SanityImageMetadata {
  lqip?: string;
  dimensions?: SanityImageDimensions;
  [key: string]: any;
}

export interface Size {
  width: number;
  height: number;
}

export const defaultWidths = [
  6016, // 6K
  5120, // 5K
  4480, // 4.5K
  3840, // 4K
  3200, // QHD+
  2560, // WQXGA
  2048, // QXGA
  1920, // 1080p
  1668, // iPad
  1280, // 720p
  1080, // iPhone 6-8 Plus
  960,
  720, // iPhone 6-8
  640, // 480p
  480,
  360,
  240,
];

export const lowResWidth = 24;

export const defaultMetaImageWidth = 1200;

export const defaultQuality = 90;

export const fitComparators = {
  cover: Math.max,
  contain: Math.min,
};

// TODO: impement comparators for every FitMode
export function fit(
  containee: Size,
  container: Size,
  mode: keyof typeof fitComparators
) {
  const sx = container.width / containee.width;
  const sy = container.height / containee.height;
  const s = fitComparators[mode](sx, sy);
  return {
    width: containee.width * s,
    height: containee.height * s,
  };
}

function buildAspectRatio(
  builder: ImageUrlBuilder,
  width: number,
  aspectRatio?: number
) {
  if (aspectRatio) {
    return builder.width(width).height(Math.round(width * aspectRatio));
  } else {
    return builder.width(width);
  }
}

export function isCrop(x: unknown): x is SanityImageCrop {
  return (
    x != null &&
    typeof x == "object" &&
    "top" in x &&
    typeof x.top === "number" &&
    "right" in x &&
    typeof x.right === "number" &&
    "bottom" in x &&
    typeof x.bottom === "number" &&
    "left" in x &&
    typeof x.left === "number" &&
    ("_type" in x
      ? typeof x._type === "undefined" || typeof x._type === "string"
      : true)
  );
}

export function isHotspot(x: unknown): x is SanityImageHotspot {
  return (
    x != null &&
    typeof x == "object" &&
    "width" in x &&
    typeof x.width === "number" &&
    "height" in x &&
    typeof x.height === "number" &&
    "x" in x &&
    typeof x.x === "number" &&
    "y" in x &&
    typeof x.y === "number" &&
    ("_type" in x
      ? typeof x._type === "undefined" || typeof x._type === "string"
      : true)
  );
}

export function isImageObjectLike(x: unknown): x is SanityImageObjectLike {
  return (
    x != null &&
    typeof x === "object" &&
    "asset" in x &&
    (isAsset(x) || isReference(x))
  );
}

export function isImageObject(x: unknown): x is SanityImageObject {
  return (
    isImageObjectLike(x) &&
    ("crop" in x ? typeof x.crop === "undefined" || isCrop(x.crop) : true) &&
    ("hotspot" in x
      ? typeof x.hotspot === "undefined" || isHotspot(x.hotspot)
      : true)
  );
}

export function isReference(x: unknown): x is SanityReference {
  return (
    x != null &&
    typeof x === "object" &&
    "_ref" in x &&
    typeof x._ref === "string"
  );
}

export function isAsset(x: unknown): x is SanityAsset {
  return (
    x != null &&
    typeof x === "object" &&
    "_type" in x &&
    x._type === "sanity.asset"
  );
}

export function isDimensions(x: unknown): x is SanityImageDimensions {
  return (
    x != null &&
    typeof x === "object" &&
    "aspectRatio" in x &&
    typeof x.aspectRatio === "number" &&
    "width" in x &&
    typeof x.width === "number" &&
    "height" in x &&
    typeof x.height === "number"
  );
}

export function isSize(x: unknown): x is Size {
  return (
    x != null &&
    typeof x === "object" &&
    "width" in x &&
    typeof x.width === "number" &&
    "height" in x &&
    typeof x.height === "number"
  );
}

export function isMetadata(x: unknown): x is SanityImageMetadata {
  return (
    x != null &&
    typeof x === "object" &&
    "lqip" in x &&
    typeof x.lqip === "string" &&
    "dimensions" in x &&
    isDimensions(x.dimensions)
  );
}

export interface ImagePropsOptions {
  client: SanityClientLike | SanityProjectDetails | SanityModernClientLike;
  source: SanityImageSource;
  widths?: number[];
  quality?: number;
  aspectRatio?: number;
}

export interface ImagePropsReturn {
  src: string;
  srcset?: string;
}

export function imageProps({
  client,
  source,
  widths = defaultWidths,
  quality = defaultQuality,
  aspectRatio,
}: ImagePropsOptions): ImagePropsReturn {
  const builder = imageUrlBuilder(client)
    .image(source)
    .quality(quality)
    .auto("format");
  const url = buildAspectRatio(builder, lowResWidth, aspectRatio).url();
  return {
    src: url,
    srcset:
      widths.length > 0
        ? widths
            .sort((a, b) => a - b)
            .map(
              (width) =>
                `${buildAspectRatio(
                  builder,
                  width,
                  aspectRatio
                ).url()} ${width}w`
            )
            .join(",")
        : undefined,
  };
}

export function croppedSize(intrinsicSize: Size, crop: SanityImageCrop): Size {
  return {
    width: intrinsicSize.width - crop.left - crop.right,
    height: intrinsicSize.height - crop.top - crop.bottom,
  };
}

export function aspectRatio(size: Size): number {
  return size.height / size.width;
}

export function imageCroppedSize(source: SanityImageSource): Size | undefined {
  const imageObject = isImageObject(source) ? source : undefined;
  const dimensions =
    imageObject &&
    isAsset(imageObject.asset) &&
    isDimensions(imageObject.asset.dimensions)
      ? imageObject.asset.dimensions
      : isAsset(source) && isDimensions(source.dimensions)
      ? source.dimensions
      : undefined;
  return dimensions
    ? imageObject?.crop
      ? croppedSize(dimensions, imageObject.crop)
      : dimensions
    : undefined;
}

export function imageAspectRatio(
  source: SanityImageSource
): number | undefined {
  const size = imageCroppedSize(source);
  return size ? aspectRatio(size) : undefined;
}
