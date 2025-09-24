import { ImageAsset } from "./asset";
import { defaultSrcsetWidths } from "./constants";
import { ImageOptions, imageOptionsToSearchParamEntries } from "./options";

export interface SanityClientLike {
  projectId: string;
  dataset: string;
}

export interface ImageOptionsWithVanityName extends ImageOptions {
  vanityName?: string;
}

export function imageUrl(
  client: SanityClientLike,
  asset: ImageAsset,
  options?: ImageOptionsWithVanityName,
): string | undefined {
  const url = new URL(
    [
      `https://cdn.sanity.io/images`,
      client.projectId,
      client.dataset,
      `${asset.assetId}-${asset.width}x${asset.height}.${asset.extension}`,
      options?.vanityName,
    ]
      .filter(Boolean)
      .join("/"),
  );
  if (options) {
    url.search = new URLSearchParams(
      imageOptionsToSearchParamEntries(options),
    ).toString();
  }
  return url.href;
}

export function imageSrcset(
  client: SanityClientLike,
  asset: ImageAsset,
  params?: (width: number) => Omit<ImageOptionsWithVanityName, "width">,
  widths: number[] = defaultSrcsetWidths,
): string | undefined {
  return [
    ...widths.sort((a, b) => a - b).filter((width) => width < asset.width),
    asset.width,
  ]
    .map((width) => {
      const url = imageUrl(client, asset, {
        ...params?.(width),
        width,
      });
      return `${url} ${width}w`;
    })
    .join(",");
}
