"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function register(_: unknown, fd: FormData) {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  if (!email.includes("@")) return { error: "Correo inválido" };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres" };
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return { error: "Ese correo ya está registrado" };
  const r = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, bcrypt.hashSync(password, 10));
  (await cookies()).set("uid", String(r.lastInsertRowid), { path: "/" });
  redirect("/");
}

export async function login(_: unknown, fd: FormData) {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const u = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as { id: number; password: string } | undefined;
  if (!u || !bcrypt.compareSync(password, u.password)) return { error: "Correo o contraseña incorrectos" };
  (await cookies()).set("uid", String(u.id), { path: "/" });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete("uid");
  redirect("/");
}

export async function addToCart(fd: FormData) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const pid = Number(fd.get("product_id"));
  const qty = Math.max(1, Number(fd.get("quantity") || 1));
  const ex = db.prepare("SELECT id FROM cart_items WHERE user_id = ? AND product_id = ?").get(user.id, pid) as { id: number } | undefined;
  if (ex) db.prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?").run(qty, ex.id);
  else db.prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?,?,?)").run(user.id, pid, qty);
  redirect("/cart");
}

export async function removeFromCart(fd: FormData) {
  db.prepare("DELETE FROM cart_items WHERE id = ?").run(Number(fd.get("id")));
  redirect("/cart");
}

export async function checkout() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const items = db.prepare(
    "SELECT c.id, c.quantity, p.id pid, p.title, p.price, p.stock FROM cart_items c JOIN products p ON p.id = c.product_id WHERE c.user_id = ?"
  ).all(user.id) as { id: number; quantity: number; pid: number; title: string; price: number; stock: number }[];
  if (!items.length) redirect("/cart");
  for (const i of items) {
    if (i.quantity > i.stock) redirect(`/cart?error=${encodeURIComponent("Sin stock suficiente: " + i.title)}`);
  }
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tx = db.transaction(() => {
    db.prepare("INSERT INTO orders (user_id, total, items) VALUES (?,?,?)").run(
      user.id,
      total,
      JSON.stringify(items.map((i) => ({ product_id: i.pid, title: i.title, price: i.price, quantity: i.quantity })))
    );
    for (const i of items) db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(i.quantity, i.pid);
    db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(user.id);
  });
  tx();
  redirect("/orders");
}

export async function createProduct(fd: FormData) {
  db.prepare("INSERT INTO products (title, description, price, stock, category, image_url) VALUES (?,?,?,?,?,?)").run(
    String(fd.get("title")),
    String(fd.get("description")),
    Number(fd.get("price")),
    Number(fd.get("stock")),
    String(fd.get("category")),
    String(fd.get("image_url") || "https://picsum.photos/seed/new/600/400")
  );
  redirect("/");
}
