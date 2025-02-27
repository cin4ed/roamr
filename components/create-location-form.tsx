"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(1, { message: "Location name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  latitude: z
    .number({ invalid_type_error: "Latitude must be a number" })
    .min(-90, { message: "Latitude must be between -90 and 90" })
    .max(90, { message: "Latitude must be between -90 and 90" }),
  longitude: z
    .number({ invalid_type_error: "Longitude must be a number" })
    .min(-180, { message: "Longitude must be between -180 and 180" })
    .max(180, { message: "Longitude must be between -180 and 180" }),
  address: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  tags: z.array(z.string()).optional(),
  safetyInfo: z.string().optional(),
  accessibility: z.string().optional(),
});

type CreateLocationFormProps = {
  selectedLocation?: { latitude: number; longitude: number } | null;
  onRequestLocationSelect?: () => void;
}

export function CreateLocationForm({ selectedLocation, onRequestLocationSelect }: CreateLocationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      latitude: 0,
      longitude: 0,
      address: "",
      city: "",
      country: "",
      tags: [],
      safetyInfo: "",
      accessibility: "",
    },
  });

  const [tagInput, setTagInput] = React.useState("");

  // Update form when selectedLocation changes
  React.useEffect(() => {
    if (selectedLocation) {
      form.setValue('latitude', selectedLocation.latitude);
      form.setValue('longitude', selectedLocation.longitude);
    }
  }, [selectedLocation, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" bg-zinc-900 p-4 border border-zinc-800 rounded-lg divide-y divide-dashed divide-zinc-800">
        <h2 className="text-2xl font-bold">Create Location</h2>
        <div className="space-y-4 pb-8">
          <FormLabel>Location Coordinates</FormLabel>
          <Button
            type="button"
            variant="secondary"
            onClick={onRequestLocationSelect}
            className="flex w-full h-20 items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Select Location on Map
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Latitude"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className={selectedLocation ? "border-green-500" : ""}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Longitude"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className={selectedLocation ? "border-green-500" : ""}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="py-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="py-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe this location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="py-8">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormDescription>Enter tags separated by commas</FormDescription>
              <FormControl>
                <Input
                  placeholder="e.g. hiking, nature, beach"
                  value={tagInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTagInput(value);

                    const tagsArray = value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(Boolean);
                    field.onChange(tagsArray);
                  }}
                />
              </FormControl>
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        </div>


        <div className="grid grid-cols-2 gap-4 py-8">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="py-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <div className="py-8">
        <FormField
          control={form.control}
          name="safetyInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Safety Information (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any safety concerns or tips" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <div className="py-8">
        <FormField
          control={form.control}
          name="accessibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility Information (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="How accessible is this location?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <div className="py-8">
        <Button
          type="submit"
          disabled={!selectedLocation}
          className="w-full"
        >
          Create Location
        </Button>
        {!selectedLocation && (
          <p className="text-sm text-amber-500 text-center">Please select a location on the map before submitting</p>
        )}
        </div>
      </form>
    </Form>
  );
}
