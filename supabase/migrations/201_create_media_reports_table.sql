-- Create a table for media reports
CREATE TABLE public.media_reports (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    media_id uuid NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
    report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT media_reports_pkey PRIMARY KEY (id),
    CONSTRAINT unique_media_report UNIQUE (media_id, report_id)
);

-- Enable row level security for the media_reports table
ALTER TABLE public.media_reports ENABLE ROW LEVEL SECURITY;

-- Media reports policies
CREATE POLICY "Authenticated users can create media reports"
    ON public.media_reports
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view their media reports"
    ON public.media_reports
    FOR SELECT TO authenticated 
    USING ((SELECT user_id FROM public.reports WHERE id = media_reports.report_id) = auth.uid());

CREATE POLICY "Users can delete their media reports"
    ON public.media_reports
    FOR DELETE TO authenticated 
    USING ((SELECT user_id FROM public.reports WHERE id = media_reports.report_id) = auth.uid());

-- Create a trigger to automatically update the updated_at column for the media_reports table
CREATE TRIGGER update_media_reports_updated_at
    BEFORE UPDATE ON public.media_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();