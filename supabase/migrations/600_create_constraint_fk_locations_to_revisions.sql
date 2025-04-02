alter table public.locations add constraint fk_latest_revision
foreign key (latest_revision_id) references public.location_revisions (id)
deferrable initially deferred;

-- Function to create a location with a revision within a transaction
CREATE OR REPLACE FUNCTION create_location_with_revision(
    loc_name text,
    loc_description text,
    rev_content text,
    loc_longitude numeric,
    loc_latitude numeric,
    loc_tags text[]
)
returns integer as $$
declare
    loc_id integer;
    rev_id integer;
begin
    INSERT INTO locations (name, description, longitude, latitude)
    values (loc_name, loc_description, loc_longitude, loc_latitude)
    returning id into loc_id;

    -- Insert tags
    INSERT INTO location_tags (location_id, tag)
    INSERT INTO location_revisions (location_id, content)
    values (loc_id, rev_content)
    returning id into rev_id;

    UPDATE locations
    SET latest_revision_id = rev_id
    WHERE id = loc_id;
    
    return loc_id;
end;
$$ language plpgsql;