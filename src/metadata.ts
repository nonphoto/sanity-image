export interface SanityImagePaletteSwatch {
  _type?: "sanity.imagePaletteSwatch" | null;
  background?: string | null;
  foreground?: string | null;
  population?: number | null;
  title?: string | null;
}

export interface SanityImagePalette {
  _type?: "sanity.imagePalette" | null;
  darkMuted?: SanityImagePaletteSwatch | null;
  darkVibrant?: SanityImagePaletteSwatch | null;
  dominant?: SanityImagePaletteSwatch | null;
  lightMuted?: SanityImagePaletteSwatch | null;
  lightVibrant?: SanityImagePaletteSwatch | null;
  muted?: SanityImagePaletteSwatch | null;
  vibrant?: SanityImagePaletteSwatch | null;
}

export interface SanityImageDimensions {
  _type?: "sanity.imageDimensions" | null;
  aspectRatio?: number | null;
  width?: number | null;
  height?: number | null;
}

export interface SanityImageMetadata {
  _type: "sanity.imageMetadata";
  blurHash?: string | null;
  dimensions?: SanityImageDimensions | null;
  hasAlpha?: boolean | null;
  isOpaque?: boolean | null;
  lqip?: string | null;
  palette?: SanityImagePalette | null;
}
