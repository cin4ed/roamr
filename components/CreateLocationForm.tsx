'use client';

import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChooseLocationMap } from '@/components/ChooseLocationMap';
import * as Form from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ImageDropzone from '@/components/ImageDropzone';
import { cn } from '@/utils/utils';

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 250;
const MAX_TAGS_LENGTH = 10;

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
  // address: z.string().optional(),
  // city: z.string().min(1, { message: 'City is required' }),
  // country: z.string().min(1, { message: 'Country is required' }),
  tags: z
    .array(z.string())
    .optional()
    .refine(tags => !tags || tags.length <= MAX_TAGS_LENGTH, {
      message: `Tags must be less than ${MAX_TAGS_LENGTH} characters`,
    }),
  // safety_info: z.string().optional(),
  // accessibility: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

type FormFields = z.infer<typeof formSchema>;

export const CreateLocationForm = ({ className }: { className: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      latitude: 0,
      longitude: 0,
      // address: '',
      // city: '',
      // country: '',
      tags: [],
      // safety_info: '',
      // accessibility: '',
      images: [],
    },
  });

  const [tagInput, setTagInput] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const onSubmit: SubmitHandler<FormFields> = async values => {
    console.log(values);
    // Uncomment this section to enable actual form submission
    /*
    // First try to create the location
    const createLocationResponse = await axios.post('api/locations', {
      name: values.name,
      description: values.description,
      latitude: values.latitude,
      longitude: values.longitude,
      // address: values.address,
      // city: values.city,
      // country: values.country,
      tags: values.tags,
      // safety_info: values.safety_info,
      // accessibility: values.accessibility,
    });

    if (createLocationResponse.status === 400) {
      toast.error('Failed to create location');
      return;
    }

    // Upload images using FormData after successful location creation
    if (values.images && values.images.length > 0) {
      const formData = new FormData();
      
      values.images.forEach((image) => {
        formData.append("images", image);
      });
  
      // Log the FormData contents
      for (const pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }
  
      const uploadImagesResponse = await axios.post(
        `/api/locations/${createLocationResponse.data.locationId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (uploadImagesResponse.status === 400) {
        toast.error('Failed to upload images');
        return;
      }
  
      if (uploadImagesResponse.status === 401) {
        toast.error('Unauthorized');
        return;
      }
  
      if (uploadImagesResponse.data.errors.length > 0) {
        toast.error('Failed to upload images');
        console.error(uploadImagesResponse.data.errors);
        return;
      }
  
      toast.success('Location created successfully');
      console.log(uploadImagesResponse.data);
    } else {
      toast.success('Location created successfully (no images uploaded)');
    }
    */
    return;
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
    <Form.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
        <div>
          <Form.FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Name</Form.FormLabel>
                <Form.FormControl>
                  <div className="relative">
                    <Input
                      className="w-full bg-background pr-16"
                      maxLength={MAX_NAME_LENGTH}
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {field.value.length}/{MAX_NAME_LENGTH}
                    </div>
                  </div>
                </Form.FormControl>
                <Form.FormDescription>
                  Give the location an original name, be creative!
                </Form.FormDescription>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>
        <div>
          <Form.FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Description</Form.FormLabel>
                <Form.FormControl>
                  <div className="relative">
                    <Textarea
                      className="w-full bg-background pr-16"
                      {...field}
                      maxLength={MAX_DESCRIPTION_LENGTH}
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                      {field.value.length}/{MAX_DESCRIPTION_LENGTH}
                    </div>
                  </div>
                </Form.FormControl>
                <Form.FormMessage />
                <Form.FormDescription>
                  Describe this location in detail. What makes it special?
                </Form.FormDescription>
              </Form.FormItem>
            )}
          />
        </div>
        <div>
          <Form.FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Tags</Form.FormLabel>
                <Form.FormControl>
                  <div className="relative">
                    <Input
                      className="w-full bg-background pr-16"
                      value={tagInput}
                      onChange={e => {
                        const value = e.target.value;
                        setTagInput(value);

                        const tagsArray = value
                          .split(',')
                          .map(tag => tag.trim())
                          .filter(Boolean);

                        // Always allow edits by updating the field value
                        // This enables removing tags even at max limit
                        field.onChange(tagsArray.slice(0, MAX_TAGS_LENGTH));

                        // If more than max, only show max in the input
                        if (tagsArray.length > MAX_TAGS_LENGTH) {
                          // Update input to reflect only the allowed tags
                          setTagInput(tagsArray.slice(0, MAX_TAGS_LENGTH).join(', '));
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {field.value?.length ?? 0}/{MAX_TAGS_LENGTH}
                    </div>
                  </div>
                </Form.FormControl>
                {field.value && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <Form.FormMessage />
                <Form.FormDescription>
                  Enter tags separated by commas. e.g. hiking, nature, beach. Tags let other users
                  find your location more easily.
                </Form.FormDescription>
              </Form.FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <Form.FormLabel>Location</Form.FormLabel>
          <div className="relative h-52 w-full rounded-md border-4 border-background overflow-hidden">
            <ChooseLocationMap
              onLocationChange={handleLocationChange}
              initialLatitude={0}
              initialLongitude={0}
              initialZoom={3.5}
            />
          </div>
          <div className="grid grid-cols-2 text-sm gap-2">
            <div className="grid grid-cols-4 bg-background divide-x divide-muted rounded">
              <div className="px-2 py-1 text-muted-foreground flex-shrink-0">lat</div>
              <div className="px-2 col-span-3 py-1 text-muted-foreground truncate">{latitude}</div>
            </div>
            <div className="grid grid-cols-4 bg-background divide-x divide-muted rounded">
              <div className="px-2 py-1 text-muted-foreground flex-shrink-0">lng</div>
              <div className="px-2 col-span-3 py-1 text-muted-foreground truncate">{longitude}</div>
            </div>
          </div>
          <Form.FormDescription>
            Drag the marker and place it on top of the location you want to submit. Press the
            geolocate control in the top right corner if you want to use your current location.
          </Form.FormDescription>
        </div>
        <div className="space-y-2">
          <Form.FormLabel>Images</Form.FormLabel>
          <ImageDropzone onChange={handleImagesChange} className="mt-2">
            <Form.FormDescription>
              Upload photos of this location to help others find it
            </Form.FormDescription>
          </ImageDropzone>
        </div>
        <div>
          <Button type="submit" className="w-full">
            Create Location
          </Button>
        </div>
      </form>
    </Form.Form>
  );
};
