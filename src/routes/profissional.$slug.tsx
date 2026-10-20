import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { proQuery } from "@/lib/queries";
import { AvailabilityBadge, Avatar } from "@/components/brand";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/profissional/$slug")({
  head: () => ({ meta: [{ title: "Profissional · Casa Diária" }, { name: "description", content: "Perfil de profissional na Casa Diária." }, { property: "og:title", content: "Profissional · Casa Diária" }, { property: "og:description", content: "Perfil de profissional na Casa Diária." }] }),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data } = useQuery(proQuery(slug));
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        {data?.pro ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar src={data.pro.avatar_url} name={data.pro.name} className="h-24 w-24 text-2xl" />
              <div>
                <h1 className="text-3xl font-semibold">{data.pro.business_name || data.pro.name}</h1>
                <p className="text-muted-foreground">{data.pro.categories?.name}</p>
                <AvailabilityBadge status={data.pro.availability} />
              </div>
            </div>
            <p className="font-semibold text-primary">{formatPrice(data.pro.price_type, data.pro.price_value)}</p>
            <p className="whitespace-pre-line">{data.pro.bio}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Carregando…</p>
        )}
      </div>
    </AppShell>
  );
}
