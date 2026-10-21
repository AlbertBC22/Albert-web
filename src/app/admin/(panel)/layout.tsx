import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/data/admin";

// Armazón de las páginas del panel: comprueba en el servidor que el usuario es admin
// (el proxy solo comprueba que haya sesión) y muestra la navegación lateral.
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="mx-auto grid min-h-svh max-w-6xl gap-10 px-4 py-8 sm:px-8 md:grid-cols-[14rem_minmax(0,1fr)] md:py-12">
      <aside className="space-y-8 md:border-r md:border-line md:pr-8">
        <div className="space-y-1">
          <p className="label-mono">Albert-web · Panel</p>
          {admin.email && <p className="label-mono truncate text-ink-muted normal-case">{admin.email}</p>}
        </div>
        <AdminNav />
        <div className="space-y-3 border-t border-line pt-6">
          <Link href="/es" className="label-mono block text-ink-muted hover:text-ink">
            Ver la web ↗
          </Link>
          <form action={signOut}>
            <button type="submit" className="label-mono text-ink-muted hover:text-ink">
              [ Cerrar sesión ]
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
