import { ImageAsset, imageAssetWithTransformations } from "./asset";
import { srcsetWidths } from "./constants";
import { transformationsToURLSearch } from "./transformations";

export interface SanityClientLike {
  projectId: string;
  dataset: string;
}


/**
 * Get the URL of the image to be used in the `src` attribute.
 */
export function imageUrl(client: SanityClientLike, asset: ImageAsset): string {
  const url = new URL(
    [
      "https://cdn.sanity.io/images",
      client.projectId,
      client.dataset,
      `${asset.assetId}-${asset.width}x${asset.height}.${asset.extension}`,
      asset.vanityName,
    ]
      .filter(Boolean)
      .join("/"),
  );
  if (asset.transformations) {
    url.search = transformationsToURLSearch(asset.transformations);
  }
  return url.href;
}

export function imageSrcset(
  client: SanityClientLike,
  asset: ImageAsset,
  widths: number[] = srcsetWidths.default,
): string | undefined {
  return widths
    .sort((a, b) => a - b)
    .filter((width) => width < asset.width)
    .map(Math.round)
    .map((width) => {
      const url = imageUrl(
        client,
        imageAssetWithTransformations(asset, {
          width,
        }),
      );
      return `${url} ${width}w`;
    })
    .join(",");
}

/**
 * Calculates the aspect ratio of an image, taking its transformations into account.
 * @param asset - The asset to calculate the aspect ratio of
 * @returns The aspect ratio of the image
 * @todo This function currently ignores the `crop` mode settings including focal point
 * and min/max height/width.
 */
export function imageAspectRatio(asset: ImageAsset): number {
  const size: [number, number] =
    asset.transformations &&
    ["crop", "fill", "fillmax", "scale", "min"].includes(
      asset.transformations.fit ?? "",
    ) &&
    asset.transformations.width != null &&
    asset.transformations.height != null
      ? [asset.transformations.width, asset.transformations.height]
      : asset.transformations?.rect
        ? asset.transformations.rect.size
        : [asset.width, asset.height];
  return size[0] / size[1];
}
