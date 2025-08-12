import {
  SanityImageParams,
  sanityImageParamsToSearchParamEntries,
} from "./params";
import { SanityImageAssetStub } from "./stub";

export const defaultSrcsetWidths = [
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

export interface SanityClientLike {
  projectId: string;
  dataset: string;
}

export function sanityImageUrl(
  client: SanityClientLike,
  image: SanityImageAssetStub,
  params?: SanityImageParams
): string {
  const url = new URL(
    [
      `https://cdn.sanity.io/images`,
      client.projectId,
      client.dataset,
      `${image.id}-${image.width}x${image.height}.${image.format}`,
      image.vanityName,
    ]
      .filter(Boolean)
      .join("/")
  );
  if (params) {
    url.search = new URLSearchParams(
      sanityImageParamsToSearchParamEntries(params)
    ).toString();
  }
  return url.href;
}

export function sanityImageSrcset(
  client: SanityClientLike,
  image: SanityImageAssetStub,
  params?: Omit<SanityImageParams, "width">,
  widths: number[] = defaultSrcsetWidths
): string {
  const aspectRatio = image.height / image.width;
  return [
    ...widths.sort((a, b) => a - b).filter((width) => width < image.width),
    image.width,
  ]
    .map((width) => {
      const url = sanityImageUrl(client, image, {
        ...params,
        width,
        height: width * aspectRatio,
      });
      return `${url} ${width}w`;
    })
    .join(",");
}
