import {
  boolean,
  InferOutput,
  is,
  literal,
  number,
  object,
  partial,
  string,
  tuple,
  union,
} from "valibot";
import { rectSchema } from "./rect";

export const transformationsSchema = partial(
  object({
    auto: literal("format"),
    background: string(),
    blur: number(),
    crop: union([
      literal("top"),
      literal("bottom"),
      literal("left"),
      literal("right"),
      literal("center"),
      literal("focalpoint"),
      literal("entropy"),
    ]),
    download: union([string(), boolean()]),
    dpr: union([literal(1), literal(2), literal(3)]),
    fit: union([
      literal("clip"),
      literal("crop"),
      literal("fill"),
      literal("fillmax"),
      literal("max"),
      literal("scale"),
      literal("min"),
    ]),
    flipHorizontal: boolean(),
    flipVertical: boolean(),
    focalPoint: tuple([number(), number()]),
    format: union([
      literal("jpg"),
      literal("pjpg"),
      literal("png"),
      literal("webp"),
    ]),
    frame: number(),
    height: number(),
    invert: boolean(),
    maxHeight: number(),
    maxWidth: number(),
    minHeight: number(),
    minWidth: number(),
    orientation: union([literal(0), literal(90), literal(180), literal(270)]),
    pad: number(),
    quality: number(),
    rect: rectSchema,
    saturation: number(),
    sharpen: number(),
    width: number(),
  }),
);

export type Transformations = InferOutput<typeof transformationsSchema>;

export function isTransformations(input: unknown): input is Transformations {
  return is(transformationsSchema, input);
}

function entry(
  key: string,
  value: string | number | boolean | null | undefined,
): [string, string] | undefined {
  return value == null || value === false
    ? undefined
    : [key, String(typeof value === "number" ? Math.round(value) : value)];
}

export function transformationsToURLSearch({
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
}: Transformations): string {
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
