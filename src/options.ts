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

export type ImageOptions = {
  auto?: AutoMode;
  background?: string;
  blur?: number;
  crop?: CropMode;
  download?: boolean | string;
  dpr?: Dpr;
  fit?: FitMode;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  focalPoint?: ArrayLike<number>;
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
  rect?: RectLike;
  saturation?: number;
  sharpen?: number;
  width?: number;
};

function entry(
  key: string,
  value: string | number | boolean | null | undefined,
): [string, string] | undefined {
  return value == null || value === false
    ? undefined
    : [key, String(typeof value === "number" ? Math.round(value) : value)];
}

export function imageOptionsToURLSearch({
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
}: ImageOptions): string {
  return (
    "?" +
    [
      entry("auto", auto),
      entry("bg", background),
      entry("blur", blur),
      entry("crop", crop),
      entry("dl", download),
      entry("dpr", dpr),
      entry("fit", fit),
      entry(
        "flip",
        flipHorizontal || flipVertical
          ? [flipHorizontal && "h", flipVertical && "v"]
              .filter(Boolean)
              .join("")
          : undefined,
      ),
      entry("fm", format),
      entry("fp-x", focalPoint?.[0]),
      entry("fp-y", focalPoint?.[1]),
      entry("frame", frame),
      entry("h", height),
      entry("invert", invert),
      entry("max-h", maxHeight),
      entry("max-w", maxWidth),
      entry("min-h", minHeight),
      entry("min-w", minWidth),
      entry("or", orientation),
      entry("pad", pad),
      entry("q", quality),
      entry(
        "rect",
        rect
          ? [rect.pos[0], rect.pos[1], rect.size[0], rect.size[1]]
              .map(Math.round)
              .join(",")
          : undefined,
      ),
      entry("sat", saturation),
      entry("sharp", sharpen),
      entry("w", width),
    ]
      .filter((entry) => entry != null)
      .map((entry) => entry.join("="))
      .join("&")
  );
}
