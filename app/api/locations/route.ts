import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for a single image file
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const imageFileSchema = z.object({
  name: z.string(),
  type: z.string().refine(type => type.startsWith('image/'), {
    message: 'File must be an image',
  }),
  size: z.number().max(5 * 1024 * 1024, { message: 'File size must be less than 5MB' }),
});

const createLocationSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accessibility: z.string(),
  address: z.string(),
  city: z.string().min(1),
  country: z.string().min(1),
  tags: z.array(z.string()).min(1),
  safety_info: z.string(),
});

/**
 * Handles POST requests to create a new location in the database.
 * @param request The incoming HTTP request
 * @returns JSON response with success message and location ID, or an error
 */
export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = createLocationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    // Authenticate user
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prepare and insert location data
    const locationData = buildLocationData(validation.data, user.id);
    const { data, error } = await supabase.from('locations').insert(locationData).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to create location: no data returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Location created',
      locationId: data.id,
    });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Retrieves the authenticated user from Supabase.
 * @param supabase The Supabase client instance
 * @returns The authenticated user object or null if not authenticated
 */
async function getAuthenticatedUser(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.getUser();
  return error || !data.user ? null : data.user;
}

/**
 * Constructs the location data object for database insertion.
 * @param data Validated data from the request body
 * @param userId ID of the authenticated user
 * @returns Object formatted for Supabase insertion
 */
function buildLocationData(data: z.infer<typeof createLocationSchema>, userId: string) {
  return {
    name: data.name,
    description: data.description,
    coordinates: `POINT(${data.longitude} ${data.latitude})`,
    accessibility: data.accessibility,
    address: data.address,
    city: data.city,
    country: data.country,
    tags: data.tags,
    safety_info: data.safety_info,
    creator_id: userId,
  };
}
