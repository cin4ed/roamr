import { createClient } from "@/lib/supabase/server";

jest.mock("next/headers", () => ({
    cookies: () => ({
        getAll: () => [],
        set: () => { },
    }),
}));

test("get locations", async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("locations").select("*");
    console.log(data);
    expect(data).toBeDefined();
    expect(error).toBeNull();
});