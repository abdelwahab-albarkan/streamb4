import { redirect } from "next/navigation";

// Admin panel disabled — static site has no backend.
export default function AdminLayout() {
  redirect("/");
}
