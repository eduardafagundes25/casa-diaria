import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});

export type ProFilters = { q?: string; categoria?: string; disp?: string; nota?: number };

const proSelect = "*, categories(name, slug)";

export async function fetchStats() {
  const { data } = await supabase.from("professional_stats").select("*");
  const map = new Map<string, { avg: number; count: number }>();
  (data ?? []).forEach((s) =>
    map.set(s.professional_id!, { avg: Number(s.avg_rating ?? 0), count: s.review_count ?? 0 }),
  );
  return map;
}

export const prosQuery = (f: ProFilters) =>
  queryOptions({
    queryKey: ["pros", f],
    queryFn: async () => {
      let q = supabase.from("professionals").select(proSelect).eq("published", true);
      if (f.disp) q = q.eq("availability", f.disp as "disponivel");
      const [{ data, error }, stats] = await Promise.all([q, fetchStats()]);
      if (error) throw error;
      let rows = (data ?? []).map((p) => ({
        ...p,
        avg: stats.get(p.id)?.avg ?? 0,
        count: stats.get(p.id)?.count ?? 0,
      }));
      if (f.categoria) rows = rows.filter((p) => p.categories?.slug === f.categoria);
      if (f.nota) rows = rows.filter((p) => p.avg >= f.nota!);
      if (f.q) {
        const t = f.q.toLowerCase();
        rows = rows.filter((p) =>
          [p.name, p.business_name, p.bio, p.categories?.name, ...p.specialties, ...p.regions]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(t)),
        );
      }
      const order = { disponivel: 0, limitada: 1, indisponivel: 2 } as const;
      rows.sort((a, b) => order[a.availability] - order[b.availability] || b.avg - a.avg);
      return rows;
    },
  });

export type ProRow = Awaited<ReturnType<NonNullable<ReturnType<typeof prosQuery>["queryFn"]>>>[number];

export const proQuery = (slug: string) =>
  queryOptions({
    queryKey: ["pro", slug],
    queryFn: async () => {
      const { data: pro, error } = await supabase
        .from("professionals")
        .select(proSelect)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!pro) return null;
      const [{ data: portfolio }, { data: reviews }, { data: days }] = await Promise.all([
        supabase.from("portfolio_items").select("*").eq("professional_id", pro.id).order("created_at", { ascending: false }),
        supabase.from("reviews").select("*").eq("professional_id", pro.id).order("created_at", { ascending: false }),
        supabase.from("availability_days").select("*").eq("professional_id", pro.id).gte("day", new Date().toISOString().slice(0, 10)),
      ]);
      return { pro, portfolio: portfolio ?? [], reviews: reviews ?? [], days: days ?? [] };
    },
  });

export async function uploadMedia(userId: string, file: File) {
  const path = `${userId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2) throw e2;
  return data.signedUrl;
}
