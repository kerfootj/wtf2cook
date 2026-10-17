import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IMAGE_CONTENT_TYPES, IMAGE_MAX_BYTES, isRecipeImagePath } from "@/lib/image-upload";
import { applyRateLimit } from "@/lib/tokens";

export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = await request.json() as HandleUploadBody;
  } catch {
    return Response.json({ error: "Invalid upload request" }, { status: 400 });
  }

  // Blob completion callbacks have no browser session; only token requests need one.
  const session = body?.type === "blob.generate-client-token"
    ? await getServerSession(authOptions)
    : null;
  if (body?.type === "blob.generate-client-token" && !session?.user?.id) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }
  if (session?.user?.id && !await applyRateLimit(`image:${session.user.id}`, 10)) {
    return Response.json({ error: "Too many image uploads. Try again in a minute." }, { status: 429 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "Image upload is not configured" }, { status: 503 });
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!session?.user?.id) throw new Error("Sign in required");
        if (!isRecipeImagePath(pathname)) throw new Error("Invalid image path");
        return {
          allowedContentTypes: [...IMAGE_CONTENT_TYPES],
          maximumSizeInBytes: IMAGE_MAX_BYTES,
          validUntil: Date.now() + 5 * 60 * 1000,
        };
      },
    });
    return Response.json(result);
  } catch {
    return Response.json({ error: "Could not authorize image upload" }, { status: 400 });
  }
}
