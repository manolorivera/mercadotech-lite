import AuthForm from "../auth-form";
import { register } from "../actions";

export default function Register() {
  return (
    <>
      <h1>Crear cuenta</h1>
      <AuthForm action={register} label="Registrarme" />
    </>
  );
}
