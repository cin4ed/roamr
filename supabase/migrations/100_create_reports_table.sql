-- -- Create a table for reports
-- CREATE TABLE public.reports (
--     id uuid NOT NULL DEFAULT uuid_generate_v4(),
--     user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--     report_title text NOT NULL,
--     report_description text NOT NULL,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now(),
--     CONSTRAINT reports_pkey PRIMARY KEY (id)
-- );

-- -- Enable row level security for the reports table
-- ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- -- Reports policies
-- CREATE POLICY "Authenticated users can create reports"
--     ON public.reports
--     FOR INSERT TO authenticated WITH CHECK (true);

-- CREATE POLICY "Users can view their reports"
--     ON public.reports
--     FOR SELECT TO authenticated USING (user_id = auth.uid());

-- CREATE POLICY "Users can delete their reports"
--     ON public.reports
--     FOR DELETE TO authenticated USING (user_id = auth.uid());

-- -- Create a trigger to automatically update the updated_at column for the reports table
-- CREATE TRIGGER update_reports_updated_at
--     BEFORE UPDATE ON public.reports
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();
