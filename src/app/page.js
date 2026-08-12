import { createClient } from "@/utils/supabase/client";
import Home from "./components/Home";

export default async function Page() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("portfolio")
    .select()
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Connection failed: ", error);
    return <div>Failed to load projects</div>;
  }

  return (
    <>
      <Home data={projects} />
    </>
  );
}
