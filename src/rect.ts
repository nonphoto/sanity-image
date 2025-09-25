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
  const left = Math.max(crop.left ?? 0, 0);
  const right = Math.max(crop.right ?? 0, 0);
  const top = Math.max(crop.top ?? 0, 0);
  const bottom = Math.max(crop.bottom ?? 0, 0);
  return {
    pos: [left * asset.width, top * asset.height],
    size: [(1 - left - right) * asset.width, (1 - top - bottom) * asset.height],
  };
}
