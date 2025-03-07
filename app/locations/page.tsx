import { createClient } from "@/lib/supabase/server";

export default async function LocationsPage() {
  const supabase = await createClient();
  const { data: locations, error } = await supabase
    .from("locations")
    .select("*");

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <h1>Locations</h1>
      <pre>{JSON.stringify(locations, null, 2)}</pre>
    </div>
  );
}
