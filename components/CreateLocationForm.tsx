'use client';

import { z } from 'zod';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChooseLocationMap } from '@/components/ChooseLocationMap';
import * as Form from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/utils/utils';

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
  className?: string;
};

export const CreateLocationForm = ({
  selectedLocation,
  onRequestLocationSelect,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSelectingLocation,
  setIsSelectingLocation,
  className,
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
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(selectedLocation || null);

  // Update component state when prop changes
  useEffect(() => {
    if (selectedLocation) {
      setCurrentLocation(selectedLocation);
    }
  }, [selectedLocation]);

  // Update form coordinates when currentLocation changes
  useEffect(() => {
    if (currentLocation) {
      form.setValue('latitude', currentLocation.latitude);
      form.setValue('longitude', currentLocation.longitude);
    }
  }, [currentLocation, form]);

  const handleLocationSelected = (latitude: number, longitude: number) => {
    setCurrentLocation({ latitude, longitude });
  };

  const handleEditLocation = () => {
    setShowMap(true);
    if (onRequestLocationSelect) {
      onRequestLocationSelect();
    }
    if (setIsSelectingLocation) {
      setIsSelectingLocation(true);
    }
  };

  const handleCloseMap = () => {
    setShowMap(false);
    if (setIsSelectingLocation) {
      setIsSelectingLocation(false);
    }
  };

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
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
        <div>
          <Form.FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Name</Form.FormLabel>
                <Form.FormControl>
                  <Input className="w-full bg-background" {...field} />
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
                  <Textarea className="w-full bg-background" {...field} />
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
                  <Input
                    className="w-full bg-background"
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
                <Form.FormDescription>
                  Enter tags separated by commas. e.g. hiking, nature, beach. Tags let other users
                  find your location more easily.
                </Form.FormDescription>
              </Form.FormItem>
            )}
          />
        </div>

        {/* Choose a location on the map */}
        <div className="space-y-2">
          <Form.FormLabel>Location</Form.FormLabel>
          <div className="relative h-36 w-full rounded-md overflow-hidden">
            {showMap ? (
              <>
                <ChooseLocationMap
                  onLocationSelected={handleLocationSelected}
                  initialLatitude={currentLocation?.latitude}
                  initialLongitude={currentLocation?.longitude}
                  initialZoom={currentLocation ? 10 : 3.5}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={handleCloseMap}
                >
                  Done
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted">
                {currentLocation ? (
                  <div className="text-center">
                    <p className="text-sm mb-2">
                      Selected location: {currentLocation.latitude.toFixed(4)},{' '}
                      {currentLocation.longitude.toFixed(4)}
                    </p>
                    <Button onClick={handleEditLocation}>Edit Location</Button>
                  </div>
                ) : (
                  <Button onClick={handleEditLocation}>Choose Location on Map</Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <Button type="submit" disabled={!currentLocation} className="w-full">
            Create Location
          </Button>
          {!currentLocation && (
            <p className="text-sm text-amber-500 text-center mt-4">
              Please select a location on the map before submitting
            </p>
          )}
        </div>
      </form>
    </Form.Form>
  );
};
