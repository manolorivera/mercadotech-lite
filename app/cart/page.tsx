import Link from "next/link";
import db from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { checkout, removeFromCart } from "../actions";

export const dynamic = "force-dynamic";

export default async function Cart({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const user = await currentUser();
  if (!user) return <p>Debes <Link href="/login" className="price">iniciar sesión</Link> para ver tu carrito.</p>;
  const items = db.prepare(
    "SELECT c.id, c.quantity, p.title, p.price FROM cart_items c JOIN products p ON p.id = c.product_id WHERE c.user_id = ?"
  ).all(user.id) as any[];
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return (
    <>
      <h1>Carrito</h1>
      {error && <p className="err">{error}</p>}
      {!items.length ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <table>
            <thead><tr><th>Producto</th><th>Cant.</th><th>Subtotal</th><th></th></tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.title}</td>
                  <td>{i.quantity}</td>
                  <td>S/ {(i.price * i.quantity).toFixed(2)}</td>
                  <td>
                    <form action={removeFromCart}>
                      <input type="hidden" name="id" value={i.id} />
                      <button>Quitar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Total: S/ {total.toFixed(2)}</h2>
          <form action={checkout}><button>Terminar compra</button></form>
        </>
      )}
    </>
  );
}
