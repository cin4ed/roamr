'use client';

import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChooseLocationMap } from '@/components/ChooseLocationMap';
import ImageDropzone from '@/components/ImageDropzone';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 250;
const MAX_TAGS_LENGTH = 10;
const MAX_IMAGES_LENGTH = 10;

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Location name is required' })
    .max(MAX_NAME_LENGTH, {
      message: `Location name must be less than ${MAX_NAME_LENGTH} characters`,
    }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`,
    }),
  latitude: z
    .number({ invalid_type_error: 'Latitude must be a number' })
    .min(-90, { message: 'Latitude must be between -90 and 90' })
    .max(90, { message: 'Latitude must be between -90 and 90' }),
  longitude: z
    .number({ invalid_type_error: 'Longitude must be a number' })
    .min(-180, { message: 'Longitude must be between -180 and 180' })
    .max(180, { message: 'Longitude must be between -180 and 180' }),
  tags: z
    .array(z.string())
    .optional()
    .refine(tags => !tags || tags.length <= MAX_TAGS_LENGTH, {
      message: `Tags must be less than ${MAX_TAGS_LENGTH} characters`,
    }),
  images: z.array(z.instanceof(File)).optional(),
  // safety_info: z.string().optional(),
  // address: z.string().optional(),
  // city: z.string().min(1, { message: 'City is required' }),
  // country: z.string().min(1, { message: 'Country is required' }),
  // accessibility: z.string().optional(),
});

type FormFields = z.infer<typeof formSchema>;

export const CreateLocationForm = ({ className }: { className: string }) => {
  const router = useRouter();
  const [tagInput, setTagInput] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      latitude: 0,
      longitude: 0,
      tags: [],
      images: [],
      // safety_info: '',
      // accessibility: '',
      // address: '',
      // city: '',
      // country: '',
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async values => {
    try {
      const formData = new FormData();

      formData.append(
        'locationData',
        JSON.stringify({
          name: values.name,
          description: values.description,
          latitude: values.latitude,
          longitude: values.longitude,
          tags: values.tags,
        })
      );

      if (values.images && values.images.length > 0) {
        values.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await fetch('/api/locations', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create location');
      }

      const result = await response.json();

      console.log(result);

      toast.success('Location created successfully');

      router.push(`/explore`);
    } catch (error) {
      console.error('Error submitting location:', error);
      toast.error('Failed to create location');
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
  };

  const handleImagesChange = (files: File[]) => {
    form.setValue('images', files);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
      <div>
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              className="bg-background border-input w-full rounded-md border px-3 py-2 pr-16"
              maxLength={MAX_NAME_LENGTH}
              {...form.register('name')}
            />
            <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              {form.watch('name')?.length || 0}/{MAX_NAME_LENGTH}
            </div>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Give the location an original name, be creative!
          </p>
          {form.formState.errors.name && (
            <p className="text-destructive mt-1 text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4">
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              className="bg-background border-input w-full rounded-md border px-3 py-2 pr-16"
              maxLength={MAX_DESCRIPTION_LENGTH}
              {...form.register('description')}
            />
            <div className="text-muted-foreground absolute right-3 bottom-3 text-xs">
              {form.watch('description')?.length || 0}/{MAX_DESCRIPTION_LENGTH}
            </div>
          </div>
          {form.formState.errors.description && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.description.message}
            </p>
          )}
          <p className="text-muted-foreground mt-1 text-sm">
            Describe this location in detail. What makes it special?
          </p>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <label htmlFor="tags" className="mb-1 block text-sm font-medium">
            Tags
          </label>
          <div className="relative">
            <input
              id="tags"
              type="text"
              className="bg-background border-input w-full rounded-md border px-3 py-2 pr-16"
              value={tagInput}
              onChange={e => {
                const value = e.target.value;
                setTagInput(value);

                const tagsArray = value
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(Boolean);

                form.setValue('tags', tagsArray.slice(0, MAX_TAGS_LENGTH));

                if (tagsArray.length > MAX_TAGS_LENGTH) {
                  setTagInput(tagsArray.slice(0, MAX_TAGS_LENGTH).join(', '));
                }
              }}
            />
            <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              {form.watch('tags')?.length || 0}/{MAX_TAGS_LENGTH}
            </div>
          </div>
          {form.watch('tags') && form.watch('tags')!.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.watch('tags')!.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {form.formState.errors.tags && (
            <p className="text-destructive mt-1 text-sm">{form.formState.errors.tags.message}</p>
          )}
          <p className="text-muted-foreground mt-1 text-sm">
            Enter tags separated by commas. e.g. hiking, nature, beach. Tags let other users find
            your location more easily.
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium">Location</label>
        <div className="border-background relative h-52 w-full overflow-hidden rounded-md border-4">
          <ChooseLocationMap initialLatitude={0} initialLongitude={0} initialZoom={3.5} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="divide-muted bg-background grid grid-cols-4 divide-x rounded">
            <div className="text-muted-foreground flex-shrink-0 px-2 py-1">lat</div>
            <div className="text-muted-foreground col-span-3 truncate px-2 py-1">{latitude}</div>
          </div>
          <div className="divide-muted bg-background grid grid-cols-4 divide-x rounded">
            <div className="text-muted-foreground flex-shrink-0 px-2 py-1">lng</div>
            <div className="text-muted-foreground col-span-3 truncate px-2 py-1">{longitude}</div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Drag the marker and place it on top of the location you want to submit. Press the
          geolocate control in the top right corner if you want to use your current location.
        </p>
      </div>

      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium">Images</label>
        <ImageDropzone onChange={handleImagesChange} className="mt-2" maxFiles={MAX_IMAGES_LENGTH}>
          <p className="text-muted-foreground text-sm">
            Upload photos of this location to help others find it
          </p>
        </ImageDropzone>
      </div>

      <div>
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 font-medium"
        >
          Create
        </button>
      </div>
    </form>
  );
};
