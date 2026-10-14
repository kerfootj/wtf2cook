import { ZodError } from "zod";

export function errorResponse(error: unknown): Response {
  if (error instanceof SyntaxError) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (error instanceof ZodError) {
    return Response.json({ error: "Invalid recipe", details: error.issues.map((issue) => ({
      path: issue.path.join("."), message: issue.message,
    })) }, { status: 400 });
  }
  console.error("Request failed", error);
  return Response.json({ error: "The request could not be completed" }, { status: 500 });
}
