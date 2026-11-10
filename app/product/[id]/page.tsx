import { notFound } from "next/navigation";
import db from "@/lib/db";
import { addToCart } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = db.prepare("SELECT * FROM products WHERE id = ?").get(Number(id)) as any;
  if (!p) notFound();
  return (
    <div className="detail">
      <img src={p.image_url} alt={p.title} />
      <div>
        <div className="tag">{p.category}</div>
        <h1>{p.title}</h1>
        <p>{p.description}</p>
        <p className="price">S/ {p.price.toFixed(2)}</p>
        <p>Stock: {p.stock}</p>
        {p.stock > 0 ? (
          <form action={addToCart} className="f">
            <input type="hidden" name="product_id" value={p.id} />
            <input type="number" name="quantity" defaultValue={1} min={1} max={p.stock} />
            <button>Agregar al carrito</button>
          </form>
        ) : (
          <p className="err">Agotado</p>
        )}
      </div>
    </div>
  );
}
