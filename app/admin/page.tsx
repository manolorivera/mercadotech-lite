import { createProduct } from "../actions";

export default function Admin() {
  return (
    <>
      <h1>Cargar producto</h1>
      <form action={createProduct} className="f">
        <input name="title" placeholder="Nombre" required />
        <textarea name="description" placeholder="Descripción" />
        <input name="price" type="number" step="0.01" placeholder="Precio (S/)" required />
        <input name="stock" type="number" placeholder="Stock" required />
        <input name="category" placeholder="Categoría" />
        <input name="image_url" placeholder="URL de la imagen (opcional)" />
        <button>Guardar producto</button>
      </form>
    </>
  );
}
