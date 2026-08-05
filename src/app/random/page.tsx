import { redirect } from "next/navigation";
import { fetchTools } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function RandomToolPage() {
  const tools = await fetchTools();

  if (!tools || tools.length === 0) {
    redirect("/");
  }

  const randomIndex = Math.floor(Math.random() * tools.length);
  const randomTool = tools[randomIndex];

  redirect(`/tool/${randomTool.slug}`);
}
