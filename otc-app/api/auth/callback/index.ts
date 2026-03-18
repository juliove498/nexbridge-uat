import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateWithNexBridge, isAuthLive } from "../../_lib/nexbridge-auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  if (!isAuthLive()) {
    return res.redirect("/");
  }

  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;
  const error = req.query.error as string | undefined;

  if (error) {
    return res.redirect(`/?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return res.status(400).json({
      success: false,
      error: "Missing authorization code or state",
    });
  }

  try {
    await authenticateWithNexBridge(code);
    return res.redirect("/?auth_success=true");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Authentication failed";
    return res.redirect(`/?auth_error=${encodeURIComponent(msg)}`);
  }
}
