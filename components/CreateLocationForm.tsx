'use client';

import { z } from 'zod';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';

import * as Form from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Location name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  latitude: z
    .number({ invalid_type_error: 'Latitude must be a number' })
    .min(-90, { message: 'Latitude must be between -90 and 90' })
    .max(90, { message: 'Latitude must be between -90 and 90' }),
  longitude: z
    .number({ invalid_type_error: 'Longitude must be a number' })
    .min(-180, { message: 'Longitude must be between -180 and 180' })
    .max(180, { message: 'Longitude must be between -180 and 180' }),
  address: z.string().optional(),
  city: z.string().min(1, { message: 'City is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  tags: z.array(z.string()).optional(),
  safety_info: z.string().optional(),
  accessibility: z.string().optional(),
});

type FormFields = z.infer<typeof formSchema>;

type CreateLocationFormProps = {
  selectedLocation?: { latitude: number; longitude: number } | null;
  onRequestLocationSelect?: () => void;
  isSelectingLocation?: boolean;
  setIsSelectingLocation?: (isSelecting: boolean) => void;
};

export const CreateLocationForm = ({
  selectedLocation,
  onRequestLocationSelect,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSelectingLocation,
  setIsSelectingLocation,
}: CreateLocationFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      latitude: 0,
      longitude: 0,
      address: '',
      city: '',
      country: '',
      tags: [],
      safety_info: '',
      accessibility: '',
    },
  });

  const [tagInput, setTagInput] = useState('');

  // Add the dropzone configuration here

  // Update form coordinates when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      form.setValue('latitude', selectedLocation.latitude);
      form.setValue('longitude', selectedLocation.longitude);
    }
  }, [selectedLocation, form]);

  const onSubmit: SubmitHandler<FormFields> = async values => {
    // First try to create the location
    const createLocationResponse = await axios.post('api/locations', {
      name: values.name,
      description: values.description,
      latitude: values.latitude,
      longitude: values.longitude,
      address: values.address,
      city: values.city,
      country: values.country,
      tags: values.tags,
      safety_info: values.safety_info,
      accessibility: values.accessibility,
    });

    if (createLocationResponse.status === 400) {
      toast.error('Failed to create location');
      return;
    }

    // Upload images using FormData after successful location creation
    const formData = new FormData();
    // console.log("Images to upload:", images); // Debug log

    // images.forEach((image) => {
    //   formData.append("images", image);
    // });

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
  };

  return (
    <Form.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-5">
        <h2 className="text-2xl font-bold">Create Location</h2>
        <div className="space-y-4">
          <Form.FormLabel>Location Coordinates</Form.FormLabel>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (onRequestLocationSelect) {
                onRequestLocationSelect();
              }
              if (setIsSelectingLocation) {
                setIsSelectingLocation(true);
              }
            }}
            className="flex w-full h-20 items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Select Location on Map
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Form.FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <Form.FormItem>
                  <Form.FormLabel>Latitude</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      type="number"
                      placeholder="Latitude"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className={selectedLocation ? 'border-green-500' : ''}
                      readOnly
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />

            <Form.FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <Form.FormItem>
                  <Form.FormLabel>Longitude</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      type="number"
                      placeholder="Longitude"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className={selectedLocation ? 'border-green-500' : ''}
                      readOnly
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <Form.FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Location Name</Form.FormLabel>
                <Form.FormControl>
                  <Input placeholder="Enter location name" {...field} />
                </Form.FormControl>
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
                  <Textarea placeholder="Describe this location" {...field} />
                </Form.FormControl>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>

        <div className="not-prose flex flex-col gap-4">
          <Form.FormLabel>Images</Form.FormLabel>
        </div>

        <div>
          <Form.FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Tags</Form.FormLabel>
                <Form.FormDescription>Enter tags separated by commas</Form.FormDescription>
                <Form.FormControl>
                  <Input
                    placeholder="e.g. hiking, nature, beach"
                    value={tagInput}
                    onChange={e => {
                      const value = e.target.value;
                      setTagInput(value);

                      const tagsArray = value
                        .split(',')
                        .map(tag => tag.trim())
                        .filter(Boolean);
                      field.onChange(tagsArray);
                    }}
                  />
                </Form.FormControl>
                {field.value && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>City</Form.FormLabel>
                <Form.FormControl>
                  <Input placeholder="City" {...field} />
                </Form.FormControl>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />

          <Form.FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Country</Form.FormLabel>
                <Form.FormControl>
                  <Input placeholder="Country" {...field} />
                </Form.FormControl>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>

        <div>
          <Form.FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Address (Optional)</Form.FormLabel>
                <Form.FormControl>
                  <Input placeholder="Street address" {...field} />
                </Form.FormControl>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>

        <div>
          <Form.FormField
            control={form.control}
            name="safety_info"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Safety Information (Optional)</Form.FormLabel>
                <Form.FormControl>
                  <Textarea placeholder="Any safety concerns or tips" {...field} />
                </Form.FormControl>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>

        <div>
          <Form.FormField
            control={form.control}
            name="accessibility"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Accessibility Information (Optional)</Form.FormLabel>
                <Form.FormControl>
                  <Textarea placeholder="How accessible is this location?" {...field} />
                </Form.FormControl>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>

        <div>
          <Button type="submit" disabled={!selectedLocation} className="w-full">
            Create Location
          </Button>
          {!selectedLocation && (
            <p className="text-sm text-amber-500 text-center mt-4">
              Please select a location on the map before submitting
            </p>
          )}
        </div>
      </form>
    </Form.Form>
  );
};
