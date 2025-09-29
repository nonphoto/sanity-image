import { InferOutput, is, number, object, tuple } from "valibot";
import { ImageAsset } from "./asset";
import { Crop } from "./crop";

export const rectSchema = object({
  pos: tuple([number(), number()]),
  size: tuple([number(), number()]),
});

export type Rect = InferOutput<typeof rectSchema>;

export function isRect(input: unknown): input is Rect {
  return is(rectSchema, input);
}

export function rectFromCrop(
  asset: Pick<ImageAsset, "width" | "height">,
  crop: Crop,
): Rect {
  const left = Math.max(crop.left ?? 0, 0);
  const right = Math.max(crop.right ?? 0, 0);
  const top = Math.max(crop.top ?? 0, 0);
  const bottom = Math.max(crop.bottom ?? 0, 0);
  return {
    pos: [left * asset.width, top * asset.height],
    size: [(1 - left - right) * asset.width, (1 - top - bottom) * asset.height],
  };
}
