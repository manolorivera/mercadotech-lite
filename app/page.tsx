import Link from "next/link";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  const products = db.prepare("SELECT * FROM products ORDER BY id").all() as any[];
  return (
    <>
      <h1>Catálogo</h1>
      <div className="grid">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="card">
            <img src={p.image_url} alt={p.title} />
            <div className="b">
              <div className="tag">{p.category}</div>
              <div>{p.title}</div>
              <div className="price">S/ {p.price.toFixed(2)}</div>
              {p.stock === 0 && <div className="err">Agotado</div>}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
