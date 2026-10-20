import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/painel")({
  head: () => ({ meta: [{ title: "Painel do profissional · Casa Diária" }, { name: "description", content: "Painel do profissional na Casa Diária, serviços locais em Gurupi." }, { property: "og:title", content: "Painel do profissional · Casa Diária" }, { property: "og:description", content: "Painel do profissional na Casa Diária." }] }),
  component: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">Painel do profissional</h1>
        <p className="mt-2 text-muted-foreground">Esta página ainda está sendo construída.</p>
      </div>
    </AppShell>
  ),
});
