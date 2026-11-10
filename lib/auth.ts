import { cookies } from "next/headers";
import db from "./db";

export async function currentUser() {
  const id = (await cookies()).get("uid")?.value;
  if (!id) return null;
  const u = db.prepare("SELECT id, email FROM users WHERE id = ?").get(Number(id)) as { id: number; email: string } | undefined;
  return u ?? null;
}
