export const IMAGE_MAX_BYTES = 5_000_000;
export const IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function recipeImagePath(file: Pick<File, "type" | "size">): string {
  const extension = extensions[file.type];
  if (!extension || file.size === 0 || file.size > IMAGE_MAX_BYTES) {
    throw new Error("Choose a JPEG, PNG or WebP image under 5 MB");
  }
  return `recipes/${crypto.randomUUID()}.${extension}`;
}

export function isRecipeImagePath(pathname: string): boolean {
  return /^recipes\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/.test(pathname);
}
