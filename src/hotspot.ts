import { InferOutput, is, number, object, optional } from "valibot";

export const hotspotSchema = object({
  x: optional(number()),
  y: optional(number()),
  width: optional(number()),
  height: optional(number()),
});

export type Hotspot = InferOutput<typeof hotspotSchema>;

export function isHotspot(input: unknown): input is Hotspot {
  return is(hotspotSchema, input);
}
