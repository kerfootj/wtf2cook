import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const types = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in required" }, { status: 401 });
  const clientId = process.env.IMGUR_CLIENT_ID;
  if (!clientId) return Response.json({ error: "Image upload is not configured" }, { status: 503 });
  const data = await request.formData();
  const file = data.get("image");
  if (!(file instanceof File) || !types.has(file.type) || file.size === 0 || file.size > 5_000_000) {
    return Response.json({ error: "Choose a JPEG, PNG or WebP image under 5 MB" }, { status: 400 });
  }
  const upload = new FormData();
  upload.append("image", file, file.name);
  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST", headers: { Authorization: `Client-ID ${clientId}` }, body: upload,
    });
    if (!response.ok) return Response.json({ error: "Image host rejected the upload" }, { status: 502 });
    const result = await response.json() as { data?: { link?: string } };
    if (!result.data?.link) return Response.json({ error: "Image host returned no URL" }, { status: 502 });
    return Response.json({ url: result.data.link });
  } catch {
    return Response.json({ error: "Image host is unavailable" }, { status: 502 });
  }
}
