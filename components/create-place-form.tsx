"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Location {
  id: number;
  lat: number;
  lng: number;
}

interface Images {
  id: number;
  url: string;
}

interface Place {
  id: number;
  verified: boolean;
  name: string;
  description: string;
  images: Images[];
  location: Location;
  rating: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

const formSchema = z.object({
  name: z
    .string()
    .min(5, { message: "The name must be at least 5 characters long." })
    .max(100, { message: "The name must be at most 100 characters long." }),
  description: z
    .string()
    .min(10, {
      message: "The description must be at least 10 characters long.",
    })
    .max(255, {
      message: "The description must be at most 255 characters long.",
    }),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  images: z
    .array(z.instanceof(File))
    .min(1, { message: "You must upload at least one image." }),
  rating: z.number().min(1).max(5),
});

export function CreatePlaceForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: { lat: 0, lng: 0 },
      images: [],
      rating: 1,
    },
  });
}
