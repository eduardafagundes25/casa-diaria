import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { ProCard } from "@/components/pro-card";
import { prosQuery } from "@/lib/queries";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Casa Diária · Serviços locais em Gurupi" }, { name: "description", content: "Encontre eletricistas, jardineiros, faz-tudo e mais profissionais avaliados em Gurupi - TO." }, { property: "og:title", content: "Casa Diária · Serviços locais em Gurupi" }, { property: "og:description", content: "Profissionais locais avaliados, com disponibilidade e WhatsApp." }] }),
  component: Index,
});

function Index() {
  const { data } = useQuery(prosQuery({}));
  return (
    <AppShell>
      <section className="bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2">
          <div className="text-primary-foreground">
            <h1 className="text-4xl font-semibold md:text-5xl">Precisou? Casa Diária resolve.</h1>
            <p className="mt-3 opacity-90">Profissionais e pequenos reparos em Gurupi - TO, com avaliações reais.</p>
          </div>
          <img src={hero} alt="Profissional instalando prateleira" width={1600} height={1008} className="rounded-3xl" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-semibold">Profissionais disponíveis</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((p) => <ProCard key={p.id} pro={p} />)}
        </div>
      </section>
    </AppShell>
  );
}
