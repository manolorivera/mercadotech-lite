import Link from "next/link";
import db from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Orders() {
  const user = await currentUser();
  if (!user) return <p><Link href="/login" className="price">Inicia sesión</Link> para ver tus pedidos.</p>;
  const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC").all(user.id) as any[];
  return (
    <>
      <h1>Mis pedidos</h1>
      {!orders.length && <p>Aún no tienes pedidos.</p>}
      {orders.map((o) => (
        <div key={o.id} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <b>Pedido #{o.id}</b> · {o.created_at} · <span className="price">S/ {o.total.toFixed(2)}</span>
          <ul>
            {JSON.parse(o.items).map((i: any, k: number) => (
              <li key={k}>{i.quantity} × {i.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
