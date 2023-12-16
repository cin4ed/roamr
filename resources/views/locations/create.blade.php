<x-app-layout>
    <x-slot name="head">
        @include('scripts.mapbox')

        <style>
            #map {
                border-radius: 0.375rem;
                overflow: hidden;
            }
        </style>
    </x-slot>

    <div class="md:w-3/5 mx-auto">
        <h1 class="text-xl font-bold mt-2 dark:text-neutral-300">Add a new location</h1>
        @if ($errors->any())
            <div class="bg-neutral-600 rounded-md p-2 mt-2">
                <ul class="list-disc list-inside text-neutral-300">
                    @foreach ($errors->all() as $error)
                        <li class="text-sm">{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        <form class="mt-2" method="POST" enctype="multipart/form-data" action="{{ route('locations.store')}}">
            @csrf
            <div>
                <x-input-label for="location" :value="__('Location')"/>
                <div class="relative">
                    <div id="map" class="h-52 w-full md:h-96 mt-2 rounded-md overflow-hidden"></div>
                </div>
                <div class="mt-2">
                    <x-input-label for="longitude" :value="__('Longitude')"/>
                    <x-text-input type="number" name="longitude" id="input-longitude" readonly
                                  class="block mt-1 w-full" placeholder="xx.xxxxxxxxxx"/>
                </div>
                <div class="mt-2">
                    <x-input-label for="latitude" :value="__('Latitude')"/>
                    <x-text-input type="number" name="latitude" id="input-latitude" readonly
                                  class="block mt-1 w-full" placeholder="xx.xxxxxxxxxx"/>
                </div>
                <hr class="mt-3 opacity-40 border-gray-300 dark:border-neutral-700">
                <x-primary-button type="button" id="btn-curr-loc"
                                  class="flex justify-center items-center gap-4 mt-3 h-9 w-full">
                    Use current location
                    <x-fluentui-my-location-16-o class="h-5 text-neutral-300"/>
                </x-primary-button>
            </div>
            <div class="mt-2">
                <x-input-label for="name" :value="__('Name')"/>
                <x-text-input type="text" name="name" required
                              class="block mt-1 w-full" placeholder="Name of the location"/>
            </div>
            <div class="mt-2">
                <x-input-label for="description" :value="__('Description')"/>
                <x-text-input type="text" name="description" class="block mt-1 w-full"
                              placeholder="Some description..."/>
            </div>
            <div class="mt-2">
                <x-input-label for="images" :value="__('Images')"/>
                <div class="flex items-center justify-center w-full mt-2">
                    <label for="dropzone-file"
                           class="flex flex-col items-center justify-center w-full h-48 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-neutral-500" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-neutral-500"><span class="font-semibold">Click to upload</span>
                                or drag and drop</p>
                            <p class="text-xs text-neutral-500">PNG, JPG or JPEG (MAX. 800x400px)</p>
                        </div>
                        <input id="input-image" name="images[]" type="file" multiple
                               accept="image/png, image/jpg, image/jpeg" class=""/>
                    </label>
                </div>
            </div>
            <x-primary-button class="w-full block mt-4 mb-10 h-10">Create</x-primary-button>
        </form>
    </div>

    <script>
      const defaultLocation = [-111.3392, 26.01461]

      // Set map
      mapboxgl.accessToken =
        'pk.eyJ1Ijoia2VubmV0aC1xdWludGVybyIsImEiOiJjbGU1bmlsc2gwOHZvM25wM2NwZXVrZnVhIn0.pWzKCuC-uYwHxJm0vThQFQ'

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: defaultLocation,
        zoom: 12,
      })

      // Set marker
      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat(defaultLocation)
        .addTo(map)

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat()
        document.getElementById('input-longitude').value = lngLat.lng
        document.getElementById('input-latitude').value = lngLat.lat
      })

      // Set map to user's location if allowed
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((data) => {
          marker.setLngLat([data.coords.longitude, data.coords.latitude])
          document.getElementById('input-longitude').value = data.coords.longitude
          document.getElementById('input-latitude').value = data.coords.latitude
          map.setCenter([data.coords.longitude, data.coords.latitude])
        })
      }

      // Set current coords as location's coords
      document.getElementById('btn-curr-loc').addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition((data) => {
          marker.setLngLat([data.coords.longitude, data.coords.latitude])

          document.getElementById('input-longitude').value = data.coords.longitude
          document.getElementById('input-latitude').value = data.coords.latitude

          map.flyTo({
            center: [data.coords.longitude, data.coords.latitude],
            zoom: 12,
            essential: true
          })
        })
      })
    </script>
</x-app-layout>
