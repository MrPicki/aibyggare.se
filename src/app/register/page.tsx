import { redirect } from "next/navigation";

// Konto skapas automatiskt vid OAuth-inloggning — inget separat register-steg
export default function RegisterPage() {
  redirect("/login");
}
