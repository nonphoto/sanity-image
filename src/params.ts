import { VEC2, Vec2Like, ZERO2 } from "@thi.ng/vectors";
import { RectLike } from "./rect";

export type ImageFormat = "jpg" | "pjpg" | "png" | "webp";

export type FitMode =
  | "clip"
  | "crop"
  | "fill"
  | "fillmax"
  | "max"
  | "scale"
  | "min";

export type CropMode =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center"
  | "focalpoint"
  | "entropy";

export type AutoMode = "format";

export type Orientation = 0 | 90 | 180 | 270;

export type Dpr = 1 | 2 | 3;

export type SanityImageParams = {
  auto?: AutoMode;
  background?: string;
  blur?: number;
  crop?: CropMode;
  download?: boolean | string;
  dpr?: Dpr;
  fit?: FitMode;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  focalPoint?: { x: number; y: number };
  format?: ImageFormat;
  frame?: number;
  height?: number;
  invert?: boolean;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  orientation?: Orientation;
  pad?: number;
  quality?: number;
  rect?: { left: number; top: number; width: number; height: number };
  saturation?: number;
  sharpen?: number;
  width?: number;
};

type ValidEntry = [string, string | number | boolean];

function isValidEntry(entry: [unknown, unknown]): entry is ValidEntry {
  return (
    typeof entry[0] === "string" &&
    ["string", "number", "boolean"].includes(typeof entry[1])
  );
}

export function sanityImageParamsToSearchParamEntries({
  auto,
  background,
  blur,
  crop,
  download,
  dpr,
  fit,
  flipHorizontal,
  flipVertical,
  focalPoint,
  format,
  frame,
  height,
  invert,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  orientation,
  pad,
  quality,
  rect,
  saturation,
  sharpen,
  width,
}: SanityImageParams): string[][] {
  return Object.entries({
    auto,
    bg: background,
    blur,
    crop,
    dl: download,
    dpr,
    fit,
    flip: [flipHorizontal && "h", flipVertical && "v"].filter(Boolean).join(""),
    fm: format,
    "fp-x": focalPoint?.x,
    "fp-y": focalPoint?.y,
    frame,
    h: height,
    invert,
    "max-h": maxHeight,
    "max-w": maxWidth,
    "min-h": minHeight,
    "min-w": minWidth,
    or: orientation,
    pad,
    q: quality,
    rect: rect
      ? [rect.left, rect.top, rect.width, rect.height].map(Math.round).join(",")
      : undefined,
    sat: saturation,
    sharp: sharpen,
    w: width,
  })
    .filter(isValidEntry)
    .filter(([, value]) => typeof value === "number" || Boolean(value))
    .map(([key, value]) => [
      key,
      encodeURIComponent(typeof value === "number" ? Math.round(value) : value),
    ]);
}
