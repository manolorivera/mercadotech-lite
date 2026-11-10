import "./globals.css";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { logout } from "./actions";

export const metadata = { title: "MercadoTech Lite", description: "Tecnología al mejor precio" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <header>
          <Link href="/" className="logo">MercadoTech Lite</Link>
          <Link href="/">Catálogo</Link>
          <Link href="/cart">Carrito</Link>
          <Link href="/orders">Pedidos</Link>
          <Link href="/admin">Cargar producto</Link>
          {user ? (
            <form action={logout}><span>{user.email}</span><button>Salir</button></form>
          ) : (
            <>
              <Link href="/login">Ingresar</Link>
              <Link href="/register">Registrarse</Link>
            </>
          )}
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
