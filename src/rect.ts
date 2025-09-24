import { ImageAsset } from "./asset";
import { Crop } from "./crop";

export interface RectLike {
  pos: ArrayLike<number>;
  size: ArrayLike<number>;
}

export function rectFromCrop(
  asset: Pick<ImageAsset, "width" | "height">,
  crop: Crop,
): RectLike {
  const left = crop.left ?? 0;
  const right = crop.right ?? 0;
  const top = crop.top ?? 0;
  const bottom = crop.bottom ?? 0;
  return {
    pos: [left * asset.width, right * asset.width],
    size: [(1 - left - right) * asset.width, (1 - top - bottom) * asset.height],
  };
}
