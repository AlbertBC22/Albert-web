import type { Metadata } from "next";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import SectionLabel from "@/components/blueprint/SectionLabel";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Acceso" };

// Acceso al panel. Si ya hay sesión, el proxy redirige a /admin.
export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center px-4 py-16">
      <BlueprintFrame className="w-full max-w-md bg-paper/80">
        <div className="space-y-8">
          <div className="space-y-3">
            <SectionLabel index="ADM">Acceso</SectionLabel>
            <h1 className="text-h2 font-medium">Panel de Albert-web</h1>
          </div>
          <LoginForm />
        </div>
      </BlueprintFrame>
    </main>
  );
}
