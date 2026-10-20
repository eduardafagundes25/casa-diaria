import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil · Casa Diária" }, { name: "description", content: "Meu perfil na Casa Diária, serviços locais em Gurupi." }, { property: "og:title", content: "Meu perfil · Casa Diária" }, { property: "og:description", content: "Meu perfil na Casa Diária." }] }),
  component: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">Meu perfil</h1>
        <p className="mt-2 text-muted-foreground">Esta página ainda está sendo construída.</p>
      </div>
    </AppShell>
  ),
});
