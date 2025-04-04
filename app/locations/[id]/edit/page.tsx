'use client';

import { createClient } from '@/utils/supabase/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import type { Location } from '@/types';

interface ILocationInput {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
}

async function getLocation(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();
  if (error) {
    console.error('Error fetching location:', error);
    return null;
  }
  return data;
}

export default function LocationEditPage() {
  const params = useParams();
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const { register, handleSubmit, reset } = useForm<ILocationInput>();

  const onSubmit: SubmitHandler<ILocationInput> = async data => {
    const supabase = await createClient();
    const { data: newData, error } = await supabase
      .from('locations')
      .update({
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        country: data.country,
      })
      .eq('id', params.id as string)
      .select();

    if (error) {
      console.error('Error updating location:', error);
      return;
    }

    if (!newData || newData.length === 0) {
      console.error('No location was updated');
      return;
    }

    console.log('Location updated:', newData[0]);
    router.push(`/locations/${params.id}`);
  };

  useEffect(() => {
    getLocation(params.id as string).then(location => {
      setLocation(location);
      if (location) {
        reset(location);
      }
    });
  }, [params.id, reset]);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <>
      {location ? (
        <>
          <h1 className="px-2 text-2xl font-bold text-primary lg:px-0">
            Editing location: {location.name}
          </h1>
          <div className="flex justify-between px-2 lg:px-0">
            <div>
              <Link
                href={`/locations/explore?location=${location.id}`}
                className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
              >
                Show on map
              </Link>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/locations/${location.id}`}
                className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
              >
                View
              </Link>
              <Link
                href={`/locations/${location.id}/history`}
                className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
              >
                History
              </Link>
            </div>
          </div>
          <hr className="mx-2 my-4 border-dashed border-primary lg:mx-0" />
          <form onSubmit={handleSubmit(onSubmit)} className="px-2 lg:px-0">
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Short description
              </label>
              <textarea
                id="description"
                {...register('description')}
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register('address')}
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register('city')}
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="country" className="text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                {...register('country')}
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-white">
              Save
            </button>
          </form>
        </>
      ) : (
        <div className="container mx-auto p-6 text-center">Location not found.</div>
      )}
    </>
  );
}
