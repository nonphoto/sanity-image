export type SanityImageCrop = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export function isSanityImageCrop(x: any): x is SanityImageCrop {
  return (
    x != null &&
    typeof x === "object" &&
    "top" in x &&
    (typeof x.top === "number" || typeof x.top === "undefined") &&
    "bottom" in x &&
    (typeof x.bottom === "number" || typeof x.bottom === "undefined") &&
    "left" in x &&
    (typeof x.left === "number" || typeof x.left === "undefined") &&
    "right" in x &&
    (typeof x.right === "number" || typeof x.right === "undefined")
  );
}
