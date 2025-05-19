import imageUrlBuilder from "@sanity/image-url";
import { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type {
  SanityClientLike,
  SanityImageCrop,
  SanityImageDimensions,
  SanityImageSource,
  SanityModernClientLike,
  SanityProjectDetails,
} from "@sanity/image-url/lib/types/types.js";

export interface Metadata {
  lqip?: string;
  dimensions?: SanityImageDimensions;
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

const fitComparators = {
  cover: Math.max,
  contain: Math.min,
  mean: (a: number, b: number) => (a + b) / 2,
};

function fit(
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

function isCrop(x: any): x is SanityImageCrop {
  return (
    x &&
    typeof x == "object" &&
    "top" in x &&
    typeof x.top === "number" &&
    "right" in x &&
    typeof x.right === "number" &&
    "bottom" in x &&
    typeof x.bottom === "number" &&
    "left" in x &&
    typeof x.left === "number"
  );
}

export function imageProps({
  client,
  image,
  metadata,
  widths,
  quality = defaultQuality,
  aspectRatio,
}: {
  client: SanityClientLike | SanityProjectDetails | SanityModernClientLike;
  image: SanityImageSource;
  metadata?: Metadata;
  widths?: number[];
  quality?: number;
  aspectRatio?: number;
}): {
  src: string;
  srcset?: string;
  naturalWidth?: number;
  naturalHeight?: number;
} {
  const builder = imageUrlBuilder(client)
    .image(image)
    .quality(quality)
    .auto("format");
  const crop =
    typeof image == "object" && "crop" in image && isCrop(image.crop)
      ? image.crop
      : undefined;
  const cropSize = metadata?.dimensions
    ? crop
      ? {
          width: metadata.dimensions.width - crop.left - crop.right,
          height: metadata.dimensions.height - crop.top - crop.bottom,
        }
      : metadata.dimensions
    : undefined;

  const naturalSize = cropSize
    ? aspectRatio
      ? fit({ width: 1, height: aspectRatio }, cropSize, "contain")
      : cropSize
    : undefined;
  const url = buildAspectRatio(builder, lowResWidth, aspectRatio).url();
  return {
    src: widths ? url : metadata?.lqip ?? url,
    srcset: widths
      ? Array.from(widths)
          .sort((a, b) => a - b)
          .map(
            (width) =>
              `${buildAspectRatio(builder, width, aspectRatio).url()} ${width}w`
          )
          .join(",")
      : undefined,
    naturalWidth: naturalSize?.width,
    naturalHeight: naturalSize?.height,
  };
}
