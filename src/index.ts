import imageUrlBuilder from "@sanity/image-url";
import type {
  SanityAsset,
  SanityClientLike,
  SanityImageCrop,
  SanityImageDimensions,
  SanityImageHotspot,
  SanityModernClientLike,
  SanityProjectDetails,
} from "@sanity/image-url/lib/types/types.js";

export * from "@sanity/image-url/lib/types/types.js";

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

function cropAxis(length?: number, insetStart?: number, insetEnd?: number) {
  return length
    ? length * (1 - (insetStart ?? 0) - (insetEnd ?? 0))
    : undefined;
}

export function imageProps({
  image,
  client,
  widths,
  quality = defaultQuality,
}: {
  image: SanityImageObjectWithMetadata;
  client: SanityClientLike | SanityProjectDetails | SanityModernClientLike;
  widths: number[];
  quality?: number;
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

  return {
    src:
      typeof metadata?.lqip === "string"
        ? metadata.lqip
        : builder.width(lowResWidth).url().toString(),
    srcset: sortedWidths
      .map((width) => `${builder.width(width).url()} ${width}w`)
      .join(","),
    naturalWidth: cropAxis(
      metadata?.dimensions?.width,
      image.crop?.left,
      image.crop?.right
    ),
    naturalHeight: cropAxis(
      metadata?.dimensions?.height,
      image.crop?.top,
      image.crop?.bottom
    ),
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
