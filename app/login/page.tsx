import AuthForm from "../auth-form";
import { login } from "../actions";

export default function Login() {
  return (
    <>
      <h1>Iniciar sesión</h1>
      <AuthForm action={login} label="Ingresar" />
    </>
  );
}
