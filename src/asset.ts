export interface SanityImageAssetLike {
  _id: string;
}

export function isSanityImageAssetLike(x: any): x is SanityImageAssetLike {
  return (
    x != null &&
    typeof x === "object" &&
    "_id" in x &&
    typeof x._id === "string"
  );
}
