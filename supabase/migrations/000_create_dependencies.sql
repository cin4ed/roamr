-- Create extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create a function to update the updated_at timestamp for any table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';