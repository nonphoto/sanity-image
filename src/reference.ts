export interface SanityReference {
  _ref: string;
}

export function isSanityReference(x: any): x is SanityReference {
  return (
    x != null &&
    typeof x === "object" &&
    "_ref" in x &&
    typeof x._ref === "string"
  );
}
