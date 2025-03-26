import { createClient } from '@/utils/supabase/server';
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
  tags: z.array(z.string()).min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  // accessibility: z.string(),
  // address: z.string(),
  // city: z.string().min(1),
  // country: z.string().min(1),
  // safety_info: z.string(),
});

/**
 * Handles POST requests to create a new location in the database.
 * @param req The incoming HTTP request
 * @returns JSON response with success message and location ID, or an error
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const { data: user, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Error getting user:', authError);
      return NextResponse.json({ error: 'Failed to get user' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const locationDataStr = formData.get('locationData') as string;

    if (!locationDataStr) {
      return NextResponse.json({ error: 'Missing location data' }, { status: 400 });
    }

    const locationData = JSON.parse(locationDataStr);

    // Validate location data
    const { success: validationSuccess, error: validationError } =
      createLocationSchema.safeParse(locationData);

    if (!validationSuccess) {
      return NextResponse.json(
        { error: 'Invalid location data', details: validationError.errors },
        { status: 400 }
      );
    }

    const images = formData.getAll('images') as File[];

    // Begin transaction process

    // 1. Insert location data
    const { data: location, error: locationError } = await supabase
      .from('locations')
      .insert({ ...locationData })
      .select()
      .single();

    if (locationError) {
      console.error('Error creating location:', locationError);
      return NextResponse.json({ error: 'Failed to create location' }, { status: 400 });
    }

    // 2. Upload images and create image records
    const imageRecords = [];
    let success = true;

    for (const image of images) {
      const fileExtension = image.name.split('.').pop() || '';
      const fileName = `${location.id}/${crypto.randomUUID()}.${fileExtension}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, image, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        success = false;
        break;
      }

      // Create image record in join table
      const { data: imageRecord, error: imageRecordError } = await supabase
        .from('location_media')
        .insert({
          location_id: location.id,
          media_url: fileName,
        })
        .select()
        .single();

      if (imageRecordError) {
        console.error('Error creating image record:', imageRecordError);
        success = false;
        break;
      }

      imageRecords.push(imageRecord);
    }

    // 3. Update location status based on outcome
    if (success) {
      return NextResponse.json({
        success: true,
        location: {
          ...location,
        },
        images: imageRecords,
      });
    } else {
      // Handle rollback

      await supabase.from('locations').delete().eq('id', location.id);
      if (imageRecords.length > 0) {
        await supabase.from('location_media').delete().eq('location_id', location.id);
      }

      return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
