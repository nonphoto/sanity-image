import { InferOutput, is, number, object, optional } from "valibot";

export const cropSchema = object({
  top: optional(number()),
  bottom: optional(number()),
  left: optional(number()),
  right: optional(number()),
});

export type Crop = InferOutput<typeof cropSchema>;

export function isCrop(input: unknown): input is Crop {
  return is(cropSchema, input);
}
