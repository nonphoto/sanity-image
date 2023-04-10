import imageUrlBuilder from "@sanity/image-url";
import { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type {
  SanityAsset,
  SanityClientLike,
  SanityImageCrop,
  SanityImageDimensions,
  SanityImageHotspot,
  SanityModernClientLike,
  SanityProjectDetails,
} from "@sanity/image-url/lib/types/types.js";

export type SanityAssetWithMetadata = SanityAsset & {
  metadata?: {
    lqip?: string;
    dimensions?: SanityImageDimensions;
  };
};

export interface SanityImageObjectWithMetadata {
  asset: SanityAssetWithMetadata;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
}

export type Size = {
  width: number;
  height: number;
};

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
    return builder.width(width).height(width * aspectRatio);
  } else {
    return builder.width(width);
  }
}

export function imageProps({
  image,
  client,
  widths,
  quality = defaultQuality,
  aspectRatio,
}: {
  image: SanityImageObjectWithMetadata;
  client: SanityClientLike | SanityProjectDetails | SanityModernClientLike;
  widths: number[];
  quality?: number;
  aspectRatio?: number;
}): {
  src: string;
  srcset: string;
  naturalWidth?: number;
  naturalHeight?: number;
} {
  const sortedWidths = Array.from(widths).sort((a, b) => a - b);

  const builder = imageUrlBuilder(client)
    .image(image)
    .quality(quality)
    .auto("format");

  const metadata = image.asset.metadata;

  const cropSize =
    image.crop && metadata?.dimensions
      ? {
          width: metadata.dimensions.width - image.crop.left - image.crop.right,
          height:
            metadata.dimensions.height - image.crop.top - image.crop.bottom,
        }
      : undefined;

  const naturalSize = cropSize
    ? aspectRatio
      ? fit({ width: 1, height: aspectRatio }, cropSize, "contain")
      : cropSize
    : metadata?.dimensions;

  return {
    src:
      metadata?.lqip ??
      buildAspectRatio(builder, lowResWidth, aspectRatio).url(),
    srcset: sortedWidths
      .map(
        (width) =>
          `${buildAspectRatio(builder, width, aspectRatio).url()} ${width}w`
      )
      .join(","),
    naturalWidth: naturalSize?.width,
    naturalHeight: naturalSize?.height,
  };
}

export function metaImageUrl({
  image,
  client,
  width = defaultMetaImageWidth,
  quality = defaultQuality,
}: {
  image: SanityImageObjectWithMetadata;
  client: SanityClientLike | SanityProjectDetails | SanityModernClientLike;
  width: number;
  quality?: number;
}) {
  return imageUrlBuilder(client)
    .image(image)
    .quality(quality)
    .auto("format")
    .width(width)
    .url();
}
