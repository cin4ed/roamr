import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Define schema for image file validation
const imageFileSchema = z.object({
  name: z.string(),
  type: z.string().refine(type => type.startsWith('image/'), {
    message: 'File must be an image',
  }),
  size: z.number().max(5 * 1024 * 1024, { message: 'File size must be less than 5MB' }),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: locationId } = await params;

  // Initialize Supabase client and authenticate user
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if the location exists
  const { data: locations, error: locationError } = await supabase
    .from('locations')
    .select('id')
    .eq('id', locationId);

  if (locationError || locations.length === 0) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  // Parse FormData and extract all image files
  const formData = await request.formData();
  const files = formData.getAll('images').filter((file): file is File => file instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: 'No images provided' }, { status: 400 });
  }

  if (files.length > 10) {
    return NextResponse.json({ error: 'Maximum 10 images allowed' }, { status: 400 });
  }

  // Initialize arrays to collect successes and errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const successes: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: { file: string; error: any }[] = [];

  // Process each file
  for (const file of files) {
    // Validate the file
    const validation = imageFileSchema.safeParse({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!validation.success) {
      errors.push({
        file: file.name,
        error: validation.error.flatten().fieldErrors,
      });
      continue;
    }

    // Generate a unique filename and construct the storage path
    const extension = file.name.split('.').pop() || 'jpg';
    const uniqueFilename = `${uuidv4()}.${extension}`;
    const path = `${locationId}/${uniqueFilename}`;

    // Convert the File object to a Buffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the image to the "location-images" bucket
    const { error: uploadError } = await supabase.storage
      .from('location-images')
      .upload(path, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      errors.push({ file: file.name, error: uploadError.message });
      continue;
    }

    // Insert the image metadata into the "images" table
    const { data, error: insertError } = await supabase
      .from('images')
      .insert({
        location_id: locationId,
        image_path: path,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      // Clean up: Remove the uploaded file if database insert fails
      await supabase.storage.from('location-images').remove([path]);
      errors.push({ file: file.name, error: insertError.message });
    } else {
      successes.push(data);
    }
  }

  // Return response with successes and errors
  return NextResponse.json({
    success: successes,
    errors: errors,
  });
}
