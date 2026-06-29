import { redirect } from "next/navigation";

// Konto skapas automatiskt vid OAuth-inloggning — inget separat register-steg.
// #signup gör att LoginPage startar i signup-läge automatiskt.
export default function RegisterPage() {
  redirect("/login#signup");
}
