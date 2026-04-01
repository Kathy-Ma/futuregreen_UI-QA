export interface PendingImageData {
  uri: string;
  base64: string;
  fileName: string;
  width: number;
  height: number;
}

let pendingImage: PendingImageData | null = null;

export function setPendingImage(image: PendingImageData) {
  pendingImage = image;
}

export function consumePendingImage(): PendingImageData | null {
  const image = pendingImage;
  pendingImage = null;
  return image;
}
