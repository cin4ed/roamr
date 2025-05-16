'use client';

import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/cn';
import TagPicker from './TagPicker';
import LocationPicker from './LocationPicker';
import ImageDropzone from '@/components/ImageDropzone';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 50;
const MIN_DESCRIPTION_LENGTH = 10;
const MAX_DESCRIPTION_LENGTH = 250;
const MAX_IMAGES_LENGTH = 10;

const formSchema = z.object({
  name: z
    .string()
    .min(MIN_NAME_LENGTH, {
      message: `Location name must be at least ${MIN_NAME_LENGTH} characters long`,
    })
    .max(MAX_NAME_LENGTH, {
      message: `Location name must be less than ${MAX_NAME_LENGTH} characters long`,
    }),
  description: z
    .string()
    .min(MIN_DESCRIPTION_LENGTH, {
      message: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters long`,
    })
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters long`,
    }),
  latitude: z
    .number({ invalid_type_error: 'Latitude must be a number' })
    .min(-90, { message: 'Latitude must be between -90 and 90' })
    .max(90, { message: 'Latitude must be between -90 and 90' }),
  longitude: z
    .number({ invalid_type_error: 'Longitude must be a number' })
    .min(-180, { message: 'Longitude must be between -180 and 180' })
    .max(180, { message: 'Longitude must be between -180 and 180' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  images: z.array(z.instanceof(File)).optional(),
});

type FormFields = z.infer<typeof formSchema>;

export default function LocationForm({ className }: { className?: string }) {
  const router = useRouter();
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: [],
      images: [],
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async values => {
    try {
      const supabase = await createClient();

      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User is not authenticated');
      }

      // Prepare the location data without tags
      const locationData = {
        name: values.name,
        description: values.description,
        latitude: values.latitude,
        longitude: values.longitude,
      };

      // Create the location first
      const { data: location, error: locationError } = await supabase
        .from('locations')
        .insert(locationData)
        .select()
        .single();

      if (locationError) throw locationError;

      // Handle tags: create any that don't exist, then link all to the location
      for (const tagName of values.tags) {
        // Check if tag exists
        const { data: tag, error: tagFetchError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();

        let tagId;
        if (tagFetchError || !tag) {
          // Tag does not exist, create it
          const { data: newTag, error: tagInsertError } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select('id')
            .single();
          if (tagInsertError) throw tagInsertError;
          tagId = newTag.id;
        } else {
          tagId = tag.id;
        }

        // Link tag to location
        const { error: linkError } = await supabase
          .from('location_tags')
          .insert({ location_id: location.id, tag_id: tagId });
        if (linkError) throw linkError;
      }

      // If there are images and the location was created successfully, upload them
      if (values.images && values.images.length > 0) {
        const imageUploadPromises = values.images.map(async image => {
          const fileExt = image.name.split('.').pop();
          const fileName = `${location.id}-${Math.random()}.${fileExt}`;
          const filePath = `locations/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, image);

          if (uploadError) throw uploadError;

          // Create image record in the database
          return supabase.from('media').insert({
            location_id: location.id,
            url: filePath,
          });
        });

        // Wait for all image uploads to complete
        await Promise.all(imageUploadPromises);
      }

      router.push(`/explore`);
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  const CoordinateErrorMessage = () => {
    const latitudeError = form.formState.errors.latitude;
    const longitudeError = form.formState.errors.longitude;

    if (!latitudeError && !longitudeError) return;

    if (latitudeError?.message == 'Required' && longitudeError?.message == 'Required') {
      return <p className="text-destructive mt-1 text-sm">Coordinates are required</p>;
    }

    return (
      <>
        <p className="text-destructive mt-1 text-sm">latitudeError.message</p>
        <p className="text-destructive mt-1 text-sm">longitudeError.message</p>
      </>
    );
  };

  return (
    <form
      className={cn('text-primary flex w-full flex-col gap-5', className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h1 className="font-title text-4xl">New Location</h1>
      <div className="flex flex-col gap-2">
        <label>Name</label>
        <div className="relative">
          <input
            type="text"
            className="focus:ring-accent-4 border-secondary h-[61px] w-full rounded-md border px-3 py-2 text-base focus:ring-2 focus:outline-none"
            maxLength={MAX_NAME_LENGTH}
            {...form.register('name')}
          />
          <span className="text-muted absolute right-2 bottom-1 text-xs">
            {form.watch('name')?.length || 0}/{MAX_NAME_LENGTH}
          </span>
        </div>
        <span className="text-muted text-sm">Give the location an original name, be creative!</span>
        {form.formState.errors.name && (
          <p className="text- text-destructive mt-1 text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Description</label>
        <div className="relative">
          <textarea
            className="focus:ring-accent-4 border-secondary h-[120px] w-full resize-none rounded-md border px-3 py-2 text-base focus:ring-2 focus:outline-none"
            maxLength={MAX_DESCRIPTION_LENGTH}
            {...form.register('description')}
            rows={4}
          />
          <span className="text-muted absolute right-2 bottom-3 text-xs">
            {form.watch('description')?.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <span className="text-muted text-sm">
          Describe this location in a paragraph, let other roamers know what to expect here!
        </span>
        {form.formState.errors.description && (
          <p className="text-destructive mt-1 text-sm">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Tags</label>
        <TagPicker
          currentTags={form.watch('tags') ?? []}
          onTagSelect={tag =>
            form.setValue('tags', [...(form.watch('tags') ?? []), tag], { shouldValidate: true })
          }
        />
        <span className="text-muted text-sm">
          Add tags to help other roamers find this location, e.g. &quot;hiking&quot;,
          &quot;nature&quot;, &quot;beach&quot;.
        </span>
        {(form.watch('tags') ?? []).length > 0 && (
          <div className="text-muted text-sm">
            {(form.watch('tags') ?? []).length}{' '}
            {form.watch('tags')?.length === 1 ? 'tag:' : 'tags:'}
          </div>
        )}
        {form.watch('tags')!.length > 0 && (
          <div className="divide-secondary border-secondary divide-y rounded-md border">
            {form.watch('tags')?.map(tag => (
              <div key={tag} className="flex items-center justify-between px-5 py-5 font-light">
                {tag}
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 scale-125 hover:cursor-pointer"
                  onClick={() =>
                    form.setValue(
                      'tags',
                      form.watch('tags')?.filter(t => t !== tag)
                    )
                  }
                >
                  <i className="fa-solid fa-xmark-circle"></i>
                </button>
              </div>
            ))}
          </div>
        )}
        {form.formState.errors.tags && (
          <p className="text-destructive mt-1 text-sm">{form.formState.errors.tags.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Location</label>
        <div className="w-full">
          <LocationPicker
            onLocationSelect={(lat, lng) => {
              form.setValue('latitude', lat, { shouldValidate: true });
              form.setValue('longitude', lng, { shouldValidate: true });
            }}
            initialLatitude={0}
            initialLongitude={0}
            initialZoom={3.5}
          />
        </div>
        <CoordinateErrorMessage />
        <p className="text-muted text-sm">Tap on the map to set the location</p>
        {form.watch('latitude') && form.watch('longitude') !== 0 && (
          <>
            <p className="text-muted text-sm">
              <span>Coordinates:</span>
            </p>
            <div className="border-secondary divide-secondary divide-y rounded-md border">
              <div className="divide-secondary flex items-center divide-x">
                <div className="w-16 p-5">lat</div>
                <div className="p-5">{form.watch('latitude')}</div>
              </div>
              <div className="divide-secondary flex items-center divide-x">
                <div className="w-16 p-5">lng</div>
                <div className="p-5">{form.watch('longitude')}</div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Images</label>
        <div className="flex flex-col gap-2">
          <ImageDropzone
            onChange={files => form.setValue('images', files, { shouldValidate: true })}
            maxFiles={MAX_IMAGES_LENGTH}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button className="bg-primary hover:bg-primary/90 rounded-md py-4 text-white">
          Create
        </button>
      </div>
    </form>
  );
}
