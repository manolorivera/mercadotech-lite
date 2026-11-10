import Link from "next/link";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.categoria) ? sp.categoria[0] : sp.categoria;

  const categories = (
    db.prepare("SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category").all() as { category: string }[]
  ).map((r) => r.category);

  // Solo se acepta una categoría que exista; cualquier otro valor equivale a "Todas".
  const selected = raw && categories.includes(raw) ? raw : "";

  const products = (
    selected
      ? db.prepare("SELECT * FROM products WHERE category = ? ORDER BY id").all(selected)
      : db.prepare("SELECT * FROM products ORDER BY id").all()
  ) as any[];

  return (
    <>
      <h1>Catálogo</h1>
      <form method="get" action="/" style={{ margin: "12px 0" }}>
        <label>
          Categoría:{" "}
          <select name="categoria" defaultValue={selected}>
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>{" "}
        <button type="submit">Filtrar</button>
        {selected && (
          <>
            {" "}
            <Link href="/">Quitar filtro</Link>
          </>
        )}
      </form>
      {products.length === 0 && <p>No hay productos en esta categoría.</p>}
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
