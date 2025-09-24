import { SanityImageCrop } from "./crop";
import { SanityImageAssetStub } from "./stub";

export interface RectLike {
  pos: ArrayLike<number>;
  size: ArrayLike<number>;
}

export function rectFromCrop(
  asset: Pick<SanityImageAssetStub, "width" | "height">,
  crop: SanityImageCrop,
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
